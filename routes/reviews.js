const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview } = require("../middleware/index.js");
const reviewsController = require("../controllers/reviews.js");

router.post("/", validateReview, wrapAsync(reviewsController.createReview));
router.delete("/:reviewId", wrapAsync(reviewsController.destroyReview));

module.exports = router;
