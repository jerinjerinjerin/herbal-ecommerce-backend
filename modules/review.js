import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: String, required: true},
    productId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    title:{ type: String, required: true},
    createdAt: { type: Date, default: Date.now }
}, {versionKey:false})

const Review = mongoose.model('Review', reviewSchema)

export default Review;