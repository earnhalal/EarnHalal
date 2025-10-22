import React, { useState } from 'react';
import { InviteIcon } from './icons';

interface InviteViewProps {
  referrals: {
    level1: number;
    level2: number;
  };
  referralEarnings: number;
  onSimulateReferral: (level: 1 | 2) => void;
}

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="bg-primary-50 dark:bg-gray-700/50 p-6 rounded-lg text-center">
    <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">{value}</p>
    <p className="text-gray-600 dark:text-gray-300 mt-1">{title}</p>
  </div>
);

const InviteView: React.FC<InviteViewProps> = ({ referrals, referralEarnings, onSimulateReferral }) => {
  const referralLink = "https://earnhalal.com/ref/user123";
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
        <InviteIcon className="w-16 h-16 mx-auto text-primary-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Invite Friends & Build Your Team!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Share your unique referral link. You'll earn from friends who join and from the friends they invite!
        </p>

        <div className="mb-8">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Unique Referral Link</label>
          <div className="mt-2 flex rounded-md shadow-sm max-w-lg mx-auto">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 p-3"
            />
            <button
              onClick={copyToClipboard}
              className={`inline-flex items-center justify-center w-24 px-4 py-2 border border-l-0 border-primary-500 rounded-r-md text-white transition-colors ${
                  isCopied ? 'bg-green-500' : 'bg-primary-500 hover:bg-primary-600'
              }`}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Direct Referrals (Lvl 1)" value={referrals.level1} />
          <StatCard title="Indirect Referrals (Lvl 2)" value={referrals.level2} />
          <StatCard title="Total Referral Earnings" value={`${referralEarnings.toFixed(2)} Rs`} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">How It Works</h3>
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-primary-50 dark:bg-gray-700/50 rounded-lg">
            <div className="bg-primary-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
            <div>
              <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">Level 1 Bonus: 20 Rs</h4>
              <p className="text-gray-600 dark:text-gray-300">When someone signs up using your link and pays their joining fee, you instantly receive a <strong>20 Rs</strong> bonus.</p>
            </div>
          </div>
           <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-gray-700/50 rounded-lg">
            <div className="bg-amber-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
            <div>
              <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">Level 2 Bonus: 5 Rs</h4>
              <p className="text-gray-600 dark:text-gray-300">When someone invited by your friend (your Level 1 referral) joins and pays their fee, you receive a <strong>5 Rs</strong> bonus. Your network earns for you!</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* This is a simulation section for demonstration purposes */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border-t-4 border-dashed border-primary-300">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Demonstration Area</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Click these buttons to simulate new referrals joining and paying their fee.</p>
        <div className="flex gap-4">
          <button onClick={() => onSimulateReferral(1)} className="flex-1 bg-primary-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600">
            Simulate Level 1 Signup (20 Rs)
          </button>
          <button onClick={() => onSimulateReferral(2)} className="flex-1 bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-600">
            Simulate Level 2 Signup (5 Rs)
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteView;
