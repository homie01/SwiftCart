const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  slug: String,
  name: String,
  url: String,
});

const categoryModel = mongoose.model('category', categorySchema);

module.exports = categoryModel;
