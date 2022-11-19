const products = [];

exports.getAddProduct = (req, res, next)=>{
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    // res.send('<form action="/admin/add-product" method="post"> <input type="text" placeholder="enter title" name="title"> <button type="submit">Add Product</button> </form>');
    res.render('add-product', {
        pageTitle: "Add Product",
        path:"/admin/add-product",
        formsCSS: true, 
        productCSS: true, 
        activeAddProduct: true
    })
}

exports.postAddProduct = (req, res, next)=>{
    // console.log('body=',req.body);
    products.push({title: req.body.title});
    res.redirect('/');
}

exports.getProducts = (req, res, next)=>{
    res.render('shop', {
        prods:products, 
        pageTitle: 'Shopping Page', 
        path:'/' ,
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true    
    });
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
    // will render the shop.pug
}