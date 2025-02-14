import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    company: { type: String, required: true, trim: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
