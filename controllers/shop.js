const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getIndex = (req, res, next)=>{
    Product.findAll()
    .then(products=>{
        res.render('shop/index', {
            prods:products, 
            pageTitle: 'Shop', 
            path:'/'
        });
    })
    .catch(err=>{
        console.log(err);
    })
    return;
}

exports.getProducts = (req, res, next)=>{
    Product.findAll()
    .then(products=>{
        res.render('shop/product-list', {
            prods:products, 
            pageTitle: 'All Products', 
            path:'/products'
        });
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.getProductById = (req, res, next)=>{
    const prodId = req.params.productId;
    // console.log('prodId',prodId);
    Product.findByPk(prodId)
    .then((product)=>{
        // console.log("product=",product);
        res.render('shop/product-detail',{
            pageTitle:product.title,
            path:'/products',
            product:product
        })
    })
    .catch(err=>{
        console.log(err);
    })

    return;
    Product.findAll({where:{id:prodId}})
    .then((products)=>{//findAll retruns an array
        // console.log("product=",product);
        res.render('shop/product-detail',{
            pageTitle:products[0].title,
            path:'/products',
            product:products[0]
        })
    })
    .catch(err=>{
        console.log(err);
    })

}

exports.getCart = (req, res, next)=>{
    Cart.getCart((cart)=>{
        if(cart){
            Product.fetchAll((products)=>{
                const cartProducts = [];
                for (const product of products) {
                    const cartProductData = cart.products.find((p)=>p.id === product.id);
                    if(cartProductData){
                        cartProducts.push({productData: product, qty: cartProductData.qty});
                    }
                }
                res.render('shop/cart',{
                    path:'/cart',
                    pageTitle:'Your Cart',
                    products:cartProducts
                })
            })
        }
    })
}

exports.postCart = (req, res, next)=>{
    // console.log('body',req.body);
    const prodId = req.body.productId;
    Product.findById(prodId, (product)=>{
        Cart.addProduct(prodId, product.price)
    })
    res.redirect('/cart');
}

exports.postDeleteCartItem = (req, res, next)=>{
    const prodId = req.body.productId
    Product.findById(prodId, product=>{
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    })
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
