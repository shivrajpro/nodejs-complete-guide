// const products = [];
const Product = require("../models/product");
const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

exports.getAddProduct = (req, res, next) => {
  if(!req.session.user) return res.redirect('/login');

  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) return res.redirect("/");

  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) return res.redirect("/");

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/add-product",
        editing: editMode === "true",
        product: product,
        isAuth:req.session.isLoggedIn,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImgUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImgUrl,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  
  Product.findById(prodId)
    .then((product) => {
      //unauthorized user should not be allowed to edit product
      if(product.userId === req.user._id){
        product.title = updatedTitle;
        product.imageUrl = updatedImgUrl;
        product.price = updatedPrice;
        product.description = updatedDesc;
        return product.save();
      }else{
        return res.redirect('/');
      }
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const product = new Product({
    _id:new mongoose.Types.ObjectId('6380fcb367a1d75d5d6da74c'),
    title, 
    imageUrl, 
    price, 
    description,
    userId: req.session.user
  });
  
  product
    .save()
    .then((result) => {
      // console.log("PRODUCT SAVED", result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description
      //   },
      //   errorMessage: 'Database operation failed, please try again.',
      //   validationErrors: []
      // });
      // res.redirect('/500');

      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
    .then((products) => {
      res.render("admin/product-list", {
        prods: products,
        path: "/admin/products",
        pageTitle: "Admin Products",
        isAuth:req.session.isLoggedIn
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteOne({_id: prodId, userId: req.user._id})
    .then((product) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
