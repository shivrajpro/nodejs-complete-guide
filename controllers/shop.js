const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.findAll()
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
  Product.findAll()
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
  Product.findByPk(prodId)
    .then((product) => {
      // console.log("product=",product);
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
    .then((cart) => {
    //   console.log("CART", cart);
      return cart.getProducts();
    })
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
  // console.log('body',req.body);
  // get cart of user, then get matching product from this cart
  // increase its quantity if the product exists
  // else add product to cart and set its quantity to 1

  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length) product = products[0];

      if (product) {
        //increase its quantity
        let oldQuantity = product.cartItem.quantity;
        newQuantity += oldQuantity;
        return product;
      } //else add the entire product object to cart
      return Product.findByPk(prodId);
    })
    .then((product) => {
      fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCartItem = (req, res, next) => {
  //to delete prod from cart, we need to call destroy on cartItem   
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts({where:{id:prodId}})
  })
  .then(products=>{
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then(result=>{
    console.log('DELETEED CARTITEM');
    res.redirect("/cart");
  })
  .catch(err=>console.log(err))
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
