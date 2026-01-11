import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";


const AuthProvider: FC<PropsWithChildren> = ({children}) => {

    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

    // useEffect(() => {
    //     const storedToken = localStorage.getItem('authToken');
    //     const storedUsername = localStorage.getItem('username');
    //     setToken(storedToken);
    //     setUsername(storedUsername);
    // }, []);

    const login = (username: string, token: string) => {
        setUsername(username);
        setToken(token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username);
    }
    

    const isAuthenticated = !!token;

    return (
        
        <AuthContext.Provider value={{username, token, login, isAuthenticated}}>

            {children}

        </AuthContext.Provider>
    
    )

}

export default AuthProvider;