// const products = [];
const Product = require('../models/product');

exports.getAddProduct = (req, res, next)=>{
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    // res.send('<form action="/admin/add-product" method="post"> <input type="text" placeholder="enter title" name="title"> <button type="submit">Add Product</button> </form>');
    res.render('admin/add-product', {
        pageTitle: "Add Product",
        path:"/admin/add-product",
        formsCSS: true, 
        productCSS: true, 
        activeAddProduct: true
    })
}

exports.postAddProduct = (req, res, next)=>{
    // console.log('body=',req.body);
    // products.push({title: req.body.title});
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(title, imageUrl, price, description);
    console.log('product',product);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next)=>{
    Product.fetchAll((products)=>{
        // console.log('products=',products);
        res.render('admin/product-list', {
            prods:products, 
            path:'/admin/products',
            pageTitle:'Admin Products',
        });
    });
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    // will render the shop.pug
}