import 'dotenv/config';
// import dotenv from 'dotenv';
// dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import { seedIntialProducts } from './services/productService.js';
import cartRoute from './routes/cartRoute.js';
import cors from 'cors';


const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());


console.log(process.env.DATABASE_URL);
mongoose.connect(process.env.DATABASE_URL || '')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

  seedIntialProducts()

app.use('/user',userRoute);
app.use ('/products',productRoute);
app.use('/cart', cartRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});