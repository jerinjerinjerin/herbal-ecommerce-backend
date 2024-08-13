import { stripe } from "../config/stripe.js"; // Import the configured Stripe instance
import User from "../modules/user.js"; // Import the User model
import dotenv from 'dotenv'; // Import dotenv to manage environment variables
import Order from "../modules/order.js"; // Import the Order model

dotenv.config(); // Load environment variables from the .env file

// Destructure necessary environment variables for easy access
const { FRONTEND_URL, STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY } = process.env;

// Payment Controller to handle payment initiation
export const paymentController = async (req, res) => {
  try {
    const { cartItems } = req.body; // Extract cart items from the request body

    // Validate the cart items
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart items are missing or invalid.",
        error: true,
        success: false,
      });
    }

    // Fetch the user based on the userId in the request
    const user = await User.findOne({ _id: req.userId });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    // Parameters for creating the Stripe Checkout Session
    const params = {
      submit_type: "pay", // Type of payment action
      mode: "payment", // Mode of payment (one-time payment)
      payment_method_types: ["card"], // Payment methods allowed
      billing_address_collection: "auto", // Automatically collect billing address
      shipping_options: [
        {
          shipping_rate: "shr_1PlV3O2LzrSrf98ZZNCYX5PJ", // Ensure this ID is correct
        },
      ],
      customer_email: user.email, // User's email
      metadata: {
        userId: req.userId, // Attach userId in metadata
      },
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "usd", // Currency for the transaction
          product_data: {
            name: item.productId.productName, // Product name

            // Ensure images are in an array format
            images: Array.isArray(item.productId.productImage)
              ? item.productId.productImage  // Use as-is if it's already an array
              : [item.productId.productImage], // Convert to array if it's a single string
            
            metadata: {
              productId: item.productId._id.toString(), // Attach productId in metadata
            },
          },
          unit_amount: item.productId.sellingPrice * 100, // Convert price to cents
        },
        adjustable_quantity: {
          enabled: true, // Allow quantity adjustment
          minimum: 1, // Minimum quantity
        },
        quantity: item.quantity, // Item quantity
      })),
      success_url: `${FRONTEND_URL}/success`, // Redirect on successful payment
      cancel_url: `${FRONTEND_URL}/cancel`, // Redirect if payment is canceled
    };

    // Create the Stripe Checkout session
    const session = await stripe.checkout.sessions.create(params);

    // Return the session ID to the client
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

// Webhooks handler to process events from Stripe
export const webhooks = async (req, res) => {
  const sig = req.headers['stripe-signature']; // Get the Stripe signature from headers
  const payload = req.body; // Get the raw body payload

  let event;

  try {
    // Verify and construct the Stripe event from the payload and signature
    event = stripe.webhooks.constructEvent(payload, sig, STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY);
    console.log('Webhook event:', event);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      try {
        // Fetch the line items from the checkout session
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const productDetails = getLineItems(lineItems); // Assume getLineItems is defined elsewhere

        // Prepare the order details
        const orderDetails = {
          productDetails,
          email: session.customer_email, // Customer's email
          userId: session.metadata.userId, // User ID from metadata
          paymentDetails: {
            paymentId: session.payment_intent, // Payment intent ID
            payment_method_type: session.payment_method_types[0], // Access the first payment method
            payment_status: session.payment_status, // Payment status
          },
          shipping_options: session.shipping_options || [], // Shipping options
          totalAmount: session.amount_total / 100, // Convert total amount from cents to dollars
        };

        // Save the order to the database
        const order = new Order(orderDetails);
        const savedOrder = await order.save();
        console.log("Order saved successfully:", savedOrder);
      } catch (err) {
        console.error(`Failed to process checkout session: ${err.message}`);
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Acknowledge receipt of the event
  res.status(200).send();
};





/**
 * Processes the line items from the Stripe checkout session.
 * @param {Array} lineItems - The array of line items returned from the Stripe API.
 * @returns {Array} - An array of processed product details.
 */
async function getLineItems(lineItems) {
  // Initialize an empty array to store the product details
  const productDetails = [];

  // Iterate through each line item
  for (const item of lineItems.data) {
    const productDetail = {
      productId: item.price.product.metadata.productId, // Extract the product ID from metadata
      productName: item.description, // The product name/description
      quantity: item.quantity, // The quantity purchased
      unitPrice: item.price.unit_amount / 100, // Convert unit price from cents to dollars
      totalAmount: (item.price.unit_amount / 100) * item.quantity, // Calculate total amount
    };

    // Add the processed product detail to the array
    productDetails.push(productDetail);
  }

  // Return the array of product details
  return productDetails;
}
