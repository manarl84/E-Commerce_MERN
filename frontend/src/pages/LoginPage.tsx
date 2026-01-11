import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router";




const LoginPage = () => {

    const [error, setError] = useState<string>("");

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)   

    const navigate = useNavigate();
    
    const {login} = useAuth();

    const onSubmit = async () => {
      
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        // simple validation for empty fields using negative check
        if (!email || !password) {
            setError("Please fill all the fields");
            return;
        }

        console.log("Registering user with details:", { email, password });

        // make the call to the backend API to register the user
        const response = await fetch(`${BASE_URL}/user/login`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                email,
                password 
            
        })
    
    });

    if (!response.ok) {
      setError(JSON.stringify(await response.json()));
      return
    }
    const token = await response.json();

    if (!token) {
      setError("Incorrect Token");
      return;
    }
    
    login(email!, token); // update the auth context with the logged in user info
    navigate("/"); // redirect to home page after successful login

    console.log("User Token:", token);

  }

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h6" color="grey">Login to Your Account</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", //horizontal align
            alignItems: "center", //vertically align
            gap: 2,
            mt: 2,
            border: 1,
            p: 2,
            borderColor: "#f5f5f5",
            borderRadius: 2,
          }}
        >
          <TextField inputRef={emailRef}  label="Email" name="email" />
          <TextField inputRef={passwordRef} type="password" label="Password" name="password" />
          <Button onClick={onSubmit} variant="contained">Login</Button>
          <div>{error && <Typography color="error">{error}</Typography>}</div>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;