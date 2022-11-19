const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));

app.set("view engine", "ejs");
app.set("views", "views");

app.get('/', (req, res, next)=>{
    res.render('asg-4', {pageTitle:"Assignment 4"});
})

const users = [];
app.post('/users', (req, res, next)=>{
    console.log('body=',req.body);
    users.push({username:req.body.username});
    console.log('users',users);
    res.render('users-a4', {pageTitle:"Users", users:users});
} )
app.listen(3000);