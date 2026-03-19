const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

//Express routers calls
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");

// App config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// DB connection
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// Server
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

const sessionOptions = {
  secret: "secret",
  resave:false,
  saveUninitialized: true,
};
app.use(session(sessionOptions));

// Home
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Listings routes
app.use("/listings/:id/reviews", reviews)
app.use("/listings", listings);

// 404
app.all("/*any", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});
