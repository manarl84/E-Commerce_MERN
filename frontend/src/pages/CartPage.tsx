import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { use, useEffect, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";

const CartPage = () => {

    const {token} = useAuth();
    const [cart, setCart] = useState()
    const [error, setError] = useState('');

    useEffect(() => {

        if (!token) {
            setError("User is not authenticated.");
            console.log("User is not authenticated.");
            return;
        }

        const fetchCart = async () => {
            const response = await fetch(`${BASE_URL}/cart`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                setError("Failed to fetch user cart, please try again later.");
                return;
            }

            const data = await response.json();
            setCart(data);
            console.log(data);
        }

        fetchCart();
    }, [token]);


    return (
        <Container sx={{ mt: 2 }}>

            <Typography variant="h4">My Cart</Typography>

        </Container>
    );
};
export default CartPage;

