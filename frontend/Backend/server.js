require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey || !secretKey.startsWith('sk_test_51ROl5WRCz11UNurnULa2n60tz9PvzpMo8EAJHVpRP2bkHQhUeACP3wBWfwbAa8AgwmiixzVLUe1zea1qax2BnAGX00ZOWMs0aj')) {
  console.error('Invalid or missing STRIPE_SECRET_KEY:', secretKey);
  process.exit(1);
}
console.log('Loaded STRIPE_SECRET_KEY:', secretKey);
const stripe = Stripe(secretKey);

app.use(express.json());
app.use(cors());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    console.log('Received request to create payment intent:', { amount, currency });

    if (!amount || !currency) {
      throw new Error('Missing amount or currency in request');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });

    console.log('Payment intent created:', paymentIntent.id);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Error creating payment intent:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4242;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));