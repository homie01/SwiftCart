const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

class AuthController {
  register = async (req, res) => {
    try {
      let user = req.body.registerData;

      const existUser = await UserModel.findOne({ email: user.email });

      if (existUser) {
        return res.status(400).json({ error: 'User already exists.' });
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(user.password, salt);

      user.password = hash;

      const newUser = await UserModel.create({ ...user, role: 'user' });

      res.status(200).json({
        success: true,
        message: 'User registered successfully!',
        data: newUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  login = async (req, res) => {
    try {
      const user = req.body.loginData;

      const existingUser = await UserModel.findOne({ email: user.email });

      if (!existingUser) {
        return res.status(400).json({ error: 'User not found!' });
      }

      const isPassword = await bcrypt.compareSync(
        user.password,
        existingUser.password
      );

      if (!isPassword || user.email !== existingUser.email) {
        return res.status(400).json({
          success: false,
          error: 'Incorrect credentials.',
        });
      }

      const token = jwt.sign(
        {
          id: existingUser._id,
          role: existingUser.role,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWTExpires,
        }
      );

      const { password, role, ...otherDetails } = existingUser._doc;

      res.status(200).json({
        success: true,
        message: 'Login successfull!',
        data: { ...otherDetails },
        token: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  googleLogin = async (req, res) => {
    try {
      const user = req.body.googleData;

      // Find existing user by email
      const existingUser = await UserModel.findOne({
        email: user.email,
      });

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('random@123', salt);

      // If user doesn't exist, return error message
      if (existingUser) {
        const token = jwt.sign(
          {
            id: existingUser._id,
            role: existingUser.role,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: process.env.JWTExpires,
          }
        );

        const { password, role, ...otherDetails } = existingUser._doc;

        return res.status(200).json({
          success: true,
          message: 'Login successfull!',
          data: { ...otherDetails },
          token: token,
        });
      }

      const newUser = await UserModel.create({
        ...user,
        firstname: user.given_name,
        lastname: user.family_name,
        password: hash,
        role: 'user',
      });

      const token = jwt.sign(
        {
          id: newUser._id,
          role: newUser.role,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWTExpires,
        }
      );

      const { password, role, ...otherDetails } = newUser._doc;

      res.status(200).json({
        success: true,
        message: 'Login successfull!',
        data: { ...otherDetails },
        token: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        error: 'Error while logining user!',
      });
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      const existUser = await UserModel.findOne({ email });

      if (!existUser) {
        return res.status(404).json({
          success: false,
          error: 'User does not exist with this email!',
        });
      }

      const payload = { email };
      const secret = process.env.JWT_SECRET_KEY;
      const options = { expiresIn: '1h' };

      const token = jwt.sign(payload, secret, options);

      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${existUser._id}/${token}`;

      await transporter.sendMail({
        from: process.env.APP_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
      });

      res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email!',
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { userId, password } = req.body;

      const user = await UserModel.findById({ _id: userId });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found!',
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      await UserModel.findByIdAndUpdate(
        {
          _id: userId,
        },
        {
          password: hash,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Your password has been successfully updated!',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: 'Internal server error!' });
    }
  };
}

module.exports = new AuthController();
