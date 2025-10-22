
import React from 'react';
import type { UserProfile, Job, JobSubscriptionPlan } from '../types';
import { CheckCircleIcon } from './icons';

interface JobsViewProps {
    userProfile: UserProfile | null;
    balance: number;
    jobs: Job[];
    onSubscribe: (plan: JobSubscriptionPlan, cost: number) => void;
}

const plans = [
    { name: 'Starter' as JobSubscriptionPlan, price: 500, duration: 30, features: ['Access to basic jobs', '5 applications per day'], color: 'gray' },
    { name: 'Growth' as JobSubscriptionPlan, price: 1000, duration: 30, features: ['Access to all jobs', '15 applications per day', 'Email support'], color: 'primary' },
    { name: 'Business' as JobSubscriptionPlan, price: 2500, duration: 60, features: ['Access to all jobs', 'Unlimited applications', 'Priority support'], color: 'green' },
    { name: 'Enterprise' as JobSubscriptionPlan, price: 5000, duration: 90, features: ['All Business features', 'Dedicated Account Manager'], color: 'indigo' },
];

const JobsView: React.FC<JobsViewProps> = ({ userProfile, balance, jobs, onSubscribe }) => {
    
    if (!userProfile?.jobSubscription) {
        return (
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Unlock Your Earning Potential</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                    Subscribe to a plan to access high-paying, exclusive jobs. Choose the plan that best fits your ambitions. Your current balance is <span className="font-bold text-primary-500">{balance.toFixed(2)} Rs</span>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map(plan => (
                        <div key={plan.name} className={`border-2 border-${plan.color}-500 rounded-xl shadow-lg p-6 flex flex-col`}>
                            <h3 className={`text-2xl font-bold text-${plan.color}-500`}>{plan.name}</h3>
                            <p className="text-4xl font-extrabold my-4 text-gray-800 dark:text-gray-100">{plan.price} <span className="text-lg font-medium">Rs</span></p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">For {plan.duration} days</p>
                            <ul className="space-y-3 text-left text-gray-600 dark:text-gray-300 flex-grow">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-center">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => onSubscribe(plan.name, plan.price)}
                                disabled={balance < plan.price}
                                className={`mt-8 w-full bg-${plan.color}-500 text-white py-3 rounded-lg font-semibold hover:bg-${plan.color}-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed`}
                            >
                                {balance < plan.price ? 'Insufficient Balance' : 'Choose Plan'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    const { plan, expiryDate } = userProfile.jobSubscription;

    return (
        <div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Available Jobs</h2>
                    <p className="text-gray-600 dark:text-gray-300">Your subscription is active. Apply for jobs below.</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-primary-600 dark:text-primary-400 text-lg">{plan} Plan</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Expires on: {expiryDate}</p>
                </div>
            </div>

            <div className="space-y-6">
                {jobs.filter(job => !job.isPremium || (job.isPremium && plan !== 'Starter')).map(job => (
                    <div key={job.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{job.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <span>{job.type}</span>
                                    {job.isPremium && <span className="text-yellow-500 font-semibold">Premium</span>}
                                </div>
                            </div>
                             <div className="text-lg font-bold text-green-500">{job.salary}</div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 my-4">{job.description}</p>
                        <button onClick={() => alert(`You have applied for the ${job.title} position.`)} className="bg-primary-500 text-white py-2 px-6 rounded-md hover:bg-primary-600 transition-colors">
                            Apply Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobsView;
