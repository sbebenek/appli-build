const express = require('express');
const appliRoutes = express.Router();
let NetworkingEvent = require('../models/networkingevent.model');

// ---------- Networking Events End Points ---------- //

// Endpoint 1 - Show All Networking Events - ORDER BY DATE:
appliRoutes.route('/networking').get(function (req, res) {
    console.log("============");
    console.log("Sending list of all Networking Events to the front-end...");
    var dateObj = new Date(req.query.date);
    var lessDateObj = new Date(req.query.date);
    lessDateObj.setHours(24, 0, 0, 0);
    NetworkingEvent.find(
        //This is used in the Calendar Component to grab only Networking Events on a specific date
        //if no date is specified grab all Networking Events
        {
            event_date: {
                $gte: req.query.date === undefined ? new Date("January 1, 1970 00:00:00") : dateObj,
                $lt: req.query.date === undefined ? new Date("December 31, 9999 00:00:00") : lessDateObj
            }
        },
        function (err, networking) {
            if (err) {
                console.log(err);
            } else {
                res.json(networking);
            }
        }).sort({ event_date: -1 })
});

// Endpoint 2 - Show a Single Networking Event:
appliRoutes.route('/networking/:id').get(function (req, res) {
    let id = req.params.id;
    console.log("============");
    console.log("Sending networking event to the front end with id = " + id + "...");
    NetworkingEvent.findById(id, function (err, networking) {
        res.json(networking);
    });
});

// Endpoint 3 - Add Networking Event:
appliRoutes.route('/networking/add').post(function (req, res) {
    let networking = new NetworkingEvent(req.body);
    networking.save()
        .then(networking => {
            //Sam's edit - send the newly added entry to the front end
            res.status(200).json(networking);
        })
        .catch(err => {
            res.status(400).send('Adding new networking event failed')
        });
});

// Endpoint 4 - Update a Networking Event:
appliRoutes.route('/networking/update/:id').post(function (req, res) {
    NetworkingEvent.findById(req.params.id, function (err, networking) {
        if (!networking)
            res.status(404).send("Data not found");
        else
            networking.event_title = req.body.event_title;
        networking.event_description = req.body.event_description;
        networking.event_date = req.body.event_date;
        networking.event_location = req.body.event_location;
        networking.event_link = req.body.event_link;
        networking.event_host = req.body.event_host;
        networking.event_rating = req.body.event_rating;
        networking.event_notes = req.body.event_notes;
        networking.event_is_public = req.body.event_is_public; //sam's edit - add event_is_public to update route
        networking.event_creator_id = req.body.event_creator_id; //sam's edit - keep the correct creator id
        networking.event_attendees = req.body.event_attendees; //also sam's edit - keep the correct attendees

        console.log("updating event attendees with: ");
        console.log(networking.event_attendees);

        networking.save()
            .then(networking => {
                //Sam's edit - send the newly added entry to the front end
                res.status(200).json(networking)
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
})

// Endpoint 5 - Delete Networking Event:
appliRoutes.route('/networking/delete/:id').get(function (req, res) {
    NetworkingEvent.findByIdAndDelete({ _id: req.params.id }, function (err, networking) {
        if (!networking)
            res.status(404).send("Data not found");
        else res.json('Networking Event successfully deleted')
    });
});








//----------Sam's Cool Networking Routes ---------//

//-------NOTE : have to add /sam/ to all public events routes, because anything on the end without it is considered an id and is picked up by the 'show single' route above instead

//get all public events
appliRoutes.route('/networking/sam/getPublicEvents').get((req, res) => {
    console.log("============");
    console.log('Sending all public events to the front end...');
    NetworkingEvent.find({ 'event_is_public': true }).sort({ event_date: 1 })
        .then(events => res.json(events))
        .catch(err => res.status(400).json('Error: ' + err));
});

//SHORT LIST VERSION - limit 3 for the networking home page
//get all public events
appliRoutes.route('/networking/sam/getPublicEventsShort').get((req, res) => {
    console.log("============");
    console.log('Sending short public events (LIMIT 3) to the front end...');
    NetworkingEvent.find({ 'event_is_public': true }).sort({ event_date: 1 }).limit(3)
        .then((events) => {
            res.json(events);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


//get all events being attended by user with the given id
appliRoutes.route('/networking/getMyEvents/:id').get((req, res) => {
    console.log("============");
    console.log('Sending all events being attended by user with this id: ' + req.params.id + '...');
    NetworkingEvent.find({ 'event_attendees': req.params.id }).sort({ event_date: 1 })
        .then((event) => {
            res.json(event);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//SHORT LIST VERSION - limit 3 for the networking home page
//get all events being attended by user with the given id
appliRoutes.route('/networking/getMyEventsShort/:id').get((req, res) => {
    console.log("============");
    console.log("Sending short list (limit 3) of all Networking Events that are being attended by the user with id = " + req.params.id + " to the front end...");

    NetworkingEvent.find({ 'event_attendees': req.params.id }).sort({ event_date: 1 }).limit(3)
        .then((event) => {
            res.json(event);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});





//SEARCH ENDPOINTS
//get all events being attended by user with the given id
appliRoutes.route('/networking/getMyEvents/search').post((req, res) => {
    let searchParam = req.body.search_param;
    let userId = req.body.user_id;

    var regexp = new RegExp(searchParam, "gi");

    console.log("============");
    console.log('Sending all events with search param = ' + searchParam + ' being attended by user with this id: ' + userId + '...');
    //search for an event with title, description, location, or host containing the search string, that is being attended by the user with the given id
    NetworkingEvent.find({ $and: [{ 'event_attendees': userId }, { $or: [{ "event_title": regexp }, { "event_location": regexp }, { "event_description": regexp }, { "event_host": regexp }] }] }).sort({ event_date: 1 })
        .then((event) => {
            res.json(event);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//get all public events with the search params
appliRoutes.route('/networking/sam/getPublicEvents/search').post((req, res) => {
    let searchParam = req.body.search_param;
    let userId = req.body.user_id;

    var regexp = new RegExp(searchParam, "gi");

    console.log("============");
    console.log('Sending all public events to the front end with search params: '+ searchParam + ' ...');
    NetworkingEvent.find({ $and: [{ 'event_is_public': true }, { $or: [{ "event_title": regexp }, { "event_location": regexp }, { "event_description": regexp }, { "event_host": regexp }] }] }).sort({ event_date: 1 })
        .then(events => res.json(events))
        .catch(err => res.status(400).json('Error: ' + err));
});





//ADD USER TO ATTENDANCE ARRAY
appliRoutes.route('/networking/addUserToAttendance').post((req, res) => {
    console.log("============");
    console.log("Adding user with id = " + req.body.userId + " to event's attendance with the event id of " + req.body.eventId);

    NetworkingEvent.update(
        { _id: req.body.eventId },
        { $push: { event_attendees: req.body.userId } }
    ).then(event => res.json(event))
        .catch(err => res.status(400).json(err));
});

//REMOVE USER from ATTENDANCE ARRAY
appliRoutes.route('/networking/removeUserFromAttendance').post((req, res) => {
    console.log("============");
    console.log("Removing user with id = " + req.body.userId + " from event's attendance with the event id of " + req.body.eventId);

    NetworkingEvent.update(
        { _id: req.body.eventId },
        { $pull: { event_attendees: req.body.userId } }
    ).then(event => res.json(event))
        .catch(err => res.status(400).json(err));
});




module.exports = appliRoutes;


