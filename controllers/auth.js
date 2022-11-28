exports.getLogin = (req, res, next)=>{
    console.log("SESSION",req.session);
    // console.log("Cookie",req.get("Cookie").split("=")[1]);
    const isLoggedIn = req.get("Cookie")?.split("=")[1];
    res.render("auth/login", {
        path:"/login",
        pageTitle: "Login",
        isAuth: isLoggedIn
    })
}

exports.postLogin = (req, res, next)=>{
    // res.setHeader("Set-Cookie","loggedIn=true; Max-Age=10");
    req.session.isLoggedIn = true;
    res.redirect('/')
}