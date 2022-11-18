const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next)=>{
    res.send('<form action="/product" method="post"> <input type="text" placeholder="enter title" name="title"> <button type="submit">Add Product</button> </form>');
} )

router.post('/product', (req, res, next)=>{
    console.log('body=',req.body);
    res.redirect('/');
} )

module.exports = router;
