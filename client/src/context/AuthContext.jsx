import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    if (isMounted) setUser(res.data);
                } catch (error) {
                    console.error("AuthContext: Token verification failed:", error.message);
                    localStorage.removeItem('token');
                }
            }
            if (isMounted) setLoading(false);
        };
        initAuth();
        return () => { isMounted = false; };
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            return { success: true, role: res.data.role };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const res = await api.post('/auth/register', { name, email, password, role });
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            return { success: true, role: res.data.role };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
