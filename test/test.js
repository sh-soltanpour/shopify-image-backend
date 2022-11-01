const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const User = require("../models/user")
const Image = require("../models/image")
const {generateAccessToken} = require("../routes/auth/token_generator");

let user;
let token;
let image;
/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connection.close();
    await mongoose.connect("mongodb://localhost:27017/test_db");

    user = await new User({
        email: "test@gmail.com",
        password: "test"
    }).save()
    token = generateAccessToken(user.email)

    image = await new Image({
        link: "test.com",
        description: "This is test image",
        owner: user._id,
        title: "Test"
    }).save()
});

/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.db.dropCollection("users");
    await mongoose.connection.db.dropCollection("images");
    await mongoose.connection.close();
});

describe("Test Authentication", () => {
    it("Register new user", async () => {
        const reqBody = {
            email: "shahryar2@gmail.com",
            password: "12345678"
        };
        const res = await request(app)
            .post("/auth/register")
            .set("Authorization", "Bearer " + token)
            .send(reqBody);

        expect(res.statusCode).toBe(201);
    });
    it("Register existing user", async () => {
        const reqBody = {
            email: "test@gmail.com",
            password: "12345678"
        };
        const res = await request(app)
            .post("/auth/register")
            .set("Authorization", "Bearer " + token)
            .send(reqBody);

        expect(res.statusCode).toBe(400);
    });

    it("Login and getting access token", async () => {
        const reqBody = {
            email: "test@gmail.com",
            password: "test"
        };
        const res = await request(app)
            .post("/auth/login")
            .set("Authorization", "Bearer " + token)
            .send(reqBody);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.accessToken).toBeDefined();
    });

    it("Login with wrong credentials", async () => {
        const reqBody = {
            email: "test@gmail.com",
            password: "wrongPassword"
        };
        const res = await request(app)
            .post("/auth/login")
            .set("Authorization", "Bearer " + token)
            .send(reqBody);

        expect(res.statusCode).toBe(401);
    });
});


describe("Test Images functionality", () => {
    it("Search for images", async () => {
        const res = await request(app).get("/images/search/Test").set("Authorization", "Bearer " + token);
        expect(res.statusCode).toBe(200);
        expect(res.body.images).toBeDefined()
        expect(res.body.images.length).toBeGreaterThan(0);
    });

    it("Upload single image", async () => {
        const reqBody = {
            'link': "test.com",
            'description': 'desc',
            'title': 'image title'
        }
        const res = await request(app)
            .post("/images/")
            .set("Authorization", "Bearer " + token)
            .send(reqBody);
        expect(res.statusCode).toBe(200);
        expect(res.body.image).toBeDefined()
    });

    it("Delete single image", async () => {
        const reqBody = {
            'id': image._id
        }
        const res = await request(app)
            .delete("/images/" + image._id)
            .set("Authorization", "Bearer " + token);
        expect(res.statusCode).toBe(200);
    });

    it("Upload bulk image", async () => {
        const image_body = {
            'link': "test.com",
            'description': 'desc',
            'title': 'image title'
        }
        const reqBody = {images: [image_body, image_body, image_body]}
        const res = await request(app)
            .post("/images/bulk")
            .set("Authorization", "Bearer " + token)
            .send(reqBody);
        expect(res.statusCode).toBe(200);
        expect(res.body.savedImages).toBeDefined()
        expect(res.body.savedImages.length).toBe(3);
    });

    it("Delete bulk image", async () => {
        const reqBody = {
            images: [
                {'id': image._id}
            ]
        }
        const res = await request(app)
            .delete("/images/bulk")
            .set("Authorization", "Bearer " + token)
            .send(reqBody);
        expect(res.statusCode).toBe(200);
        expect(res.body.deletedCount).toBe(1);
    });
});