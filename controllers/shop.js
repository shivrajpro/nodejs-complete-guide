const Product = require("../models/product");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
  return;
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
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
      console.log("product=",product);
      if(!product) return res.redirect('/')
      res.render("shop/product-detail", {
        pageTitle: product.title,
        path: "/products",
        product: product,
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
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

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
  console.log("prodId", prodId)
  req.user.deleteCartItem(prodId, req.user._id)
  .then(result=>{
    // console.log('RESULT',result);
    res.redirect('/cart');
  })
  .catch(err=>console.log(err))
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include:['products']}) // as we have belongsToMany realtion
  .then((orders)=>{
    console.log('ORDERS',orders);
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders:orders
    });
  })

};

exports.postOrder = (req, res, next)=>{
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      // console.log('PRODUCTS',products);
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity }; //need to be used to show in orders page
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then(()=>{
      return fetchedCart.setProducts(null); //empty cart after checkout
    })
    .then((result) => {
      // console.log("RESULT", result);
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
