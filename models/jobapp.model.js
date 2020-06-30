const mongoose = require('mongoose');

// access schema object:
const Schema = mongoose.Schema;

// describe Schema as an object
let JobApp = new Schema({

    jobapp_title: {
        type: String
    },

    jobapp_postlink : {
        type: String
    },

    jobapp_postingID : {
        type: String
    },

    jobapp_companyname : {
        type: String
    },

    jobapp_companyphone : {
        type: String
    },

    jobapp_companywebsite : {
        type: String
    },

    jobapp_applydate : {
        type: Date
    },

    jobapp_followupdate : {
        type: Date
    },

    jobapp_contactfirstname: {
        type: String
    },

    jobapp_contactlastname: {
        type: String
    },

    jobapp_contactphone: {
        type: String
    },

    jobapp_contactemail: {
        type: String
    },

    jobapp_resume: {
        type: String
    },

    jobapp_cv: {
        type: String
    },

    jobapp_notes: {
        type: String
    },

    jobapp_status:{
        type: Boolean
    }

    // ,
    //
    // user_id:{
    //     type: String,
    //     required: true
    // }
});



// Schema needs to be exported so it can be imported
// Create a model from our schema, model name is JobApp which is based on the schema JobApp
module.exports = mongoose.model('JobApp', JobApp);