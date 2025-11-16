import { parse } from "path";
import { cartModel } from "../models/cartModel.js";
import { productModel } from "../models/productModel.js";


interface CreateCartForUser {
    userId: string;

}

// Internal function to create a cart for a user - will not be used by routes directly
// We segregate this function to keep the code clean and modular (Maintainability)
const createCartForUser = async ({userId}: CreateCartForUser) => {
    const cart = await cartModel.create({userId, totalAmount: 0}); //only create the cart model in the database but not presist it
    await cart.save(); // persist the new cart to the database
    return cart;
}


interface GetActiveCartForUser {
    userId: string;
}


export const getActiveCartForUser = async ({userId}: GetActiveCartForUser) => {

    let cart = await cartModel.findOne({userId, status: 'active'}); // find the active cart for the user

    if (!cart) {

        cart = await createCartForUser({userId}); // create a new cart for the user if not found

    }
    return cart;
}

interface addItemToCart {
    userId: string;
    productId: any;
    quantity: number;
}

export const addItemToCart = async ({productId, quantity, userId}:addItemToCart) => {
    const cart = await getActiveCartForUser({userId});
    
    // Does the item already exist in the cart?
    const existInCart = cart.items.find((p) => p.product.toString() === productId); //product is ObjectId & productId is string so we use .toString()

    if (existInCart) {
        // Update quantity OR Simply return a simply message like below
        return { data: 'Product already exists in the cart', statusCode: 400 };
    }

    // else fetch the product by its id

    const product = await productModel.findById(productId);
    if (!product) {
        return { data: 'Product not found', statusCode: 400 };
    }

    if (product.stock < quantity) {
        return { data: 'Insufficient stock for the product', statusCode: 400 };
    }

    cart.items.push({
        product: productId,
        unitPrice: product.price,
        quantity,
    });

    cart.totalAmount += product.price * quantity;

    const updatedCart = await cart.save();

    return { data: updatedCart, statusCode: 200 }; 

}
