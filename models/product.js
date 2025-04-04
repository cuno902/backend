import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        default: 0
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
