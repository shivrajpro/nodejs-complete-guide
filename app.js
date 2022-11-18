const express = require('express');

const app = express();

app.use('/',(req, res, next)=>{
    console.log("in a first middleware");
    next();
})

app.use('/users',(req, res, next)=>{
    res.send("<h1>Show list of users!</h1>")
})

app.use('/',(req, res, next)=>{
    console.log("In another middleware");
    res.send("<h1>Hello from Express!</h1>")
})

app.listen(3000); //creates a server on port