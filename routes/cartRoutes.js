import express from 'express';
import { addToCart, removeFromCart, clearCart, getCart, updateCartItemQuantity } from '../controllers/cartControllers.js';
import { authenticateUser } from '../middlware/authenticateUser.js';


const cartRouter = express.Router();


cartRouter.post('/add', authenticateUser, addToCart);

cartRouter.post('/remove', authenticateUser, removeFromCart);


cartRouter.post('/clear', authenticateUser, clearCart);

cartRouter.get('/', authenticateUser, getCart);

cartRouter.post("/update", authenticateUser, updateCartItemQuantity);

export default cartRouter;
