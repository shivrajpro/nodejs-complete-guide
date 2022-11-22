// const products = [];
const path = require("path");
const fs = require("fs");
const Cart = require("./cart");
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
    getProductsFromFile((products) => {
      // if product exists, update it
      if (this.id) {
        const existingProductIndex = products.findIndex((p) => p.id === this.id);
        const updatedProducts = [...products];

        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else { //create new product
        this.id = Math.random().toString();
        products.push(this);
        
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
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
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      if (product) cb(product);
      else cb({});
    });
  }
};
