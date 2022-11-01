const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const User = require("../models/user")
const Image = require("../models/image")
const {generateAccessToken} = require("../routes/auth/token_generator");

let user;
let token;
/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connection.close();
    await mongoose.connect("mongodb://localhost:27017/test_db");

    user = await new User({
        email: "test@gmail.com",
        password: "test"
    }).save()
    token = generateAccessToken(user.email)

    const image = await new Image({
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
describe("GET /api/images", () => {
    it("Search for images", async () => {
        const res = await request(app).get("/images/search/Test").set("Authorization", "Bearer " + token);
        expect(res.statusCode).toBe(200);
        expect(res.body.images).toBeDefined()
        expect(res.body.images.length).toBeGreaterThan(0);
    });
});