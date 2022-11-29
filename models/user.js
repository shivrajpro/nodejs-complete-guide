const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  email: {
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref:'Product', required: true },
        quantity: { type: Number, required: true },
      }
    ]
  },
});

userSchema.methods.addToCart = function (product) {
  let newQuantity = 1;
  if (!this.cart.items) this.cart.items = [];

  //get the index of product in cart
  let existingProductIndex = this.cart.items.findIndex(
    (i) => i.productId.toString() === product._id.toString()
  );
  let updatedCartItems = [...this.cart.items];

  //if product is already present in cart then increment its quantity
  if (existingProductIndex != -1) {
    const oldQuantity = this.cart.items[existingProductIndex].quantity;
    newQuantity = oldQuantity + 1;
    updatedCartItems[existingProductIndex].quantity = newQuantity;
  } else { //else push the new product in cart
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = { items: updatedCartItems };

  this.cart = updatedCart;
  
  return this.save();
}

userSchema.methods.removeFromCart = function (prodId) {
  const updatedCartItems = this.cart.items.filter((p)=>p.productId.toString() !== prodId);

  this.cart.items = updatedCartItems;

  return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

const User = mongoose.model("User", userSchema);
module.exports = User;