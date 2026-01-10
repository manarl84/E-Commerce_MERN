import { get } from "http";
import { productModel } from "../models/productModel.js";


export const getAllProducts = async () => {
    return await productModel.find();
}

export const seedIntialProducts = async () => {

// handle errors like issues in database conneciton
try{
    const products = [
    { title: "Dell Laptop", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrcwKjDWLOdOzdq9gwm3RVzR7-fAvJNxBtnQ&s", price: 1500, stock: 10 },
    { title: "Asus Laptop", image: "https://m.media-amazon.com/images/I/71C-Yi26fZL._AC_UF1000,1000_QL80_.jpg", price: 2500, stock: 8 },
    { title: "HP Laptop", image: "https://m.media-amazon.com/images/I/81BDZ5UI3jL._AC_UF1000,1000_QL80_.jpg", price: 4000, stock: 20 }
    ];

    const existingProducts = await getAllProducts();

    if (existingProducts.length === 0) {
        await productModel.insertMany(products);
        return {data: products, status: 201};
    };
}
catch(error) {
    return {data: "Internal Server Error", status: 500}
};

}


