import mongoose from "mongoose";

const addToCartSchema = new mongoose.Schema({
    productId: {
        ref: 'Product', // Correct the reference to match the Product model name
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId type
    },
    quantity: Number,
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId type
        ref: 'User' // Assuming there's a User model
    }
}, {
    timestamps: true
});

const AddToCart = mongoose.model("AddToCart", addToCartSchema);

export default AddToCart;
