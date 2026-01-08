import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

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
        // Check if user is logged in on mount
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const data = await authService.signup(userData);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const loginAsStudent = async (credentials) => {
        try {
            const data = await authService.studentLogin(credentials);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const signupAsStudent = async (userData) => {
        try {
            const data = await authService.studentSignup(userData);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const loginAsOrganizer = async (credentials) => {
        try {
            const data = await authService.organizerLogin(credentials);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const signupAsOrganizer = async (userData) => {
        try {
            const data = await authService.organizerSignup(userData);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        signup,
        loginAsStudent,
        signupAsStudent,
        loginAsOrganizer,
        signupAsOrganizer,
        logout,
        loading,
        isAuthenticated: !!user,
        isOrganizer: user?.role === 'organizer',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
