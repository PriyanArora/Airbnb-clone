const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/fakebnb";

const initDB = async () => {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB:", MONGO_URL);
  await Listing.deleteMany({});
  console.log("Cleared existing listings");
  const inserted = await Listing.insertMany(initData.data);
  console.log(`Inserted ${inserted.length} listings`);
  await mongoose.connection.close();
  console.log("Connection closed. Done.");
};

initDB().catch((err) => {
  console.error("Init failed:", err.message);
  process.exit(1);
});