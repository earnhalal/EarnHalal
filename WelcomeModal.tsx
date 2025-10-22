import React from 'react';

interface WelcomeModalProps {
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to Earn Halal!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">You're all set up. Start completing tasks to earn rewards.</p>
                <button onClick={onClose} className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold">
                    Let's Go!
                </button>
            </div>
        </div>
    );
};

export default WelcomeModal;
