import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByType } from '../controllers/productControllers.js';
import upload from '../config/cloudinary.js';
import { authenticateUser } from '../middlware/authenticateUser.js';


const productRouter = express.Router();

productRouter.post( '/', authenticateUser, upload.single('image'), createProduct); // Admin only
productRouter.get( '/', getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.get('/type/:typeId', getProductsByType);
productRouter.put( '/:id',authenticateUser,upload.single('image'), updateProduct); // Admin only
productRouter.delete( '/:id',authenticateUser, deleteProduct); // Admin only

export default productRouter;
