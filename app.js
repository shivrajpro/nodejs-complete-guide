const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const multer = require("multer");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const flash = require("connect-flash");

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
app.use("/images",express.static(path.join(__dirname, "images"))); //public folder contains static resources like js and css

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  )
    cb(null, true);
  else cb(null, false);
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
    //folder name in which images will be stored and the same will be included to add the images in DB
  },
  filename: (req, file, cb) => {
    cb(null, (Date.now() + "-" + file.originalname).replace(/:/g,"/"));
  }
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) return next();

  User.findById(req.session.user._id)
    .then((user) => {
      // console.log("USER",user);
      if (!user) return next();

      req.user = user;
      next();
    })
    .catch((e) => {
      // console.log(e);
      throw new Error(e);
    });
});
app.use((req, res, next) => {
  res.locals.isAuth = req.session.isLoggedIn;
  //this variable will be sent to every view we render
  next();
});
app.use(flash());
// app.use(multer({dest:'images'}).single('image'));
app.use(multer({storage: fileStorage, fileFilter}).single("image"));

app.set("view engine", "ejs");
app.set("views", "views"); //folder in which our templates are kept
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.use(errorController.get404);
app.use((error, req, res, next) => {
  console.log(error);
  res.redirect("/500");
});
app.get("/500", errorController.get500);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("CONNECTED");
    app.listen(3000);
  })
  .then((e) => {
    console.log(e);
  });
