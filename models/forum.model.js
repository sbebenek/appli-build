const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Mongoose require Data Shema
const DataSchema = new Schema({
        content:  {
            type: String
        },
        topic: {
            type: String
        },
        replies: {
            type: Array
        }
    },
    { collection: 'posts' },
    { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("ForumThread", DataSchema);