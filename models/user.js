const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email, id, cart) {
    this.username = username;
    this.email = email;
    this._id = id ? new mongodb.ObjectId(id) : null; //will be undefined in case of new product
    this.cart = cart;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) dbOp = db.collection("users").insertOne(this);
    else {
      dbOp = db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: this });
    }

    return dbOp;
  }

  addToCart(product) {
    let newQuantity = 1;
    let existingProductIndex = this.cart.items.findIndex(
      (i) => i.productId.toString() === product._id.toString()
    );
    let updatedCartItems = [...this.cart.items];

    if (existingProductIndex != -1) {
      const oldQuantity = this.cart.items[existingProductIndex].quantity;
      newQuantity = oldQuantity + 1;
      updatedCartItems[existingProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDb();

    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    // need to return all the products info which are in user's cart
    const db = getDb();
    const productIds = this.cart.items.map((i) => i.productId);

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          const productQty = this.cart.items.find(
            (i) => i.productId.toString() === p._id.toString()
          ).quantity;

          return {
            ...p,
            quantity: productQty,
          };
        });
      });
  }

  static findById(userId) {
    const db = getDb();

    return db
      .collection("users")
      .find({ _id: new mongodb.ObjectId(userId) })
      .next();
    // .findOne({_id:new mongodb.ObjectId(userId)})
  }

  static deleteById(userId) {
    const db = getDb();

    return db
      .collection("users")
      .deleteOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;
