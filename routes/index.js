const express = require('express');
const indexRouter = express.Router();

indexRouter.get('/', (req, res)=>{
    res.send('Hello World!')
});


module.exports = indexRouter;