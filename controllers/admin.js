// const products = [];
const Product = require('../models/product');

exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product', {
        pageTitle: "Add Product",
        path:"/admin/add-product",
        editing:false
    })
}

exports.getEditProduct = (req, res, next)=>{
    const editMode = req.query.edit;
    if(!editMode)
        return res.redirect('/');

    const prodId = req.params.productId;

    // Product.findByPk(prodId)
    req.user.getProducts({where:{id: prodId}})
    .then(products=>{
        const product = products[0];
        if(!product) return res.redirect('/');

        res.render('admin/edit-product', {
            pageTitle: "Edit Product",
            path:"/admin/edit-product",
            editing: editMode === 'true',
            product:product
        })
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.postEditProduct = (req, res, next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImgUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;

    Product.findByPk(prodId)
    .then(product=>{
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImgUrl;
        product.description = updatedDesc;

        return product.save();
    })
    .then(result=>{
        console.log("UPDATED PRODUCT!");
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err))
}

exports.postAddProduct = (req, res, next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    //here we can either simply pass userId field else use the sequelize method
    // which are available after creating associations in app.js
    req.user.createProduct({
        title:title,
        price:price,
        imageUrl: imageUrl,
        description: description
    })
    .then(result=>{
        res.redirect('/admin/products')
    }).catch(err=>{
        console.log(err);
    })
}

exports.getProducts = (req, res, next)=>{
    Product.findAll()
    .then(products=>{
        res.render('admin/product-list', {
            prods:products, 
            path:'/admin/products',
            pageTitle:'Admin Products'
        });
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.postDeleteProduct = (req, res, next)=>{
    const prodId = req.body.productId;

    Product.findByPk(prodId)
    .then(product=>{
        return product.destroy();
    })
    .then(()=>{
        console.log('PRODUCT DESTROYED!!');
    })
    .catch(err=>console.log(err))
    res.redirect('/');
}