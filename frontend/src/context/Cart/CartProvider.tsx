import { useState, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import { type CartItem } from "../../types/CartItem";
import { BASE_URL } from "../../constants/baseUrl";
import { useAuth } from "../Auth/AuthContext";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  
  const {token} = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState("");


  const addItemToCart = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!response.ok) {
        const text = await response.text();
        setError(`Failed to add item to cart. ${text || response.statusText}`);
        return;
      }

      const cart = await response.json();
      if (!cart || !Array.isArray(cart.items)) {
        setError("Failed to parse cart data.");
        return;
      }

      const cartItemsMapped = cart.items.map(({ product, quantity }: {product: any, quantity: number }) => ({
        productId: product?._id ?? product ?? "",
        title: product?.title ?? "",
        image: product?.image ?? "",
        quantity: quantity ?? 0,
        unitPrice: product?.price ?? 0,
      }));

      setCartItems(cartItemsMapped);

      //setCartItems([...cart.items]); //spread the items of the returned cart
      // setCartItems([...cartItems, cart.items]); // Append new items to existing cartItems
      setTotalAmount(cart.totalAmount);
      console.log("Cart after adding item:", cart);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, totalAmount, addItemToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
