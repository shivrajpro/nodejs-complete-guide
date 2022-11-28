const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");

const MONGODB_URI =
  "mongodb+srv://shivraj:shiv@cluster0.bu9ow60.mongodb.net/shop";
const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions", //name of the collection where session will be stored
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //public folder contains static resources like js and css

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  User.findById("6380f66dfdf40701a99c47c5")
    .then((user) => {
      // console.log("USER",user);
      req.user = user;
      next();
    })
    .catch((e) => {
      console.log(e);
    });
});

app.set("view engine", "ejs");
app.set("views", "views"); //folder in which our templates are kept
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("CONNECTED");

    User.findById("6380f66dfdf40701a99c47c5")
      .then((user) => {
        if (!user) {
          const user = new User({
            username: "shivraj",
            email: "shivraj@test.com",
            cart: {
              items: [],
            },
          });

          user.save();
        }
      })
      .catch((e) => console.log(e));
    app.listen(3000);
  })
  .then((e) => {
    console.log(e);
  });
