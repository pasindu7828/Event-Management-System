import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const UserDashboard = () => {
    const navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser();

    const handleLogout = () => {
        AuthService.logout();
        navigate('/');
        window.location.reload();
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-700">You are not logged in.</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 shadow-lg px-6 py-2.5 rounded-full font-bold transition-all duration-300"
                    >
                        Logout
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="text-lg font-semibold text-gray-700">First Name:</p>
                        <p className="text-lg text-gray-900">{currentUser.user.firstName}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-700">Last Name:</p>
                        <p className="text-lg text-gray-900">{currentUser.user.lastName}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-700">Email:</p>
                        <p className="text-lg text-gray-900">{currentUser.user.email}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-700">Role:</p>
                        <p className="text-lg text-gray-900">{currentUser.user.role}</p>
                    </div>
                    {currentUser.user.studentId && (
                        <div>
                            <p className="text-lg font-semibold text-gray-700">Student ID:</p>
                            <p className="text-lg text-gray-900">{currentUser.user.studentId}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
