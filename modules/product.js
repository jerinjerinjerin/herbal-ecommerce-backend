import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  brandName: { type: String, required: true },
  ageByShop: { type: String, required: true },
  category: { type: String, required: true },
  productImage: [{ type: String }], // Array of strings for image URLs/paths
  quantity: { type: Number, required: true, min: 0 }, // Non-negative quantity
  price: { type: Number, required: true, min: 0 }, // Non-negative price
  sellingPrice: { type: Number, required: true, min: 0 }, // Non-negative selling price
  weight: { type: String, required: true },
  expireDate: {type: Date,required: true}


}, { timestamps: true, versionKey: false });

const Product = mongoose.model('Product', productSchema);

export default Product;
