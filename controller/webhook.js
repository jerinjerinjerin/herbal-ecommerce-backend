import { stripe } from "../config/stripe.js";
import dotenv from 'dotenv';
import Order from "../modules/order.js";
dotenv.config();

const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

export const webhooks = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const payloadString = JSON.stringify(req.body);

  console.log('Received Stripe webhook:', {
    signature: sig,
    payload: payloadString,
  });

  let event;

  try {
    // Construct the event from the payload and signature
    event = stripe.webhooks.constructEvent(payloadString, sig, endpointSecret);
    console.log('Constructed event:', event);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log("checkout.session.completed event received:", session);
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const productDetails = await getLineItems(lineItems); // Ensure this function exists

        const orderDetails = {
          productDetails,
          email: session.customer_email,
          userId: session.metadata.userId,
          paymentDetails: {
            paymentId: session.payment_intent,
            payment_method_type: session.payment_method_options.card || [],
            payment_status: session.payment_status,
          },
          shipping_options: session.shipping_options || [],
          totalAmount: session.amount_total / 100,
        };

        const order = new Order(orderDetails);
        const savedOrder = await order.save();
        console.log("Order saved successfully:", savedOrder);
      } catch (err) {
        console.error(`Failed to process checkout session: ${err.message}`);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send();
};
