const User = require('../models/user');

exports.getLogin = (req, res, next)=>{
    console.log("SESSION",req.session);
    // console.log("Cookie",req.get("Cookie").split("=")[1]);
    const isLoggedIn = req.get("Cookie")?.split("=")[1];
    res.render("auth/login", {
        path:"/login",
        pageTitle: "Login",
        isAuth: req.session.isLoggedIn
    })
}

exports.postLogin = (req, res, next)=>{
    // res.setHeader("Set-Cookie","loggedIn=true; Max-Age=10");
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
          req.session.user = user;
          req.session.isLoggedIn = true;
          res.redirect('/')
        }else{
            req.session.user = user;
            req.session.isLoggedIn = true;
            res.redirect('/')
        }
      })
      .catch((e) => console.log(e));    
}

exports.postLogout = (req, res, next)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/');
    })
}