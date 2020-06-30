const mongoose = require('mongoose');

// access schema object:
const Schema = mongoose.Schema;

// describe Schema as an object
let Contact = new Schema({

    contact_firstname: {
        type: String
    },

    contact_lastname: {
        type: String
    },

    contact_linkedin: {
        type: String
    },

    contact_email: {
        type: String
    },

    contact_phone: {
        type: String
    },

    contact_company: {
        type: String
    },

    contact_jobtitle: {
        type: String
    },

    contact_datemet: {
        type: Date
    },

    contact_notes: {
        type: String
    }
    // ,
    //
    // user_id:{
    //     type: String,
    //     required: true
    // }

});


// Schema needs to be exported so it can be imported
// Create a model from our schema, model name is Contact which is based on the schema Contact
module.exports = mongoose.model('Contact', Contact);