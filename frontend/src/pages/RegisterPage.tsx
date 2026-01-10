import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";


const RegisterPage = () => {

    const [error, setError] = useState<string>("");

    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)    

    const onSubmit = async () => {
        const firstName = firstNameRef.current?.value;
        const lastName = lastNameRef.current?.value;        
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        console.log("Registering user with details:", { firstName, lastName, email, password });

        // make the call to the backend API to register the user
        const response = await fetch(`${BASE_URL}/user/register`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,  
                lastName,
                email,
                password 
            
        })
    
    });

    if (!response.ok) {
      setError(JSON.stringify(await response.json()));
      return
    }
    const data = await response.json();
    
    console.log("Registration response data:", data);

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
        <Typography variant="h6" color="grey">Register New Account</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", //horizontally align
            alignItems: "center", //vertically align
            gap: 2,
            mt: 2,
            border: 1,
            p: 2,
            borderColor: "#f5f5f5",
            borderRadius: 2,
          }}
        >
          <TextField inputRef={firstNameRef} label="First Name" name="firstName" />
          <TextField inputRef={lastNameRef} label="Last Name" name="lastName" />
          <TextField inputRef={emailRef}  label="Email" name="email" />
          <TextField inputRef={passwordRef} type="password" label="Password" name="password" />
          <Button onClick={onSubmit} variant="contained">Register</Button>
          <div>{error && <Typography color="error">{error}</Typography>}</div>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;