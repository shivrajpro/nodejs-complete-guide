const Order = require("../models/order");
const Product = require("../models/product");
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const ITEMS_PER_PAGE = 1;
const stripe = require('stripe')('sk_test_51MAGVfSDBzPpT6ABpwYIO50ZjG6T8JSM0Wx7NWlOx4VilwaIWdl7UZrfuZBSCTGnJKvek9Lm4Z0tv371iYhGcSLx00fU0KbA66');
exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        currentPage: page,
        hasNextPage: page * ITEMS_PER_PAGE < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });  
  // Product.find()
  //   .then((products) => {
  //     res.render("shop/product-list", {
  //       prods: products,
  //       pageTitle: "All Products",
  //       path: "/products",
  //       isAuth:req.session.isLoggedIn
  //     });
  //   })
  //   .catch((err) => {
  //     const error = new Error(err);
  //     error.httpStatusCode = 500;
  //     return next(error);
  //   });
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });    
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
  .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
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
  .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
          email:req.user.email,
          userId: req.user
        },
        products
      })

      return order.save();
    }).then(()=>{
      req.user.clearCart();
      return res.redirect('/orders');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });  
}
exports.getCheckoutSuccess = (req, res, next)=>{
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log("PRODUCTS",user.cart.items);
      const products = user.cart.items.map(i=> {
        return {quantity: i.quantity, product: i.productId._doc}
      });

      const order = new Order({
        user:{
          email:req.user.email,
          userId: req.user
        },
        products
      })

      return order.save();
    }).then(()=>{
      req.user.clearCart();
      return res.redirect('/orders');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });  
}

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log("PRODUCTS",user.cart.items);
      products = user.cart.items;
      total = 0;

      products.forEach(p => {
        total+= p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "INR",
              product_data: {
                name: "T-shirt"
              },
              unit_amount: 100
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: req.protocol +"://" + req.get('host') + '/checkout/success',
        cancel_url: req.protocol +"://" + req.get('host') + '/checkout/cancel'      
        // success_url: 'http://localhost:3000/payment-success',
        // cancel_url: 'http://localhost:3000/payment-cancel',        
        // line_items: products.map(p=>{
        //   return {
        //     name: p.productId.title,
        //     description: p.productId.description,
        //     amount:p.productId.price * 100, //in cents for USD
        //     currency:'usd',
        //     quantity:p.quantity
        //   }
        // })
      });
    })
    .then(session=>{
      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",    
        products: products,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });   
  // res.render("shop/checkout", {
  //   path: "/checkout",
  //   pageTitle: "Checkout"
  // });
};

exports.getInvoice = (req, res, next)=>{
  const orderId = req.params.orderId;

  Order.findById(orderId)
  .then(order=>{
    if(!order) return next(new Error("Order not dound"));

    if(order.user.userId.toString() !== req.user._id.toString())
      return next(new Error('Unauthorized'));

    const invoiceName = 'invoice-'+orderId+".pdf";
    const invoicePath = path.join('data', 'invoices', invoiceName);

    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text("Invoice",{underline:true});
    
    pdfDoc.text("------------------------------------------------");

    let totalPrice = 0;
    order.products.forEach(p=>{
      totalPrice += p.quantity * p.product.price;
      pdfDoc.fontSize(14).
      text(p.product.title + " - "+p.quantity+" x "+"$"+p.product.price);
    })
    pdfDoc.text("-------------------------------------------------");
    pdfDoc.fontSize(20).text("Total Price: $"+totalPrice);
    pdfDoc.end();
    //with this function, file data is read into memory, which might overflow when there
    // are huge incoming requests and file size is large
    // fs.readFile(invoicePath, (err, data)=>{
    //   // console.log("data",data);
    //   if(err) return next(err);

    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"');
    //   res.send(data);
    // })
      
    // with this method, the entire data is not loaded in memory
    // instead the data is sent to browser chunk by chunk
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"');
    // file.pipe(res);
  })
  .catch(e=>console.log(e));
}
