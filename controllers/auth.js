const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "065bd9d19190d6",
    pass: "46bdc846651940",
  },
});

exports.getLogin = (req, res, next) => {
  // console.log("SESSION",req.session);
  // console.log("Cookie",req.get("Cookie").split("=")[1]);
  let message = req.flash("error");
  if (message.length) message = message[0];
  else message = null;

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMsg: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }

      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length) message = message[0];
  else message = null;

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuth: false,
    errorMsg: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "E-Mail exists already, try login");
        return res.redirect("/signup");
      }

      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });

        return user.save();
      });
    })
    .then((result) => {
      const mailOptions = {
        from: '"NodeJS Team" <from@example.com>',
        to: email,
        subject: req.body.email + " - Sending Email using Node.js",
        text: `Hey there, Welcome to Flopkert`,
      };
      transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length) message = message[0];
  else message = null;

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMsg: message,
  });
};

