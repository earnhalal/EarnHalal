import React from 'react';
import { EarnIcon, WalletIcon, CreateTaskIcon, BriefcaseIcon, InfoIcon } from './icons';
import type { View, Transaction } from '../types';
import { TransactionType } from '../types';

interface DashboardViewProps {
  balance: number;
  tasksCompleted: number;
  referrals: number;
  setActiveView: (view: View) => void;
  transactions: Transaction[];
  onSimulateNewTask: () => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center space-x-4">
    <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

const ActionButton: React.FC<{ title: string; icon: React.ReactNode; onClick: () => void }> = ({ title, icon, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center p-6 bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 w-full text-center">
    {icon}
    <span className="mt-2 font-semibold">{title}</span>
  </button>
);


const DashboardView: React.FC<DashboardViewProps> = ({ balance, tasksCompleted, referrals, setActiveView, transactions, onSimulateNewTask }) => {
  const recentEarnings = transactions
    .filter(tx => tx.type === TransactionType.EARNING)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Current Balance" value={`${balance.toFixed(2)} Rs`} icon={<WalletIcon className="w-8 h-8 text-primary-600" />} />
        <StatCard title="Tasks Completed" value={tasksCompleted} icon={<EarnIcon className="w-8 h-8 text-primary-600" />} />
        <StatCard title="Total Referrals" value={referrals} icon={<CreateTaskIcon className="w-8 h-8 text-primary-600" />} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
           <ActionButton title="Start Earning" icon={<EarnIcon className="w-10 h-10" />} onClick={() => setActiveView('EARN')} />
           <ActionButton title="Go to Wallet" icon={<WalletIcon className="w-10 h-10" />} onClick={() => setActiveView('WALLET')} />
           <ActionButton title="Create a Task" icon={<CreateTaskIcon className="w-10 h-10" />} onClick={() => setActiveView('CREATE_TASK')} />
           <ActionButton title="Apply for Jobs" icon={<BriefcaseIcon className="w-10 h-10" />} onClick={() => setActiveView('JOBS')} />
           <ActionButton title="Test Notification" icon={<InfoIcon className="w-10 h-10" />} onClick={onSimulateNewTask} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Welcome to Earn Halal!</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your trusted platform for earning rewards through simple tasks. Complete tasks, invite friends, or create your own campaigns to boost your online presence. All earnings are processed transparently and in accordance with Halal principles.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Recently Completed Tasks</h2>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {recentEarnings.length > 0 ? (
                    recentEarnings.map(tx => (
                        <div key={tx.id} className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">{tx.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                            <p className="font-bold text-green-500 text-sm whitespace-nowrap">
                                +{tx.amount.toFixed(2)} Rs
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent task earnings.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;