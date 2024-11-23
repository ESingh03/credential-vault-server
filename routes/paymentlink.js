const express = require('express');
const router = express.Router();
const db=require('../db');
const stripe = require('stripe')('sk_test_51Q3c8iP9RC8tv1gtiPY3osWu5yqoDWZOzta6WenMQbMcFWxSABEcqM0CqifqO6NlbFJiaz5AHGJgqefqbiXB8Osr00le4A7woa');

router.post('/create-payment-link', async (req, res) => {
    try {
      const { app_username } = req.body; // Get product and user info from the client
      
      // Create a Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Credentail Vault Pro',  // Dynamic product name
              },
              unit_amount: 10 * 100,  // Amount in cents (e.g., 2000 = $20.00)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',  // For one-time payments
        success_url: `http://192.168.83.214:3000/success?session_id={CHECKOUT_SESSION_ID}`,  // Redirect on success
        cancel_url: 'http://192.168.83.214:3000/cancel',  // Redirect on cancel
        metadata: {
            user_id: app_username,  // Optionally store the user ID in metadata for later use
          },
      });
      // Send the session URL to the client
      res.json({ url: session.url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Payment link creation failed.' });
    }
  });
  
  // Success handler to generate and send the invoice
  router.get('/success', async (req, res) => {
    const sessionId = req.query.session_id;
  
    try {
      // Retrieve the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const app_username= await session.metadata.user_id;
      console.log(app_username);
      console.log('asc');

      db.get(`Update user
        SET subscribed=? WHERE user = ?;`,
        [1,app_username]);
  
      // Show a custom success page or message with the payment details
      res.send(`
        <h1>Thank You for Your Payment!</h1>
        <p>Payment successfully completed. Your order has been received.</p>
        <p>Order ID: ${session.id}</p>
        <p>Amount Paid: $${(session.amount_received / 100).toFixed(2)}</p>
      `);
    } catch (err) {
      console.error('Error retrieving session:', err);
      res.status(500).send('Error retrieving payment session.');
    }
  });
  // Endpoint to handle cancel payment
  router.get('/cancel', (req, res) => {
    res.send('<h1>Payment Cancelled</h1><p>Your payment was cancelled. Please try again.</p>');
  });

module.exports = router;
