import { Box, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { use, useEffect, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";
import { useCart } from "../context/Cart/CartContext";

const CartPage = () => {

    const {token} = useAuth();
    const {cartItems, totalAmount} = useCart();
    const [error, setError] = useState('');


    return (
        <Container sx={{ mt: 2 }}>

            <Typography variant="h4">My Cart</Typography>
                {cartItems.map((item) => (
                    <Box key={item.productId}>
                     {item.title} - {item.quantity} x ${item.unitPrice}
                    </Box>
                ))}
            <Typography variant="h5">Total: ${totalAmount}</Typography>
            {error && <Typography color="error">{error}</Typography>}
        </Container>
    );
};
export default CartPage;

