const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing } = require("../middleware/index.js");
const listingsController = require("../controllers/listings.js");

router.get("/", wrapAsync(listingsController.index));
router.get("/new", listingsController.renderNewForm);
router.post("/", validateListing, wrapAsync(listingsController.createListing));
router.get("/:id", wrapAsync(listingsController.showListing));
router.get("/:id/edit", wrapAsync(listingsController.renderEditForm));
router.put("/:id", validateListing, wrapAsync(listingsController.updateListing));
router.delete("/:id", wrapAsync(listingsController.destroyListing));

module.exports = router;
