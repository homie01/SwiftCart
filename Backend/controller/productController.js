const ProductModel = require('../models/product.model');

class productController {
  all = async (req, res) => {
    try {
      const products = await ProductModel.find();
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  };

  getById = async (req, res) => {
    try {
      const productId = req.params.id;

      const existProduct = await ProductModel.findById({
        _id: productId,
      });

      if (!existProduct) {
        return res.status(404).json({
          success: false,
          error: 'Product not found!',
        });
      }

      const product = await ProductModel.findById({ _id: productId });

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  };

  create = async (req, res) => {
    try {
      const objectToBeAdded = req.body;

      const product = await ProductModel.create(objectToBeAdded);

      res.status(201).json({
        success: true,
        data: product,
        message: 'Product added successfully!',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  };

  update = async (req, res) => {
    try {
      const productId = req.params.id;
      const objectToBeUpdated = req.body;

      const existProduct = await ProductModel.findById({
        _id: productId,
      });

      if (!existProduct) {
        return res.status(404).json({
          success: false,
          error: 'Product not found!',
        });
      }

      const product = await ProductModel.findByIdAndUpdate(
        { _id: productId },
        objectToBeUpdated,
        {
          new: true,
        }
      );
      res.status(200).json({
        success: true,
        data: product,
        message: 'Product updated successfully!',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  };

  delete = async (req, res) => {
    try {
      const productId = req.params.id;
      const existProduct = await ProductModel.findById({ _id: productId });

      if (!existProduct) {
        return res.status(404).json({
          success: false,
          error: 'Product not found!',
        });
      }

      const product = await ProductModel.findByIdAndDelete({ _id: productId });

      res.status(200).json({
        success: true,
        data: product,
        message: 'Product deleted successfully!',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  };
}

module.exports = new productController();
