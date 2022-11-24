const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    const db = getDb();
    return db.collection("products")
      .insertOne(this)
      .then((result) => {
        // console.log("INSERT ONE RESULT", result);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll(){
    const db = getDb();

    return db.collection("products").find().toArray()
    .then(products=>{
      // console.log('PRODUCTS',products);
      return products;
    }).catch(err=>console.log(err))
  }

  static findById(id){
    const db = getDb();

    // find returns a cursor to last document and next returns thee promise with this doc.
    return db.collection("products")
    .find({_id:new mongodb.ObjectId(id)})
    .next()
    .then(product=>{
      // console.log("FIND BY ID",product);
      return product;
    })
    .catch(err=>console.log(err))
  }

  static deleteById(prodId){
    const db = getDb();

    return db.collection("products")
    .deleteOne({_id:new mongodb.ObjectId(prodId)})
    .then(result=>{
      // console.log('DELETED PRODUCT',result);
      return result;
    })
    .catch(err=>console.log(err))
  }
}

module.exports = Product;
