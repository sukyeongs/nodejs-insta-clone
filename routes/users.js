const express = require('express');
const usersRouter = express.Router();
const users = require('../controllers/users');

// Retrieve all Users
usersRouter.get('/', users.findAll);
// Signin User
usersRouter.post('/signin', users.create);
// Delete User
usersRouter.delete('/delete', users.deleteById);
// Update email
usersRouter.patch('/update', users.updateEmail);

module.exports = usersRouter;