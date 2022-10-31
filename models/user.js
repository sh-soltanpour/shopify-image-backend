const mongoose = require("mongoose"),
    bcrypt = require('bcrypt');

const SALT_LEN = 6;
const Schema = mongoose.Schema(
    {
        email: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        date_joined: {type: Date, required: true, default: Date.now()},
    },
    {collection: "users"}
);

Schema.pre("save", function (next) {
    const user = this;
    //hashing password
    bcrypt.genSalt(SALT_LEN, (err, salt) => {
        if (err) {
            next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                next(err);
            }
            user.password = hash;
            next();
        });
    });
});
module.exports = mongoose.model("User", Schema);