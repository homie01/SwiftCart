const categoryModel = require('../models/category.model');

class categoryController {
  all = async (req, res) => {
    try {
      const categories = await categoryModel.find();
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  };

  add = async (req, res) => {
    try {
      const category = req.body;

      const newCategory = await categoryModel.create(category);

      res.json({
        success: true,
        data: newCategory,
        message: 'Category added successfully!',
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  };
}

module.exports = new categoryController();
