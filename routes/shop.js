const express = require('express');
const path = require('path');
const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/',(req, res, next)=>{
    console.log('products=',adminData.products);
    const products = adminData.products;
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    res.render('shop', {prods:products, docTitle: 'Shopping Page' });
})

module.exports = router;
