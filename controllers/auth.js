const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto  = require('crypto');
const {validationResult} = require('express-validator');

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

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    // console.log("ERRORS",errors.array());

    return res.status(422)
    .render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuth: false,
      errorMsg: errors.array()[0].msg
    });
  }
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
    errorMsg: message
  });
};

exports.postResetPassword = (req, res, next)=>{
  crypto.randomBytes(32, (err, buffer)=>{
    if(err){
      console.log(err);
      return res.redirect('/reset-password');
    }

    //get the user with email
    // store the token
    // send email if account exists else throw error
    const token = buffer.toString('hex');
    User.findOne({email:req.body.email})
    .then(user=>{
      if(!user){
        req.flash('error',"No account with that email exists");
        return res.redirect('/reset-password');
      }

      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 60*60*1000;

      return user.save();
    })
    .then(result=>{
      res.redirect('/');

      const mailOptions = {
        from: '"NodeJS Team" <shop@node-complete.com>',
        to: req.body.email,
        subject: "Flopkert - Password Reset",
        html:`
        <p>You requested a password reset</p>
        <p>Click this 
        <a href="http://localhost:3000/set-password/${token}">link</a>
        to reset your password
        </p>
        `
      };
      transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    })
    .catch(e=>{
      console.log(e)
    })
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  let message = req.flash("error");
  if (message.length) message = message[0];
  else message = null;

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (user) {
        res.render("auth/new-password", {
          path: "/new-password",
          pageTitle: "New Password",
          userId: user._id.toString(),
          errorMsg: message,
          passwordToken: token
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
};


exports.postNewPassword = (req, res, next)=>{
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({resetToken:passwordToken, 
    resetTokenExpiration:{$gt:Date.now()},
    _id:userId
  })
  .then(user=>{
    if(user){
      resetUser = user;
      return bcrypt.hash(newPassword, 12)
    }
  })
  .then(hashedPassword=>{
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;

    return resetUser.save();
  })
  .then(result=>{
    return res.redirect('/')
  })
  .catch(e=>{
    console.log(e);
  })

}
