const cloudinary = require("cloudinary").v2;
dotenv = require("dotenv");
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
console.log("Cloudinary ENV:", {
  cloud: process.env.CLOUD_NAME,
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
});
module.exports = cloudinary;