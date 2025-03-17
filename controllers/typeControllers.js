import ProductType from '../models/productType.js';
import User from "../models/user.js"


export const createProductType = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Hãy điền tên" });

        const existingType = await ProductType.findOne({ name });
        if (existingType) return res.status(400).json({ message: "Loại sản phẩm đã tồn tại" });

        const newProductType = new ProductType({ name });
        await newProductType.save();
        res.status(201).json({ message: "Đã tạo", productType: newProductType });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllProductTypes = async (req, res) => {
    try {
        const productTypes = await ProductType.find();
        res.status(200).json(productTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getProductTypeById = async (req, res) => {
    try {
        const productType = await ProductType.findById(req.params.id);
        if (!productType) return res.status(404).json({ message: "Không tìm thấy danh mục" });

        res.status(200).json(productType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateProductType = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }
        const { name } = req.body;
        const productType = await ProductType.findById(req.params.id);

        if (!productType) return res.status(404).json({ message: "Không tìm thấy danh mục" });

        productType.name = name || productType.name;
        await productType.save();
        res.status(200).json({ message: "Đã sửa", productType });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteProductType = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }
        const deletedProductType = await ProductType.findByIdAndDelete(req.params.id);
        if (!deletedProductType) return res.status(404).json({ message: "Không tìm thấy danh mục" });

        res.status(200).json({ message: "Đã sửa" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
