import { parse } from "path";
import { cartModel, type ICart, type ICartItem } from "../models/cartModel.js";
import { productModel } from "../models/productModel.js";
import { orderModel, type IOrderItem } from "../models/orderModel.js";


interface CreateCartForUser {
    userId: string;

}

// Internal function to create a cart for a user - will not be used by routes directly
// We segregate this function to keep the code clean and modular (Maintainability)
const createCartForUser = async ({userId}: CreateCartForUser) => {

    try {

    const cart = await cartModel.create({userId, totalAmount: 0}); //only create the cart model in the database but not presist it
    await cart.save(); // persist the new cart to the database
    return cart;

    }
    catch (error) {
        throw new Error('Error creating cart for user');
    }

}


interface GetActiveCartForUser {
    userId: string;
}


export const getActiveCartForUser = async ({userId}: GetActiveCartForUser) => {

    try {

        let cart = await cartModel.findOne({userId, status: 'active'}); // find the active cart for the user

        if (!cart) {

            cart = await createCartForUser({userId}); // create a new cart for the user if not found

        }
        return cart;
    }
    catch (error) {
        throw new Error('Error fetching active cart for user');
    }
}

interface ClearCart {
    userId: string;
}

export const clearCart = async ({userId}:ClearCart) => {

    try {

        const cart = await getActiveCartForUser({userId});
        cart.items = [];
        cart.totalAmount = 0;
        const updatedCart = await cart.save();
        return { data: updatedCart, statusCode: 200 };
    }
        catch (error) {
        return { data: 'Internal Server Error', statusCode: 500 };

    }
}

interface AddItemToCart {
    userId: string;
    productId: any;
    quantity: number;
}

export const addItemToCart = async ({productId, quantity, userId}:AddItemToCart) => {

    try {

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
    catch (error) {
        return { data: 'Internal Server Error', statusCode: 500 };
    }

}

interface UpdateItemInCart {
    userId: string;
    productId: any;
    quantity: number;
}


export const updateItemInCart = async ({userId, productId, quantity}: UpdateItemInCart) => {

    try {
    
        const cart = await getActiveCartForUser({userId});
        const existInCart = cart.items.find((p) => p.product.toString() === productId);
        if (!existInCart) {
            return { data: 'Product does not exist in the cart', statusCode: 400 };
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return { data: 'Product not found', statusCode: 400 };
        }

        if (product.stock < quantity) {
            return { data: 'Insufficient stock for the product', statusCode: 400 };
        }



        const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId); // Get all items except the one being updated
        //console.log(otherCartItems);

        //Calculate total amount for the cart

        let total = calculateCartTotalItems({cartItems: otherCartItems})

        existInCart.quantity = quantity; // Update the quantity
        total += existInCart.unitPrice * existInCart.quantity;

        cart.totalAmount = total;
        const updatedCart = await cart.save();

        return { data: updatedCart, statusCode: 200 };

    }
        catch (error) {
        return { data: 'Internal Server Error', statusCode: 500 };  
    }
}

interface DeleteItemInCart {
    userId: string;
    productId: any;
}

export const deleteItemInCart = async ({userId, productId}: DeleteItemInCart) => {

    try {

        const cart = await getActiveCartForUser({userId});
        const existInCart = cart.items.find((p) => p.product.toString() === productId);
        if (!existInCart) {
            return { data: 'Product does not exist in the cart', statusCode: 400 };
        }
        const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);
        
        const total = calculateCartTotalItems({cartItems: otherCartItems})
        cart.items = otherCartItems;
        cart.totalAmount = total;
        
        const updatedCart = await cart.save();

        return { data: updatedCart, statusCode: 200 };
    }

    catch (error) {
        return { data: 'Internal Server Error', statusCode: 500 };
    }

}



// Abstracted function to calculate total amount of cart items
const calculateCartTotalItems = ({cartItems}: {cartItems: ICartItem[]}) => {

    
    const total = cartItems.reduce((sum, product) => {
        sum += product.unitPrice * product.quantity
        return sum;
    }, 0);

    return total;

}

interface Checkout {
    userId: string;
    address: string;
}

export const checkout = async ({userId, address}: Checkout) => {

    try {

        if (!address || address.trim() === '') {
            return { data: 'Address is required for checkout', statusCode: 400 };
        }

        const cart = await getActiveCartForUser({userId});

        const orderItems: IOrderItem[] = [];

        // Loop on cartItems to create oderItems

        for (const item of cart.items) { // of like forEach 

            const product = await productModel.findById(item.product);

            if (!product) {
                return { data: `Product with id ${item.product} not found`, statusCode: 400 };
            }

            const orderItem: IOrderItem = {
                productTitle: product.title,
                productImage: product.image,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
            }   
            orderItems.push(orderItem);
        }

        const order = await orderModel.create({
            orderItems,
            total: cart.totalAmount,
            address, // In real app, address should be declated in User Model as Address Array , from user profile or input
            userId,
        });

        await order.save();

        // Update the cart status to be completed

        cart.status = 'completed';
        await cart.save();

        return { data: order, statusCode: 200 };

        // Deduct stock from products --> Suggested by Copilot
        // Create order --> Suggested by Copilot
    }

    catch (error) {
        return { data: 'Internal Server Error', statusCode: 500 };
    }

}