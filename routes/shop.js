const express = require('express');
const path = require('path');
const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/',(req, res, next)=>{
    console.log('products=',adminData.products);
    const products = adminData.products;
    res.render('shop', {
        prods:products, 
        pageTitle: 'Shopping Page', 
        path:'/' ,
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true    
    });
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    // will render the shop.pug
})

module.exports = router;
