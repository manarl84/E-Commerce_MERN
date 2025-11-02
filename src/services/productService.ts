import { get } from "http";
import { productModel } from "../models/productModel.js";


export const getAllProducts = async () => {
    return await productModel.find();
}

export const seedIntialProducts = async () => {

const products = [
{ title: "Dell Laptop", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrcwKjDWLOdOzdq9gwm3RVzR7-fAvJNxBtnQ&s", price: 2500, stock: 10 }
];

const existingProducts = await getAllProducts();

if (existingProducts.length === 0) {
    await productModel.insertMany(products);
};
};


