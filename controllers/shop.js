const Order = require("../models/order");
const Product = require("../models/product");

exports.getIndex = (req, res, next) => {

  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuth: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
  return;
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuth:req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductById = (req, res, next) => {
  const prodId = req.params.productId;
  // console.log('prodId',prodId);
  Product.findById(prodId)
    .then((product) => {
      // console.log("product=",product);
      if(!product) return res.redirect('/')
      res.render("shop/product-detail", {
        pageTitle: product.title,
        path: "/products",
        product: product,
        isAuth:req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });

  return;
  Product.findAll({ where: { id: prodId } })
    .then((products) => {
      //findAll retruns an array
      // console.log("product=",product);
      res.render("shop/product-detail", {
        pageTitle: products[0].title,
        path: "/products",
        product: products[0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log("PRODUCTS",user.cart.items);
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuth:req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
  .then(product=>{
    return req.user.addToCart(product);
  })
  .then(()=>{
    res.redirect("/cart");
  })
  .catch(err=> console.log(err))
};

exports.postDeleteCartItem = (req, res, next) => {
  //to delete prod from cart, we need to call destroy on cartItem   
  const prodId = req.body.productId;
  // console.log("prodId", prodId)
  req.user.removeFromCart(prodId)
  .then(result=>{
    // console.log('RESULT',result);
    res.redirect('/cart');
  })
  .catch(err=>console.log(err))
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuth:req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next)=>{
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log("PRODUCTS",user.cart.items);
      const products = user.cart.items.map(i=> {
        return {quantity: i.quantity, product: i.productId._doc}
      });

      const order = new Order({
        user:{
          username:req.user.username,
          userId: req.user
        },
        products
      })

      return order.save();
    }).then(()=>{
      req.user.clearCart();
      return res.redirect('/orders');
    })
    .catch((err) => console.log(err));
  
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
