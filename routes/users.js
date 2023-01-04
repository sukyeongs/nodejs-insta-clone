const express = require('express');
const usersRouter = express.Router();
const users = require('../controllers/users');

// Retrieve all Users
usersRouter.get('/', users.findAll);
// Signin
usersRouter.post('/signin', users.create);

module.exports = usersRouter;