import express from 'express';
import { getAllProducts, seedIntialProducts } from '../services/productService.js';


const router = express.Router();

router.get('/', async (req, res) => {

try {

    const products = await getAllProducts();
    res.status(200).send(products);
}

    catch (error) {
    res.status(500).send({message: 'Internal Server Error'});
}

})

router.post ('/', async (req, res) => {
    const initialProducts = await seedIntialProducts();
    res.status(201).send(initialProducts?.data);
});

export default router;