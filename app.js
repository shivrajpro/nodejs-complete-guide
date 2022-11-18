const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:false}));

app.use('/add-product', (req, res, next)=>{
    res.send('<form action="/product" method="post"> <input type="text" placeholder="enter title" name="title"> <button type="submit">Add Product</button> </form>');
} )

app.use('/product', (req, res, next)=>{
    console.log('body=',req.body);
    res.redirect('/');
} )

app.use('/',(req, res, next)=>{
    console.log("In another middleware");
    res.send("<h1>Hello from Express!</h1>")
})

app.listen(3000); //creates a server on port