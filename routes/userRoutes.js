import express from 'express';
import { registerUser, loginUser, getAllUsers, updateUser, deleteUser, getUserById, getUserProfile, changeUserPassword } from '../controllers/userControllers.js';
import { authenticateUser } from '../middlware/authenticateUser.js';

const userRoutes = express.Router();
userRoutes.post( '/register', registerUser);
userRoutes.post( '/login', loginUser);
userRoutes.get('/',authenticateUser, getAllUsers); // Admin only
userRoutes.put('/:id', authenticateUser, updateUser); 
userRoutes.delete( '/:id', authenticateUser, deleteUser); // Admin only
userRoutes.get('/:id', authenticateUser, getUserById); 
userRoutes.get('/profile/:id', authenticateUser, getUserProfile);
userRoutes.post('/change-password/:id', authenticateUser, changeUserPassword);

export default userRoutes;
