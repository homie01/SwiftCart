const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');

class UserController {
  all = async (req, res) => {
    try {
      const users = await UserModel.find();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  };

  getById = async (req, res) => {
    try {
      const userId = req.params.id;

      const existUser = await UserModel.findById({ _id: userId });

      if (!existUser) {
        return res
          .status(404)
          .json({ success: false, error: 'User not found.' });
      }

      res.json({ success: true, data: existUser });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  };

  update = async (req, res) => {
    try {
      const userId = req.params.id;
      const objectToBeUpdated = req.body.userData;

      const existUser = await UserModel.findById({ _id: userId });

      if (!existUser) {
        return res
          .status(404)
          .json({ success: false, error: 'User not found.' });
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        { _id: userId },
        objectToBeUpdated,
        { new: true }
      );

      res.json({
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully!',
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  };

  updateAddress = async (req, res) => {
    try {
      const userId = req.params.userId;
      const newAddress = req.body.address;

      const existUser = await UserModel.findById({ _id: userId });
      if (!existUser) {
        return res
          .status(404)
          .json({ success: false, error: 'User not found.' });
      }

      existUser.address.push(newAddress);
      await existUser.save();

      res.json({
        success: true,
        data: existUser,
        message: 'Address updated successfully!',
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  };

  deleteAddress = async (req, res) => {
    try {
      const userId = req.params.userId;
      const addressId = req.params.addressId;

      const existUser = await UserModel.findById({ _id: userId });
      if (!existUser) {
        return res
          .status(404)
          .json({ success: false, error: 'User not found.' });
      }

      existUser.address = existUser.address.filter(
        (address) => address._id.toString() !== addressId
      );

      await existUser.save();

      return res.json({
        success: true,
        data: existUser,
        message: 'Address removed successfully!',
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  };

  updatePassword = async (req, res) => {
    try {
      const userId = req.params.userId;
      const { password } = req.body;

      const existUser = await UserModel.findById({ _id: userId });
      if (!existUser) {
        return res
          .status(404)
          .json({ success: false, error: 'User not found.' });
      }

      const isPassword = await bcrypt.compareSync(
        password.old,
        existUser.password
      );

      if (!isPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid old password.',
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password.new, salt);

      existUser.password = hash;

      await existUser.save();

      return res.json({
        success: true,
        data: existUser,
        message: 'Password updated successfully!',
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  };
}

module.exports = new UserController();
