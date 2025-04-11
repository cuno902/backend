import mongoose from 'mongoose';
import Product from './product.js';

const CartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [CartItemSchema],
    totalPrice: {
        type: Number,
        default: 0
    }   
});


CartSchema.methods.calculateTotalPrice = async function () {
    let total = 0;

    for (const item of this.items) {
        const product = await Product.findById(item.productId);
        if (product) {
            total += product.price * item.quantity;
        }
    }

    this.totalPrice = total;
    return this.save();
};


CartSchema.methods.addItem = async function (productId, quantity) {
    const existingItem = this.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        this.items.push({ productId, quantity });
    }

    await this.calculateTotalPrice();
    return this.save();
};


CartSchema.methods.removeItem = async function (productId) {
    this.items = this.items.filter(item => item.productId.toString() !== productId);
    
    await this.calculateTotalPrice();
    return this.save();
};


CartSchema.methods.clearCart = async function () {
    this.items = [];
    this.totalPrice = 0;
    return this.save();
};

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;
