import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/auth';

const register = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

const login = (userData) => {
    return axios.post(`${API_URL}/login`, userData);
};

// Verify email with token
const verifyEmail = (token) => {
    return axios.get(`${API_URL}/verify-email/${token}`);
};

// Resend verification email
const resendVerification = (email) => {
    return axios.post(`${API_URL}/resend-verification`, { email });
};

const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

// FIXED: Handle case when no user in localStorage
const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
};

// Check if user is authenticated
const isAuthenticated = () => {
    const user = getCurrentUser();
    return !!user?.token;
};

// Get auth token for requests
const getAuthToken = () => {
    const user = getCurrentUser();
    return user?.token || null;
};

// NEW: Check if email is verified
const isEmailVerified = () => {
    const user = getCurrentUser();
    return user?.user?.isVerified === true;
};

// NEW: Store user data after login
const setUserData = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
        localStorage.setItem('token', userData.token);
    }
};

export default {
    register,
    login,
    verifyEmail,
    resendVerification,
    logout,
    getCurrentUser,
    isAuthenticated,
    getAuthToken,
    isEmailVerified,    // Add this
    setUserData,        // Add this
};