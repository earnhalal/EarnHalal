// components/WalletView.tsx
import React, { useState, useEffect } from 'react';
import type { Transaction, WithdrawalDetails } from '../types';
import { TransactionType } from '../types';

interface WalletViewProps {
  balance: number;
  transactions: Transaction[];
  username: string;
  onWithdraw: (amount: number, details: WithdrawalDetails) => void;
  savedDetails: WithdrawalDetails | null;
  hasPin: boolean;
  onSetupPin: () => void;
}

type Method = 'JazzCash' | 'EasyPaisa' | 'Bank Transfer';

const WalletView: React.FC<WalletViewProps> = ({ balance, transactions, username, onWithdraw, savedDetails, hasPin, onSetupPin }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<Method>('JazzCash');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
      if (savedDetails) {
          setMethod(savedDetails.method);
          setAccountName(savedDetails.accountName);
          setAccountNumber(savedDetails.accountNumber);
          setBankName(savedDetails.bankName || '');
      }
  }, [savedDetails]);

  const handleWithdraw = () => {
    setMessage('');
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }
    if (numAmount > balance) {
      setMessage('Insufficient balance.');
      return;
    }
    if (!accountName || !accountNumber) {
        setMessage('Account name and number are required.');
        return;
    }
     if (method === 'Bank Transfer' && !bankName) {
        setMessage('Bank name is required for bank transfers.');
        return;
    }

    const details: WithdrawalDetails = {
      method,
      accountName,
      accountNumber,
      ...(method === 'Bank Transfer' && { bankName }),
    };

    onWithdraw(numAmount, details);
    setMessage(`Withdrawal request for ${numAmount.toFixed(2)} Rs via ${method} submitted.`);
    setAmount('');
  };
  
  const getTransactionColor = (type: TransactionType) => {
    switch(type) {
        case TransactionType.EARNING:
        case TransactionType.REFERRAL:
        case TransactionType.DEPOSIT:
            return 'text-green-500';
        case TransactionType.WITHDRAWAL:
        case TransactionType.TASK_CREATION:
        case TransactionType.JOINING_FEE:
        case TransactionType.JOB_SUBSCRIPTION:
        case TransactionType.SPIN_PURCHASE:
            return 'text-red-500';
        case TransactionType.PENDING_DEPOSIT:
            return 'text-yellow-500';
        default:
            return 'text-gray-500';
    }
  }
  
  const handleDownloadReceipt = (tx: Transaction) => {
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow && tx.withdrawalDetails) {
        const receiptHTML = `
            <html>
            <head>
                <title>Withdrawal Receipt - ${tx.id}</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    body { font-family: sans-serif; }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body class="bg-gray-100 p-10">
                <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <div class="flex justify-between items-center border-b pb-4 mb-6">
                        <div>
                            <h1 class="text-2xl font-bold">Earn Halal</h1>
                            <p class="text-gray-500">Payment Receipt</p>
                        </div>
                        <div class="text-right">
                             <p class="text-sm">Transaction ID</p>
                             <p class="font-mono text-gray-800">${tx.id}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <h3 class="text-sm text-gray-500 uppercase">Billed To</h3>
                            <p class="font-semibold text-gray-800">${username}</p>
                        </div>
                        <div class="text-right">
                             <h3 class="text-sm text-gray-500 uppercase">Payment Date</h3>
                             <p class="font-semibold text-gray-800">${new Date(tx.date).toLocaleString()}</p>
                        </div>
                    </div>
                    <table class="w-full mb-8">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="text-left p-3 font-semibold text-gray-600">Description</th>
                                <th class="text-right p-3 font-semibold text-gray-600">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b">
                                <td class="p-3 text-gray-800">Withdrawal via ${tx.withdrawalDetails.method}</td>
                                <td class="p-3 text-right font-mono text-gray-800">${Math.abs(tx.amount).toFixed(2)} Rs</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td class="text-right p-3 font-bold text-gray-800 text-lg" colspan="1">Total Paid</td>
                                <td class="text-right p-3 font-bold text-primary-600 text-lg" colspan="1">${Math.abs(tx.amount).toFixed(2)} Rs</td>
                            </tr>
                        </tfoot>
                    </table>
                     <div class="border-t pt-4">
                        <h3 class="text-sm text-gray-500 uppercase mb-2">Payment Details</h3>
                        <p class="text-gray-700"><strong>Method:</strong> ${tx.withdrawalDetails.method}</p>
                        <p class="text-gray-700"><strong>Account Name:</strong> ${tx.withdrawalDetails.accountName}</p>
                        <p class="text-gray-700"><strong>Account Number:</strong> ${tx.withdrawalDetails.accountNumber}</p>
                        ${tx.withdrawalDetails.bankName ? `<p class="text-gray-700"><strong>Bank Name:</strong> ${tx.withdrawalDetails.bankName}</p>` : ''}
                    </div>
                    <div class="text-center mt-8 text-sm text-gray-500">
                        <p>Thank you for using Earn Halal!</p>
                        <button onclick="window.print()" class="no-print mt-4 bg-primary-500 text-white py-2 px-4 rounded-lg">Print Receipt</button>
                    </div>
                </div>
            </body>
            </html>
        `;
        receiptWindow.document.write(receiptHTML);
        receiptWindow.document.close();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <p className="text-gray-500 dark:text-gray-400">Current Balance</p>
            <p className="text-4xl font-bold text-gray-800 dark:text-gray-100 my-2">{balance.toFixed(2)} Rs</p>
        </div>
        
        {!hasPin && (
            <div className="bg-primary-50 dark:bg-gray-700/50 p-4 rounded-xl shadow-md text-center">
                <h4 className="font-bold text-primary-800 dark:text-primary-200">Enhance Your Security</h4>
                <p className="text-sm text-primary-700 dark:text-primary-300 my-2">Protect your wallet with a 4-digit PIN for withdrawals and access.</p>
                <button onClick={onSetupPin} className="bg-primary-500 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-600">
                    Set Up PIN
                </button>
            </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Request Withdrawal</h3>
            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Method</label>
                    <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-gray-100 dark:bg-gray-900 p-1">
                        {(['JazzCash', 'EasyPaisa', 'Bank Transfer'] as Method[]).map(m => (
                            <button key={m} onClick={() => setMethod(m)} className={`px-2 py-2 text-sm font-semibold rounded-md transition-colors ${method === m ? 'bg-primary-500 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'}`}>
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (Rs)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., 500" />
                </div>
                <div>
                    <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Holder Name</label>
                    <input type="text" id="accountName" value={accountName} onChange={e => setAccountName(e.target.value)} className="mt-1 block w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., John Doe" />
                </div>
                <div>
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Number</label>
                    <input type="text" id="accountNumber" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="mt-1 block w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., 03001234567" />
                </div>
                {method === 'Bank Transfer' && (
                    <div>
                        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Name</label>
                        <input type="text" id="bankName" value={bankName} onChange={e => setBankName(e.target.value)} className="mt-1 block w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., HBL" />
                    </div>
                )}
                <button onClick={handleWithdraw} className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700">
                    Submit Request
                </button>
                {message && <p className={`text-sm text-center mt-2 ${message.includes('submitted') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
            </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Transaction History</h3>
        <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
            {transactions.length > 0 ? (
                [...transactions].reverse().map(tx => (
                    <div key={tx.id} className="p-2 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-700 dark:text-gray-200">{tx.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleString()}</p>
                            </div>
                            <p className={`font-bold whitespace-nowrap ${getTransactionColor(tx.type)}`}>
                               {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} Rs
                            </p>
                        </div>
                         {tx.type === TransactionType.WITHDRAWAL && tx.withdrawalDetails && (
                            <div className="text-right mt-1">
                                <button onClick={() => handleDownloadReceipt(tx)} className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                                    Download Receipt
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No transactions yet.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default WalletView;