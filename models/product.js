// const products = [];
const path = require("path");
const fs = require("fs");
const Cart = require("./cart");
const db = require('../util/database');

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) return cb([]);
    return cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute("INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)",
    [this.title, this.price, this.description, this.imageUrl]
    )
  }

  static deleteById(id){
    getProductsFromFile((products)=>{
      const product = products.find(p=>p.id === id);
      const updatedProducts = products.filter(p=>p.id!== id);
      // TODO: to delete the products from cart simply write updatedProducts in file
      fs.writeFile(p, JSON.stringify(products), err=>{
        if(!err){
          Cart.deleteProduct(id, product.price);
        }
      })
    })
  }

  static fetchAll(cb) {
    // getProductsFromFile(cb);
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id=?", [id]);
  }
};
