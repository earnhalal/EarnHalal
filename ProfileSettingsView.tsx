
import React from 'react';

const ProfileSettingsView = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Profile Settings</h2>
            <form className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input type="text" id="name" defaultValue="Test User" className="mt-1 block w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input type="email" id="email" defaultValue="user@example.com" className="mt-1 block w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                    <input type="password" id="password" placeholder="Leave blank to keep current password" className="mt-1 block w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default ProfileSettingsView;
