// components/DepositView.tsx
import React, { useState } from 'react';

interface DepositViewProps {
  onDeposit: (amount: number, transactionId: string) => void;
}

const DepositView: React.FC<DepositViewProps> = ({ onDeposit }) => {
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !transactionId || !file) {
        setMessage('Please fill all fields and upload a proof of payment.');
        return;
    }
    onDeposit(numAmount, transactionId);
    setMessage(`Deposit request for ${numAmount.toFixed(2)} Rs has been submitted successfully.`);
    setAmount('');
    setTransactionId('');
    setFile(null);
    // This is to clear the file input visually
    const fileInput = document.getElementById('payment-proof') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Deposit Instructions</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          To add funds to your wallet, please transfer the desired amount to the account details below. Then, submit the form with your transaction details.
        </p>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-2">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Our Account Details</h3>
          <p className="text-gray-600 dark:text-gray-300"><strong>Account Title:</strong> <span className="font-mono">Earn Halal Inc.</span></p>
          <p className="text-gray-600 dark:text-gray-300"><strong>Account Number:</strong> <span className="font-mono">0123-45678901</span></p>
          <p className="text-gray-600 dark:text-gray-300"><strong>Bank / Service:</strong> <span className="font-mono">JazzCash / EasyPaisa</span></p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Submit Your Deposit</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (Rs)</label>
            <input 
              type="number" 
              id="amount" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" 
              placeholder="e.g., 1000" 
              required
            />
          </div>
          <div>
            <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID</label>
            <input 
              type="text" 
              id="transactionId" 
              value={transactionId} 
              onChange={e => setTransactionId(e.target.value)} 
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" 
              placeholder="Your payment transaction ID" 
              required
            />
          </div>
          <div>
            <label htmlFor="payment-proof" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Proof (Screenshot)
            </label>
            <input 
              id="payment-proof"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              required
            />
            {file && <p className="text-xs text-green-500 mt-2">File selected: {file.name}</p>}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Submit Deposit Request
          </button>
          {message && <p className={`mt-4 text-center text-sm ${message.includes('Please') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default DepositView;