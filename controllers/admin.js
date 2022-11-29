// const products = [];
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  if(!req.session.user) return res.redirect('/login');

  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuth:req.session.isLoggedIn
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
        path: "/admin/edit-product",
        editing: editMode === "true",
        product: product,
        isAuth:req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImgUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;

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
    .catch((err) => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
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
    .catch((err) => console.log(err));
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
      console.log(err);
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
