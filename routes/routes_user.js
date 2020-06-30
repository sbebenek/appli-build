const router = require('express').Router();
const bcrypt = require('bcryptjs'); //Package for hashing
const jwt = require('jsonwebtoken'); //used for authorization
const keys = require('../config/keys');
//load validators
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
let User = require('../models/user.model');

//Handles HTTP GET request
router.route('/user').get((req, res) => {
    User.find()//mongoose method for select all
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});
//Handles HTTP POST request
router.route('/user/add').post((req, res) => {
    //Form Validation
    const { errors, isValid } = validateRegisterInput(req.body);
    //check Validation
    if (!isValid) {
        return res.status(400).json('Error: ' + errors);
    }
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const newUser = new User({
        username,
        email,
        password
    });
    //Hash Password before saving
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
                .then(() => res.json('User Added!'))
                .catch(err => res.status(400).json('Error: ' + err));
        });
    });

});

router.route('/user/login').post((req, res) => {
    //form validation
    const { errors, isValid } = validateLoginInput(req.body);
    //check validation
    if (!isValid) {
        return res.status(400).json('Error: ' + errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    //Find user by email
    User.findOne({ email })
        .then(user => {
            //check if they exists
            if (!user) {
                return res.status(400).json({ emailnotfound: "Email not found" });
            }
            //check password
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    //User Matched, then create JWT payload
                    const payload = {
                        id: user.id,
                        username: user.username
                    };
                    //sign token
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {
                            expiresIn: 31556926 //1 year in seconds
                        },
                        (err, token) => {
                            res.json({ success: true, token: "Bearer " + token });
                        }
                    );

                } else {
                    return res.status(400).json({ passwordincorrect: "Password incorrect" });
                }
            });
        });
});

router.route('/user/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/user/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json("User annihilated"))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/user/update/:id').post((req, res) => {
    User.findById(req.params.id)
        .then(user => {
            user.username = req.body.username;

            user.save()
                .then(() => res.json('User Updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});



//Sam's route - get a list of usernames based on the given array of user id's
router.route('/user/getUsernames').post((req, res) => {
    console.log("--------------------");
    console.log("recieved request for usernames. Request body: ");
    console.log(req.body);
    User.find({ _id: { $in: req.body.user_id_array } }, function (err, users) {
        console.log("found users: ");
        console.log(users);
        let attendees = [];
        users.forEach(user => {
            attendees.push(user.username);
        });


        let response = attendees.length === 0 ? { usernames: ['None'] } : { usernames: attendees };

        res.json(response);
    });
});

module.exports = router;