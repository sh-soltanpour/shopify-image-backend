const mongoose = require("mongoose")

const Schema = mongoose.Schema(
    {
        link: {type: String, required: true},
        title: {type: String, required: true},
        description: {type: String},
        date_created: {type: Date, required: true, default: Date.now()},
        owner: {type: String, ref: "User", required: true, index: true},
        private: {type: Boolean, required: true, default: false}
    },
    {collection: "images"}
);
Schema.index({name: "text", "title": "text", "description": "text"});
module.exports = mongoose.model("Image", Schema);