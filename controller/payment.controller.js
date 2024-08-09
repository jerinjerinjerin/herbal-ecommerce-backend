import { stripe } from "../config/stripe.js";
import User from "../modules/user.js";

export const paymentController = async (req, res) => {
  try {
    const { cartItems } = req.body;

    console.log('cartItems', cartItems);

    // Check if cartItems is provided and is an array
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart items are missing or invalid.",
        error: true,
        success: false,
      });
    }

    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [
        {
          shipping_rate: "shr_1PlV3O2LzrSrf98ZZNCYX5PJ", // Ensure this is a valid shipping rate ID
        },
      ],
      customer_email: user.email,
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productId.productName,
            images: item.productId.productImage, // Ensure this is an array of image URLs
            metadata: {
              productId: item.productId._id.toString(), // Ensure metadata is serializable
            },
          },
          unit_amount: item.productId.sellingPrice * 10, // Amount in cents
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1, // Correct spelling
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params);

    res.status(200).json({ id: session.id }); // Use 200 status and return session ID
  } catch (error) {
    console.error("Payment error:", error); // Log error for debugging
    res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};
