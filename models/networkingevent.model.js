const mongoose = require('mongoose');

// access schema object:
const Schema = mongoose.Schema;

// describe Schema as an object
let Event = new Schema({

    event_title: {
        type: String
    },

    event_description : {
        type: String
    },

    event_date : {
        type: Date
    },

    event_location: {
        type: String
    },

    event_link : {
        type: String
    },

    event_host : {
        type: String
    },

    event_rating : {
        type: Number
    },

    event_notes: {
        type: String
    },

    //Sam's additions - need to know if an event is public, and who made it so that only that person can run CRUD functions on it
    event_is_public: {
        type: Boolean
    },
    event_creator_id:{
        type: mongoose.Schema.Types.ObjectId, ref: 'userSchema'
        //required: true
    },
    event_attendees: {
        type: Array
    }
});



// Schema needs to be exported so it can be imported
// Create a model from our schema, model name is event which is based on the schema Event
module.exports = mongoose.model('Event', Event);