import React, { useState, useEffect } from 'react';

interface LandingViewProps {
  onGetStarted: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onGetStarted }) => {
  const [userCount, setUserCount] = useState(11500);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prevCount => prevCount + Math.floor(Math.random() * 3) + 1);
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white leading-tight">
            Welcome to <span className="text-primary-500">Earn Halal</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300">
            The most trusted platform to earn rewards by completing simple online tasks. Join our growing community and start earning today, the Halal way.
          </p>
          <button
            onClick={onGetStarted}
            className="mt-8 px-8 py-4 bg-primary-600 text-white font-bold rounded-full hover:bg-primary-700 transition-transform transform hover:scale-105 shadow-lg text-lg"
          >
            Get Started Now
          </button>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
            <div className="text-center">
              <p className="text-5xl font-bold text-primary-500">
                {userCount.toLocaleString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">Happy Users Joined</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-primary-500">100%</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">Verified Tasks</p>
            </div>
             <div className="text-center">
              <p className="text-5xl font-bold text-primary-500">24/7</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">Support</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Our Trusted Partners</h2>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <span className="text-gray-400 dark:text-gray-500 text-2xl font-semibold">PARTNER A</span>
            <span className="text-gray-400 dark:text-gray-500 text-2xl font-semibold">PARTNER B</span>
            <span className="text-gray-400 dark:text-gray-500 text-2xl font-semibold">PARTNER C</span>
            <span className="text-gray-400 dark:text-gray-500 text-2xl font-semibold">PARTNER D</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
