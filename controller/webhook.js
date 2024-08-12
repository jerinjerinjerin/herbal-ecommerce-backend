import { stripe } from "../config/stripe.js";
import dotenv from 'dotenv';
dotenv.config();

const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

console.log('webhook', endpointSecret);

export const webhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];
  const payloadString = JSON.stringify(request.body);

  let event;

  try {
    event = stripe.webhooks.constructEvent(payloadString, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log("session", session);
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        // TODO: Process the completed Checkout Session
      } catch (err) {
        console.error(`Failed to retrieve line items: ${err.message}`);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.status(200).send();
}
