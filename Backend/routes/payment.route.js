const express = require('express');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

const Frontend_URL =
  process.env.ENV === 'production'
    ? 'https://swiftcart-shop.netlify.app'
    : (process.env.FRONTEND_URL || 'http://localhost:5173').trim().replace(/\/$/, '');

router.post('/create-checkout-session', async (req, res) => {
  try {
    const cartProducts = req.body.cartProducts;

    if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
      return res.status(400).json({ error: 'Cart products are required.' });
    }

    const lineItems = cartProducts.map((product) => {
      if (!product.title || !product.price || !product.productCount) {
        throw new Error('Missing product details.');
      }

      const discountedPrice = Math.round(
        product.price - (product.discountPercentage * product.price) / 100
      );

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: product.thumbnail ? [product.thumbnail] : [],
            metadata: {
              productId: product._id,
            },
          },
          unit_amount: discountedPrice * 100,
        },
        quantity: product.productCount,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_options: [
        { shipping_rate: 'shr_1Q4hhP2LNHJcq8E5IGQkWvfq' },
        { shipping_rate: 'shr_1Q4hio2LNHJcq8E5YkRUGoIx' },
      ],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${Frontend_URL}/checkout?success=true`,
      cancel_url: `${Frontend_URL}/checkout?canceled=true`,
    });

    res.json({ id: session.id, data: cartProducts });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
