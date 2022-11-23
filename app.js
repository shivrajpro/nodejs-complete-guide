const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");

const mongoConnect = require('./util/database').mongoConnect;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //public folder contains static resources like js and css

app.use((req, res, next) => {
  next();
});
app.set("view engine", "ejs");
app.set("views", "views"); //folder in which our templates are kept
app.use("/admin", adminRoutes);
app.use(shopRoutes);

mongoConnect(()=>{
  app.listen(3000);
})
app.use(errorController.get404);
