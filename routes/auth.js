const express = require("express");
const router = express.Router();
const User = require('../models/user');
const { check, body } = require("express-validator");
const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);
router.post("/login", [
  check("email")
  .isEmail()
  .withMessage("Please enter a valid email"),
  body('password', "Password must contain atleast 5 characters")
  .isLength({min:5})
  .isAlphanumeric()
], 
authController.postLogin);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .trim()
      .normalizeEmail() //for sanitizing
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value })
        .then((userDoc) => {
          if (userDoc) 
            return Promise.reject("E-Mail exists already, try login")
        })
      }),
    body(
      "password",
      "Please enter a password with atleast 5 alpha numeric characters only"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword")
    .custom((value, {req})=>{
        if(value !== req.body.password)
            throw new Error("Passwords have to match");
        return true
    }),
    
  ],
  authController.postSignup
);
router.get("/reset-password", authController.getResetPassword);
router.post("/reset-password", authController.postResetPassword);
router.get("/set-password/:token", authController.getNewPassword);
router.post("/set-password", authController.postNewPassword);

module.exports = router;
