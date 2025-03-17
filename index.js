import express from "express"
import { connectDb } from "./config/db.js";
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import typeRouter from "./routes/typeRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";



const app = express();

app.get("/", (req, res) => {
 res.send("ok");
})

app.use(express.json()); 
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));
app.use('/api/users', userRoutes); 
app.use('/api/products', productRouter)
app.use('/api/types', typeRouter);
app.use('/api/cart', cartRouter)
app.listen(3000, () => {
    connectDb();
    console.log("Server chạy trên http://localhost:3000");
});


