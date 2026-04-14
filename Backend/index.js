const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL?.trim().replace(/\/$/, '');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === FRONTEND_URL) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//listening server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

//database connection
mongoose.connect(MONGODB_URI, { dbName: 'Trainning_Cart' });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to DataBase');
});

//health-check
app.use('/health-check', (req, res) => {
  res.status(200).send({ message: 'Server is running' });
});

//API routes
const productRouter = require('./routes/product.route');
const categoryRouter = require('./routes/category.route');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const cartRouter = require('./routes/cart.route');
const wishListRouter = require('./routes/wishlist.route');
const paymentRouter = require('./routes/payment.route');
const orderRouter = require('./routes/order.route');

app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/carts', cartRouter);
app.use('/api/wishlists', wishListRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/orders', orderRouter);
