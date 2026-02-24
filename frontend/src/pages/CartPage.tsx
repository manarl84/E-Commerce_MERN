import { useState } from "react";
import { Box, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Container from "@mui/material/Container";
import { useCart } from "../context/Cart/CartContext";


const CartPage = () => {

    const {cartItems, totalAmount, UpdateItemInCart,deleteItemInCart, err} = useCart();
    const [error, setError] = useState("");

    const handleQuantityMinus = (productId: string, quantity: number) => {
        if (quantity <= 1) {
          return;
        }
        UpdateItemInCart(productId, quantity - 1);
        setError(err);
    }
    const handleQuantityPlus = (productId: string, quantity: number) => {
        UpdateItemInCart(productId, quantity + 1);
        setError(err);
    }

    const HandleRemoveItem = (productId: string) => {
        deleteItemInCart(productId);
        setError(err);
    }


    return (
      <Container fixed sx={{ mt: 2 }}>
        <Typography variant="h4">My Cart</Typography>
        {cartItems.map((item) => (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
            key={item.productId}
            sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <Box display="flex" flexDirection="row" gap={2} alignItems="center">
              <img
                src={item.image}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <Box>
                <Typography variant="h6"> {item.title} </Typography>
                <Typography>
                  {" "}
                  {item.quantity} x ${item.unitPrice}{" "}
                </Typography>
                <Button onClick={() => HandleRemoveItem(item.productId)} size="small">Remove Item</Button>
              </Box>
            </Box>
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button onClick={() => handleQuantityMinus(item.productId, item.quantity)} >-</Button>
              <Button onClick={() => handleQuantityPlus(item.productId, item.quantity)} >+</Button>
            </ButtonGroup>
          </Box>
        ))}
        <Box sx={{ mt: 2 }}><Typography variant="h4">Total: ${totalAmount.toFixed(2)}</Typography></Box>
        <Typography color="error">{error}</Typography>
      </Container>
    );
};
export default CartPage;

