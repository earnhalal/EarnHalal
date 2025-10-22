import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from './icons';

interface PaymentViewProps {
    onSubmit: () => void;
}

const PaymentView: React.FC<PaymentViewProps> = ({ onSubmit }) => {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (timeLeft === 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">One-Time Joining Fee</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    To ensure a community of serious users, we require a one-time joining fee of <span className="font-bold text-primary-500">50 Rs</span>.
                </p>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg mb-6">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">Payment Details</h3>
                    <p className="text-gray-600 dark:text-gray-300">Account Title: <span className="font-mono">Earn Halal Inc.</span></p>
                    <p className="text-gray-600 dark:text-gray-300">Account Number: <span className="font-mono">0123-45678901</span></p>
                    <p className="text-gray-600 dark:text-gray-300">Bank: <span className="font-mono">JazzCash / EasyPaisa</span></p>
                </div>

                <div className="mb-6">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">Time Remaining:</p>
                    <p className={`text-4xl font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-primary-500'}`}>
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </p>
                </div>
                
                <div className="mb-6">
                    <label htmlFor="payment-proof" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Upload Payment Proof (Screenshot)
                    </label>
                    <input 
                        id="payment-proof"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                     {file && <p className="text-xs text-green-500 mt-2">File selected: {file.name}</p>}
                </div>

                <button
                    onClick={onSubmit}
                    disabled={!file}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed group"
                >
                    <span className="group-hover:scale-110 transition-transform">I Have Paid</span>
                    <CheckCircleIcon className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default PaymentView;
