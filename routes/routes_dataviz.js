const express = require('express');
const appliRoutes = express.Router();
let Jobapp = require('../models/jobapp.model');




// Endpoint 1 - Get all calendar data:
appliRoutes.route('/calendarviz').get(function(req, res){
    Jobapp.aggregate([
        {
            $group : {_id : {$dateToString: {format: "%G-%m-%d",date: "$jobapp_applydate"}}, count: { $sum: 1 }}
        },
        {
            $project: {
                _id: 0,
                day: "$_id",
                'value': '$count'
            }
        }

    ],function(err, calData){
        if (err) {
            console.log(err);
        } else {
            res.json(calData);
        }
    });
});

appliRoutes.route('/calendarviz/getByDate/:date').get(function(req, res){
    let date = req.params.date;
    Jobapp.aggregate([
        {
            $addFields : {'formatDate' : {$dateToString: {format: "%G-%m-%d",date: "$jobapp_applydate"}}}
        },
        {
            $match : {'formatDate' : date}
        },


    ],function(err, calData){
        if (err) {
            console.log(err);
        } else {
            res.json(calData);
        }
    });
});


appliRoutes.route('/graphviz').get(function(req, res){
    Jobapp.aggregate([
        {
            $group : {_id : {$dateToString: {format: "%G-%m",date: "$jobapp_applydate"}}, count: { $sum: 1 }}
        },
        {
            $project: {
                _id: 0,
                'x': "$_id",
                'y': '$count'
            }
        },
        {
            $sort: {
                'x': 1,
            }
        }

    ],function(err, calData){
        if (err) {
            console.log(err);
        } else {
            res.json(calData);
        }
    });
});

appliRoutes.route('/graphviz/getDaysByMonth/:month').get(function(req, res){
    let date = req.params.month;
    Jobapp.aggregate([
        {
            $addFields : {'formatDate' : {$dateToString: {format: "%G-%m",date: "$jobapp_applydate"}}}
        },
        {
            $match : {'formatDate' : date}
        },
        {
            $group : {_id : {$dateToString: {format: "%G-%m-%d",date: "$jobapp_applydate"}}, count: { $sum: 1 }}
        },
        {
            $project: {
                _id: 0,
                'x': "$_id",
                'y': '$count'
            }
        },
        {
            $sort: {
                'x': 1,
            }
        }


    ],function(err, calData){
        if (err) {
            console.log(err);
        } else {
            res.json(calData);
        }
    });
});


module.exports = appliRoutes;