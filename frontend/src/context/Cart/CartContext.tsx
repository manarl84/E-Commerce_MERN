import { createContext, useContext } from "react";
import type { CartItem } from "../../types/CartItem";


interface CartContextType {
    cartItems: CartItem[];
    totalAmount: number;
    err: string;
    addItemToCart: (productId: string) => void;
    UpdateItemInCart: (productId: string, quantity: number) => void;
}

export const CartContext = createContext<CartContextType>({
    cartItems: [],
    totalAmount: 0,
    err: "",
    addItemToCart: () => {},
    UpdateItemInCart: () => {}
});

export const useCart = () => useContext(CartContext); // custom hook to use the auth context