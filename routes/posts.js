const express = require('express');
const postsRouter = express.Router();
const posts = require('../controllers/posts');

// Retrieve all Users
postsRouter.get('/', posts.findAll);
// Create a post
postsRouter.post('/write', posts.create);

module.exports = postsRouter;