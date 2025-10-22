
import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { CheckCircleIcon } from './icons';

interface AuthViewProps {
    onSignup: (profileData: Omit<UserProfile, 'paymentStatus' | 'jobSubscription'>) => void;
    onLogin: (profile: UserProfile) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onSignup, onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!username || !email || !phone || !password) {
            setError('All fields are required for signup.');
            return;
        }
        setError('');
        onSignup({ username, email, phone });
    };
    
    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const storedProfile = localStorage.getItem('userProfile');
            if (storedProfile) {
                const profile: UserProfile = JSON.parse(storedProfile);
                if (profile.username.toLowerCase() === username.toLowerCase()) {
                    onLogin(profile);
                    return;
                }
            }
            setError('User not found. Please sign up.');
        } catch {
             setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
                <div className="p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
                        {isLogin ? 'Welcome Back!' : 'Create Your Account'}
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
                        {isLogin ? 'Login to continue your journey.' : 'Join us to start earning.'}
                    </p>
                    <form onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit} className="space-y-6">
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                        </div>

                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" required />
                        </div>

                        <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700">
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => {setIsLogin(!isLogin); setError('')}} className="font-medium text-primary-600 dark:text-primary-400 hover:underline ml-1">
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
                <div className="hidden md:flex flex-col justify-center bg-primary-50 dark:bg-gray-800/50 p-8 md:p-12">
                     <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">How Earn Halal Works</h3>
                     <ul className="space-y-5">
                        <li className="flex items-start">
                            <CheckCircleIcon className="w-6 h-6 text-primary-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-200">1. Create an Account</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Sign up in seconds and complete a simple one-time verification.</p>
                            </div>
                        </li>
                         <li className="flex items-start">
                            <CheckCircleIcon className="w-6 h-6 text-primary-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-200">2. Complete Simple Tasks</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Browse a variety of tasks like visiting websites or liking pages.</p>
                            </div>
                        </li>
                         <li className="flex items-start">
                            <CheckCircleIcon className="w-6 h-6 text-primary-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-200">3. Earn Real Rewards</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Get paid instantly to your wallet for every task you complete.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <CheckCircleIcon className="w-6 h-6 text-primary-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-200">4. Withdraw Your Earnings</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Easily withdraw your money through JazzCash, EasyPaisa, or Bank Transfer.</p>
                            </div>
                        </li>
                     </ul>
                </div>
            </div>
        </div>
    );
};

export default AuthView;
