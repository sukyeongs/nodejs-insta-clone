const Post = require('../models/posts');

// Get Posts
exports.findAll = (req, res) => {
    Post.find()
    .then(posts => {
        res.send(posts);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.create = (req, res) => {    
    // Create a Post
    const post = new Post({
        location: req.body.location,
        content: req. body.content,
        writer: req.body.user_id
    });

    post.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};