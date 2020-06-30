const express = require('express');
const appliRoutes = express.Router();
let Jobapp = require('../models/jobapp.model');

// ---------- Job Application End Points ---------- //

// Bring in endpoints; .route is extends: app.use('/jobapp', appliRoutes); therefore it needs the /
// Sending a get request to localhost PORT 4000/jobapp/
// To accept get requests, you need to call .get and takes a callback function

// Endpoint 1 - Show All Job Applications:
appliRoutes.route('/jobapps').get(function(req, res){
    var dateObj = new Date(req.query.date);
    var lessDateObj = new Date(req.query.date);
    lessDateObj.setHours(24,0,0,0);
    Jobapp.find(
        //This is used in the Calendar Component to grab only Job Applications on a specific date
        //if no date is specified grab all Job Applications
        {
            jobapp_applydate: {
                $gte: req.query.date === undefined ? new Date("January 1, 1970 00:00:00") : dateObj,
                $lt: req.query.date === undefined ? new Date("December 31, 9999 00:00:00") : lessDateObj
            }
        },
        function(err, jobapp){
            if (err) {
                console.log(err);
            } else {
                res.json(jobapp);
            }
        }).sort({jobapp_applydate: -1});
});

// Endpoint 2 - Show a single Job Application:
appliRoutes.route('/jobapps/id/:id').get(function(req, res){
    let id = req.params.id;
    Jobapp.findById(id, function(err, jobapp){
        res.json(jobapp);
    });
});

// Endpoint 3 - Add New Job Application:
appliRoutes.route('/jobapps/add').post(function(req, res){
    let jobapp = new Jobapp(req.body);
    jobapp.save()
        .then(jobapp => {
            res.status(200).json({'jobapp': 'jobapp added successully'});
        })
        .catch(err => {
            res.status(400).send('Adding new jobapp failed')
        });

})


// Endpoint 4 - Update a Job Application:
appliRoutes.route('/jobapps/update/:id').post(function(req, res) {
    Jobapp.findById(req.params.id, function(err, jobapp){
        if (!jobapp)
            res.status(404).send("Data not found");
        else
            jobapp.jobapp_title = req.body.jobapp_title;
            jobapp.jobapp_description = req.body.jobapp_description;
            jobapp.jobapp_postlink = req.body.jobapp_postlink;
            jobapp.jobapp_postingID = req.body.jobapp_postingID;
            jobapp.jobapp_companyname = req.body.jobapp_companyname;
            jobapp.jobapp_companyphone = req.body.jobapp_companyphone;
            jobapp.jobapp_companywebsite = req.body.jobapp_companywebsite;
            jobapp.jobapp_applydate = req.body.jobapp_applydate;
            jobapp.jobapp_followupdate = req.body.jobapp_followupdate;
            jobapp.jobapp_contactfirstname = req.body.jobapp_contactfirstname;
            jobapp.jobapp_contactlastname = req.body.jobapp_contactlastname;
            jobapp.jobapp_contactphone = req.body.jobapp_contactphone;
            jobapp.jobapp_contactemail = req.body.jobapp_contactemail;
            jobapp.jobapp_resume = req.body.jobapp_resume;
            jobapp.jobapp_cv = req.body.jobapp_cv;
            jobapp.jobapp_notes = req.body.jobapp_notes;
            jobapp.jobapp_status = req.body.jobapp_status;

            jobapp.save()
            .then(jobapp => {
                res.json('Jobapp updated')
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

appliRoutes.route('/jobapps/page/:page?').get(function(req, res){
    let page = req.params.page !== null ? req.params.page : 1;
    const perPage = 10;
    Jobapp.find().limit(perPage).skip(perPage * (page - 1)).exec(function(err, jobapp){
        if (err) {
            console.log(err);
        } else {
            res.json(jobapp);
        }
    });
});

appliRoutes.route('/jobapps/count/').get(function(req, res){
    Jobapp.aggregate([
        {
            $group : {_id : null, count: { $sum: 1 }}
        },
        {
            $project: {
                _id: 0,
                'value': '$count'
            }
        }

    ],function(err, data){
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }
    });
});




// Endpoint 5 - Delete Job Application:
appliRoutes.route('/jobapps/delete/:id').get(function(req, res) {
    Jobapp.findByIdAndDelete({_id: req.params.id}, function(err, contact){
        if (!contact)
            res.status(404).send("Data not found");
        else res.json('Job Application successfully deleted')
    });
});

module.exports = appliRoutes;