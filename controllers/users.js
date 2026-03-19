const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    await User.register(newUser, password);
    req.flash("success", "Welcome to FakeBnb! Please log in.");
    req.session.save(() => res.redirect("/login"));
  } catch (e) {
    req.flash("error", e.message);
    req.session.save(() => res.redirect("/signup"));
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  req.session.save(() => res.redirect("/listings"));
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have been logged out.");
    req.session.save(() => res.redirect("/"));
  });
};
