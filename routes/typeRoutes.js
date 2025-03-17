import express from 'express';
import { 
    createProductType, 
    getAllProductTypes, 
    getProductTypeById, 
    updateProductType, 
    deleteProductType 
} from '../controllers/typeControllers.js';
import { authenticateUser } from '../middlware/authenticateUser.js';

const typeRouter = express.Router();


// Routes for product types
typeRouter.post( '/',authenticateUser, createProductType); 
typeRouter.get( '/', getAllProductTypes);  
typeRouter.get('/:id', getProductTypeById);  
typeRouter.put('/:id',authenticateUser, updateProductType);  
typeRouter.delete( '/:id', authenticateUser,deleteProductType);  

export default typeRouter;
