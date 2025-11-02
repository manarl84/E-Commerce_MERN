import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import { seedIntialProducts } from './services/productService.js';


const app = express();
const PORT = 3001;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

  seedIntialProducts()

app.use('/user',userRoute);
app.use ('/',productRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});