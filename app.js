const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const flash = require("connect-flash");

const MONGO_URL = "mongodb://127.0.0.1:27017/fakebnb";
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");

//Express routers calls
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

// App config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session & flash
const sessionOptions = {
  secret: "secret",
  resave: false,
  saveUninitialized: false,
};
app.use(session(sessionOptions));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Locals middleware
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.currentUser = req.user;
  next();
});

// Home
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Routes
app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings", listingRouter);
app.use("/", userRouter);

// 404
app.all("/*any", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// DB connection then start server
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(8080, () => {
      console.log("Server is listening on port 8080");
    });
  })
  .catch((err) => {
    console.log(err);
  });
