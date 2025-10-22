import React from 'react';
import type { View } from '../types';

interface FooterProps {
    setActiveView: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ setActiveView }) => {
    return (
        <footer className="bg-white dark:bg-gray-800 p-6 mt-auto text-center text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
            <p>&copy; {new Date().getFullYear()} Earn Halal. All Rights Reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
                <button onClick={() => setActiveView('TERMS_CONDITIONS')} className="hover:text-primary-500">Terms of Service</button>
                <span>&bull;</span>
                <button onClick={() => setActiveView('PRIVACY_POLICY')} className="hover:text-primary-500">Privacy Policy</button>
            </div>
        </footer>
    );
};

export default Footer;