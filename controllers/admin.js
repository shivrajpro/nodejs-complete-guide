// const products = [];
const Product = require("../models/product");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fileHelper = require("../util/file");
const ITEMS_PER_PAGE = 1;

exports.getAddProduct = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");

  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
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
        isAuth: req.session.isLoggedIn,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
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
  const updatedImage = req.file;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const imagePath = "/" + updatedImage.path.replace(/\\/g, "/");

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/add-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId)
    .then((product) => {
      //unauthorized user should not be allowed to edit product
      if (product.userId === req.user._id) {
        product.title = updatedTitle;
        if (imagePath) {
          fileHelper.deleteFile(product.imageUrl);
          product.imageUrl = imagePath;
        }
        product.price = updatedPrice;
        product.description = updatedDesc;
        return product.save();
      } else {
        return res.redirect("/");
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
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  const imagePath = "/" + image.path.replace(/\\/g, "/");

  // console.log("IMAGE",imagePath);
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: "Attached file is not an image",
      validationErrors: [],
    });
  }
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    title,
    imageUrl: imagePath,
    price,
    description,
    userId: req.session.user,
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
      console.log(err);
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
      res.render("admin/product-list", {
        prods: products,
        path: "/admin/products",
        pageTitle: "Admin Products",
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
  // Product.find({userId: req.user._id})
  //   .then((products) => {
  //     res.render("admin/product-list", {
  //       prods: products,
  //       path: "/admin/products",
  //       pageTitle: "Admin Products",
  //       isAuth:req.session.isLoggedIn
  //     });
  //   })
  //   .catch((err) => {
  //     const error = new Error(err);
  //     error.httpStatusCode = 500;
  //     return next(error);
  //   });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) return next(new Error("Product not found"));
      fileHelper.deleteFile(product.imageUrl.slice(1));
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then((product) => {
      res.redirect("/admin/products");
    })
    .catch((err) => next(err));
};
