import React from 'react';

const PendingVerificationView: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-center">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary-500 mx-auto mb-6"></div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Verification in Progress</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Thank you for your payment. Your account is currently being verified by our team. This usually takes just a few moments.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                    You will be redirected automatically once verification is complete.
                </p>
            </div>
        </div>
    );
};

export default PendingVerificationView;
