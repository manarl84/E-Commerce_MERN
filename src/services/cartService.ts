import { cartModel } from "../models/cartModel.js";


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
