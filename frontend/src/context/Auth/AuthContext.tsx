import { createContext, useContext } from "react";


interface AuthContextType {
    username: string | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (username: string, token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({username: null, token: null, login: () => {}, logout: () => {}, isAuthenticated: false});

export const useAuth = () => useContext(AuthContext); // custom hook to use the auth context