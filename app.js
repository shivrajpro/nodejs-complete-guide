const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");

const path = require("path");
const rootDir = require("./util/path");
const sequelize = require("./util/database");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //public folder contains static resources like js and css

//and here we are guaranteed for now there will always be one user
app.use((req, res, next) => {
  //this code runs only after hitting a request after server creation
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
// app.engine('hbs',  expressHbs({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
// })); //hbs will be the extension of file names
// app.set('view engine', 'hbs');// set the templating engine to be used
// app.set('view engine', 'pug');// set the templating engine to be used
app.set("view engine", "ejs");
app.set("views", "views"); //folder in which our templates are kept
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product); //OPTIONAL: as it the inverse of above relation
User.hasOne(Cart);
Cart.belongsTo(User); //OPTIONAL: as it the inverse of above relation
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsTo(Cart, { through: CartItem });

// force flag will create new tables everytime, should not be used in prod
// need to run this flag whenever a new association is created
sequelize
//   .sync({force:true})
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) return User.create({ name: "Shivraj", email: "test@test.com" });
    return Promise.resolve(user); //by default a return value in then block is converted to promise
  })
  .then((user) => {
    return user.createCart();
  })
  .then(() => {
    // console.log("result", result);
    app.listen(3000); //creates a server on port
  })
  .catch((err) => {
    console.log(err);
  });
