const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  availabilityStatus: String,
  brand: String,
  category: String,
  description: String,
  dimensions: {
    height: Number,
    depth: Number,
    width: Number,
  },
  discountPercentage: Number,
  id: Number,
  images: [String],
  meta: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    barcode: Number,
    qrCode: String,
  },
  minimumOrderQuantity: Number,
  price: Number,
  productCount: Number,
  rating: Number,
  returnPolicy: String,
  reviews: [
    {
      rating: Number,
      comment: String,
      date: Date,
      reviewerEmail: String,
      reviewerName: String,
    },
  ],
  shippingInformation: String,
  sku: String,
  stock: Number,
  tags: [String],
  thumbnail: String,
  title: String,
  warrantyInformation: String,
  weight: Number,
});

const ProductModel = mongoose.model('product', productSchema);

module.exports = ProductModel;
