const Product = require('../models/product');

exports.getIndex = (req, res, next)=>{
    Product.fetchAll((products)=>{
        // console.log('products=',products);
        res.render('shop/index', {
            prods:products, 
            pageTitle: 'Shop', 
            path:'/' ,
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true    
        });
    });    
}

exports.getProducts = (req, res, next)=>{
    Product.fetchAll((products)=>{
        // console.log('products=',products);
        res.render('shop/product-list', {
            prods:products, 
            pageTitle: 'All Products', 
            path:'/products' ,
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true    
        });
    });
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    // will render the shop.pug
}

exports.getProductById = (req, res, next)=>{
    const prodId = req.params.productId;
    console.log('prodId',prodId);
    Product.findById(prodId, (product)=>{
        console.log("product=",product);
        res.render('shop/product-detail',{
            pageTitle:product.title,
            path:'/products',
            product:product
        })
    })
}

exports.getCart = (req, res, next)=>{
    res.render('shop/cart',{
        path:'/cart',
        pageTitle:'Your Cart'
    })
}

exports.postCart = (req, res, next)=>{
    console.log('body',req.body);
    res.redirect('/cart');
}

exports.getOrders = (req, res, next)=>{
    res.render('shop/orders',{
        path:'/orders',
        pageTitle:'Your Orders'
    })
}

exports.getCheckout = (req, res, next)=>{
    res.render('shop/checkout',{
        path:'/checkout',
        pageTitle:'Checkout'
    })
}
