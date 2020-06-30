const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
//const logger = require('morgan');
const ForumThread = require('../models/forum.model');

// const API_PORT = 3001;
const app = express();
// app.use(cors());
const  appliRoutes = express.Router();
//
// //connect to MongoDB
// const dbRoute =
//     'mongodb+srv://testCRUD:tj2zwWvHXMnacgGv@cluster0-njbj6.mongodb.net/test?retryWrites=true&w=majority';
//
// // Mongoose is used to connect our back end code with the database
// // useFindAndModify needs to pass in so the findOneAndUpdate can be used
// // See more: https://mongoosejs.com/docs/deprecations.html
// mongoose.connect(dbRoute, { useNewUrlParser: true, useFindAndModify: false } );

// let db = mongoose.connection;
// //if it is open then log connected
// db.once('open', () => console.log('connected to the database'));
// //else check the error
// // checks if connection with the database is successful
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// this method fetches all available data in our database from Mongoose documentation
appliRoutes.get('/forum-list', (req, res) => {
    ForumThread.find((err, data) => {
        console.log(data);
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
});
//find out the hot topic
//if a post get more than a certain number of replies it is a hot topic
//Problem 1: {$where: 'replies.length > 2'} is not working cuz there is empty array
//Solution: using replies.2 $exists - meaning if there is a post with more than 3 comments it is a hot topic
//Problem 2: when adding a post, a reply is not added
//Solution: adding a reply in the forum-add page and redefine the data schema to include replies
appliRoutes.get('/forum-hottopic', (req, res) => {
    ForumThread.find( {"replies.2": { "$exists": true }}, (err, data) => {
        console.log(data);
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data});
    })
});
//the axios post method will send the data to the server
//this function add the data in the database
appliRoutes.post('/forum-add', (req, res) => {
    const topic = req.body.post_topic;
    const content = req.body.post_content;
    console.log(topic);
    console.log(content);
    const newForumThread = new ForumThread({
        content,
        topic
    });
    console.log(newForumThread);
    newForumThread.save()
        .then(() => res.json('Thread Added!'))
        .catch(err => res.status(400).json('Error: '+ err));
});
//findById built in syntax to find the post in Mongoose documentation
appliRoutes.route('/forum-details/:id').get(function(req, res) {
    let id = req.params.id;
    ForumThread.findById(id, function(err, thread) {
        res.json(thread);
    });
});
//update take in 2 parameters the id and the details to update
appliRoutes.route('/forum-edit/:id').post(function(req, res) {
    ForumThread.findById(req.params.id, function(err, forumthread) {
        if (!forumthread)
            res.status(404).send("data is not found");
        else
            forumthread.topic = req.body.topic;
        forumthread.content = req.body.content;
        forumthread.save().then(forumthread => {
            res.json('Post updated!');
        })
            .catch(err => {
                res.status(400).send("Not Updated");
            });
    });
});
//delete a thread
appliRoutes.route('/forum-delete/:id').get(function (req, res) {
    ForumThread.findByIdAndRemove(req.params.id, function (err, forumthread) {
        if (err) res.json(err);
        else res.json('Post Deleted Successfully');
    });
});
//To do: search for a thread by its content
appliRoutes.route('/forum-search/:query').get(function(req, res){
    let query = req.query.query;
    // ForumThread.find({ "$text": {"$search": req.params.query}})
    //     .then((results) => {
    //         res.json(results)
    //     })
    //     .catch((err) => {
    //         res.status(500).send(err);
    //     })
    ForumThread.find({
        "content": {
            "$text": {"$search": query}
        }, function(err, data) {
            res.json(data);
            console.log(data);
        }
    })
})
//To do: adding replies to a post
//findOneAndUpdate
appliRoutes.route('/forum-reply/:id').post(function(req, res) {
    var testingreplies = "backend testing";
    const newReply = req.body.replies;
    ForumThread.findOneAndUpdate(
        {_id: req.params.id},
        {$push: {replies: newReply}},
        {new: true}, function (err, update) {

            if (err) {
                return res.status(500).json({
                    "status": "error",
                    "result": "server error"
                });
            } else {
                return res.status(200).json({
                    "status": "ok",
                    "result": "replies added"
                });
            }
        });
})


// append /api for our http requests
// app.use('/api', appliRoutes);
module.exports = appliRoutes;

// launch our backend into a port
//app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
