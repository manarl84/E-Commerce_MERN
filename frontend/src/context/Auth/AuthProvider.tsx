import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";

const USERNAME_KEY = 'username'; //magic strings
const TOKEN_KEY = 'authToken';  //magic strings

const AuthProvider: FC<PropsWithChildren> = ({children}) => {

    const [username, setUsername] = useState<string | null>(localStorage.getItem(USERNAME_KEY));
    const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
    const isAuthenticated = !!token;

    // useEffect(() => {
    //     const storedToken = localStorage.getItem('authToken');
    //     const storedUsername = localStorage.getItem('username');
    //     setToken(storedToken);
    //     setUsername(storedUsername);
    // }, []);

    const login = (username: string, token: string) => {
        setUsername(username);
        setToken(token);
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USERNAME_KEY, username);
    }
    
    const logout = () => {
        setUsername(null); // clear username on logout if not cleared then after logout username will still be visible in navbar
        setToken(null); // clear token on logout if not cleared then user will remain logged in
        localStorage.removeItem(TOKEN_KEY); 
        localStorage.removeItem(USERNAME_KEY); 
    }



    return (
        
        <AuthContext.Provider value={{username, token, isAuthenticated, login, logout}}>

            {children}

        </AuthContext.Provider>
    
    )

}

export default AuthProvider;