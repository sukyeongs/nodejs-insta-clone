const User = require('../models/users');

// Create and Save a new User (Signin)
exports.create = (req, res) => {
    console.log(req);
    // Validate request
    if(!req.body.username) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    // Create a User
    const user = new User({
        username: req.body.username,
        realname: req.body.realname,
        password: req.body.password,
        email: req.body.email,
        email_agree: req.body.email_agree
    });

    // Save User in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};