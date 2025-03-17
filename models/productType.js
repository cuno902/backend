import mongoose from 'mongoose';

const ProductTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const ProductType = mongoose.model('ProductType', ProductTypeSchema);

export default ProductType;
