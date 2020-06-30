const express = require('express');
const appliRoutes = express.Router();
let Contact = require('../models/contact.model');

// ---------- Contacts End Points ---------- //

// Endpoint 1 - Show All Contacts:
appliRoutes.route('/contacts').get(function(req, res){
    Contact.find(function(err, contacts){
        if (err) {
            console.log(err);
        } else {
            res.json(contacts);
        }
    }).sort({contact_firstname: 1});
});

// Endpoint 2 - Show a Single Contact:
appliRoutes.route('/contacts/:id').get(function(req, res){
    let id = req.params.id;
    Contact.findById(id, function(err, contact){
        res.json(contact);
    });
});

// Endpoint 3 - Add New Contact:
appliRoutes.route('/contacts/add').post(function(req, res){
    let contact = new Contact(req.body);
    contact.save()
        .then(contact => {
            res.status(200).json({'Contact': 'contact added successully'});
        })
        .catch(err => {
            res.status(400).send('Adding new contact failed');
            console.log(err.response);
        });
});

// Endpoint 4 - Update a Contact:
appliRoutes.route('/contacts/update/:id').post(function(req, res) {
    Contact.findById(req.params.id, function(err, contact){
        if (!contact)
            res.status(404).send("Data not found");
        else
            contact.contact_firstname = req.body.contact_firstname;
            contact.contact_lastname = req.body.contact_lastname;
            contact.contact_linkedin = req.body.contact_linkedin;
            contact.contact_phone = req.body.contact_phone;
            contact.contact_email = req.body.contact_email;
            contact.contact_company = req.body.contact_company;
            contact.contact_jobtitle = req.body.contact_jobtitle;
            contact.contact_datemet = req.body.contact_datemet;
            contact.contact_notes = req.body.contact_notes;

        contact.save()
            .then(contact => {
                res.json('Contact updated')
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});


// Endpoint 5 - Delete a Contact:
appliRoutes.route('/contacts/delete/:id').get(function(req, res) {
    Contact.findByIdAndDelete({_id: req.params.id}, function(err, contact){
        if (!contact)
            res.status(404).send("Data not found");
        else res.json('Networking Event successfully deleted')
    });
});


module.exports = appliRoutes;