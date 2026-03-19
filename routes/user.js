const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

// Signup routes
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    await User.register(newUser, password);
    req.flash("success", "Account created! Please log in.");
    req.session.save(() => res.redirect("/login"));
  } catch (e) {
    req.flash("error", e.message);
    req.session.save(() => res.redirect("/signup"));
  }
});

// Login routes
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
  }
);

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have been logged out.");
    res.redirect("/");
  });
});

module.exports = router;
