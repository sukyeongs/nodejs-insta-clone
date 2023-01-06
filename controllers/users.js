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

// Get User information
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

// Delete User information
exports.deleteById = (req, res) => {
    const user_id = req.body.user_id;
    User.findByIdAndDelete(user_id)
    .then(res.send("Delete User"))
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

// Update User email
exports.updateEmail = (req, res) => {
    //const { user_id, username } = req.body;
    User.findByIdAndUpdate(req.body.user_id, {username : req.body.username})
    .then(res.send("Update username"))
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};