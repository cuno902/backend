import mongoose from "mongoose";
import Product from "../models/product.js"
import ProductType from "../models/productType.js";

export const getAllProducts = async (req, res) => {
    try {
        let query = {};

        if (req.query.type) {
            query.type = req.query.type; 
        }

        let products = await Product.find(query).populate("type");

        if (req.query.sortBy) {
            if (req.query.sortBy === "newest") {
                products = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (req.query.sortBy === "oldest") {
                products = products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            } else if (req.query.sortBy === "lowToHigh") {
                products = products.sort((a, b) => a.price - b.price);
            } else if (req.query.sortBy === "highToLow") {
                products = products.sort((a, b) => b.price - a.price);
            }
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLatestProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("type")
            .sort({ createdAt: -1 }) 
            .limit(10);              

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getHottestProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("type")
            .sort({ createdAt: 1 })  
            .limit(10);              

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('type');
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductsByType = async (req, res) => {
    try {
        const { typeId } = req.params;
        const products = await Product.find({ type: typeId }).populate('type');
        if (!products.length) return res.status(404).json({ message: 'Danh mục này không có sản phẩm' });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, material, stock, type } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        if (!mongoose.Types.ObjectId.isValid(type)) {
            return res.status(400).json({ message: "Không có danh mục này" });
        }

        const productType = await ProductType.findById(type);
        if (!productType) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            material,
            imageUrl,
            stock,
            type
        });

        await newProduct.save();
        res.status(201).json({ message: "Tạo thành công", product: newProduct });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, material, stock } = req.body;
        const imageUrl = req.file ? req.file.path : undefined;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { 
                name, 
                description, 
                price, 
                material, 
                stock, 
                imageUrl 
            },
            { new: true, runValidators: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.status(200).json({ message: "Sửa thành công", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.json({ message: 'Sản phẩm đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

