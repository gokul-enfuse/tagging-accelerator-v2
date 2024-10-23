import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const savedAuth = sessionStorage.getItem('auth');
        return savedAuth ? JSON.parse(savedAuth) : {};
    });

    useEffect(() => {
    if (auth && Object.keys(auth).length > 0) {
        sessionStorage.setItem('auth', JSON.stringify(auth));
    } else {
        sessionStorage.removeItem('auth');
    }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;