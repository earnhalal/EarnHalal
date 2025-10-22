
import { app } from './services/firebase';
// App.tsx

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import EarnView from './components/EarnView';
import WalletView from './components/WalletView';
import CreateTaskView from './components/CreateTaskView';
import TaskHistoryView from './components/TaskHistoryView';
import InviteView from './components/InviteView';
import ProfileSettingsView from './components/ProfileSettingsView';
import { HowItWorksView, AboutUsView, ContactUsView, PrivacyPolicyView, TermsAndConditionsView } from './components/InfoViews';
import JobsView from './components/JobsView';
import Footer from './components/Footer';
import AuthView from './components/AuthView';
import PaymentView from './components/PaymentView';
import PendingVerificationView from './components/PendingVerificationView';
import LandingView from './components/LandingView';
import NotificationBanner from './components/NotificationBanner';
import DepositView from './components/DepositView';
import SpinWheelView from './components/SpinWheelView';
import PinLockView from './components/PinLockView';


import type { View, UserProfile, Transaction, Task, UserCreatedTask, Job, JobSubscriptionPlan, WithdrawalDetails } from './types';
import { TransactionType, TaskType } from './types';


const App: React.FC = () => {
    // App state
    const [view, setView] = useState<View>('DASHBOARD');
    const [viewHistory, setViewHistory] = useState<View[]>(['DASHBOARD']);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showLanding, setShowLanding] = useState(true);

    // User & Data State
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [userTasks, setUserTasks] = useState<UserCreatedTask[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [referrals, setReferrals] = useState<{ level1: number; level2: number; }>({level1: 0, level2: 0});
    const [savedWithdrawalDetails, setSavedWithdrawalDetails] = useState<WithdrawalDetails | null>(null);

    // Security State
    const [walletPin, setWalletPin] = useState<string | null>(null); // 'null': not set, 'SKIPPED': skipped, '1234': pin is set
    const [isWalletLocked, setIsWalletLocked] = useState(true);
    const [showPinModal, setShowPinModal] = useState<'enter' | 'set' | false>(false);


    // Notification State
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
    const [showNotificationBanner, setShowNotificationBanner] = useState(Notification.permission === 'default');

    // --- MOCK DATA ---
    useEffect(() => {
        setTasks([
            { id: 'task1', type: TaskType.VISIT_WEBSITE, title: 'Visit TechCrunch Homepage', description: 'Spend 30 seconds on the homepage.', url: 'https://techcrunch.com', reward: 5.50 },
            { id: 'task2', type: TaskType.YOUTUBE_SUBSCRIBE, title: 'Subscribe to MKBHD', description: 'Subscribe to the YouTube channel Marques Brownlee.', url: 'https://youtube.com/mkbhd', reward: 10.00 },
            { id: 'task3', type: TaskType.FACEBOOK_LIKE, title: 'Like our Facebook Page', description: 'Visit our page and hit the like button.', url: 'https://facebook.com', reward: 3.25 },
        ]);
        setJobs([
            { id: 'job1', title: 'Data Entry Clerk', description: 'Enter data from various sources into our database.', type: 'Part-time', salary: '15,000 Rs/month', isPremium: false },
            { id: 'job2', title: 'Virtual Assistant', description: 'Provide administrative, technical, or creative assistance to clients remotely.', type: 'Full-time', salary: '30,000 Rs/month', isPremium: true },
            { id: 'job3', title: 'Social Media Manager', description: 'Manage and grow our social media presence.', type: 'Contract', salary: '25,000 Rs/month', isPremium: true },
        ]);
    }, []);

    // --- LOCAL STORAGE PERSISTENCE ---
    useEffect(() => {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
            const profile: UserProfile = JSON.parse(storedProfile);
            setUserProfile(profile);
            setShowLanding(false); // If there's a profile, don't show landing
            // Reload user data based on profile
            setBalance(parseFloat(localStorage.getItem(`balance_${profile.username}`) || '0'));
            setTransactions(JSON.parse(localStorage.getItem(`transactions_${profile.username}`) || '[]'));
            setUserTasks(JSON.parse(localStorage.getItem(`userTasks_${profile.username}`) || '[]'));
            setReferrals(JSON.parse(localStorage.getItem(`referrals_${profile.username}`) || '{"level1":0, "level2":0}'));
            setWalletPin(localStorage.getItem(`walletPin_${profile.username}`));
            setSavedWithdrawalDetails(JSON.parse(localStorage.getItem(`savedWithdrawalDetails_${profile.username}`) || 'null'));
        }
    }, []);
    
    const saveUserData = (profile: UserProfile, newBalance: number, newTransactions: Transaction[], newUserTasks: UserCreatedTask[], newReferrals: {level1: number, level2: number}, newPin: string | null = walletPin, newDetails: WithdrawalDetails | null = savedWithdrawalDetails) => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
        localStorage.setItem(`balance_${profile.username}`, newBalance.toString());
        localStorage.setItem(`transactions_${profile.username}`, JSON.stringify(newTransactions));
        localStorage.setItem(`userTasks_${profile.username}`, JSON.stringify(newUserTasks));
        localStorage.setItem(`referrals_${profile.username}`, JSON.stringify(newReferrals));
        if (newPin) localStorage.setItem(`walletPin_${profile.username}`, newPin);
        if (newDetails) localStorage.setItem(`savedWithdrawalDetails_${profile.username}`, JSON.stringify(newDetails));
    };

    // --- HANDLERS ---
    const handleSetActiveView = (newView: View) => {
        if (newView === 'WALLET' && walletPin && walletPin !== 'SKIPPED' && isWalletLocked) {
            setShowPinModal('enter');
            return;
        }

        if (newView !== view) {
            setView(newView);
            setViewHistory(prev => [...prev, newView]);
        }
        setIsSidebarOpen(false); // Auto-close sidebar on navigation
    };

    const handleBack = () => {
        if (viewHistory.length > 1) {
            const newHistory = [...viewHistory];
            newHistory.pop();
            const previousView = newHistory[newHistory.length - 1];
            setView(previousView);
            setViewHistory(newHistory);
        }
    };
    
    const addTransaction = (profile: UserProfile, type: TransactionType, description: string, amount: number, customReferrals = referrals, withdrawalDetails?: WithdrawalDetails) => {
        const newTransaction: Transaction = { id: `tx_${Date.now()}`, type, description, amount, date: new Date().toISOString(), withdrawalDetails };
        const newBalance = balance + amount;
        const newTransactions = [...transactions, newTransaction];
        
        setBalance(newBalance);
        setTransactions(newTransactions);

        let newSavedDetails = savedWithdrawalDetails;
        if (type === TransactionType.WITHDRAWAL && withdrawalDetails) {
             setSavedWithdrawalDetails(withdrawalDetails);
             newSavedDetails = withdrawalDetails;
        }

        saveUserData(profile, newBalance, newTransactions, userTasks, customReferrals, walletPin, newSavedDetails);
    };

    const handleLogin = (profile: UserProfile) => {
        setUserProfile(profile);
        setShowLanding(false);
        // Load data for this user
        setBalance(parseFloat(localStorage.getItem(`balance_${profile.username}`) || '0'));
        setTransactions(JSON.parse(localStorage.getItem(`transactions_${profile.username}`) || '[]'));
        setUserTasks(JSON.parse(localStorage.getItem(`userTasks_${profile.username}`) || '[]'));
        setReferrals(JSON.parse(localStorage.getItem(`referrals_${profile.username}`) || '{"level1":0, "level2":0}'));
        setWalletPin(localStorage.getItem(`walletPin_${profile.username}`));
        setSavedWithdrawalDetails(JSON.parse(localStorage.getItem(`savedWithdrawalDetails_${profile.username}`) || 'null'));
        setIsWalletLocked(true); // Always lock wallet on login
        setViewHistory(['DASHBOARD']);
        setView('DASHBOARD');
    };
    
    const handleSignup = (profileData: Omit<UserProfile, 'paymentStatus' | 'jobSubscription'>) => {
        const newUserProfile: UserProfile = { ...profileData, paymentStatus: 'UNPAID', jobSubscription: null };
        setUserProfile(newUserProfile);
        localStorage.setItem('userProfile', JSON.stringify(newUserProfile)); // Save immediately
    };

    const handlePaymentSubmit = () => {
        if (!userProfile) return;
        const updatedProfile = { ...userProfile, paymentStatus: 'PENDING_VERIFICATION' as const };
        setUserProfile(updatedProfile);
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        // Simulate verification
        setTimeout(() => {
            const currentProfileString = localStorage.getItem('userProfile');
            if (currentProfileString) {
                const currentProfile: UserProfile = JSON.parse(currentProfileString);
                if (currentProfile.username === userProfile.username) {
                    const verifiedProfile = { ...updatedProfile, paymentStatus: 'VERIFIED' as const };
                    setUserProfile(verifiedProfile);
                    addTransaction(verifiedProfile, TransactionType.JOINING_FEE, 'One-time joining fee', -50);
                }
            }
        }, 5000);
    };

    const handleCreateTask = (taskData: Omit<Task, 'id'>, quantity: number, totalCost: number) => {
        if (!userProfile) return;
        const newUserTask: UserCreatedTask = {
            id: `utask_${Date.now()}`,
            title: taskData.title,
            type: taskData.type,
            reward: taskData.reward,
            quantity: quantity,
            completions: 0,
            views: 0
        };
        const newUserTasks = [...userTasks, newUserTask];
        setUserTasks(newUserTasks);
        addTransaction(userProfile, TransactionType.TASK_CREATION, `Campaign: ${taskData.title}`, -totalCost);
    };

    const handleCompleteTask = (task: Task) => {
        if (!userProfile) return;
        addTransaction(userProfile, TransactionType.EARNING, `Completed: ${task.title}`, task.reward);
        alert(`Task "${task.title}" completed! You earned ${task.reward.toFixed(2)} Rs.`);
    };
    
    const handleWithdraw = (amount: number, details: WithdrawalDetails) => {
        if (!userProfile) return;
        addTransaction(userProfile, TransactionType.WITHDRAWAL, `Withdrawal via ${details.method}`, -amount, referrals, details);
    };

    const handleSubscribeToJob = (plan: JobSubscriptionPlan, cost: number) => {
        if (!userProfile) return;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // Simple 30 day expiry for all for now
        
        const updatedProfile = { ...userProfile, jobSubscription: { plan, expiryDate: expiryDate.toLocaleDateString() } };
        setUserProfile(updatedProfile);
        addTransaction(updatedProfile, TransactionType.JOB_SUBSCRIPTION, `Subscribed to ${plan} plan`, -cost);
    };
    
    const handleLogout = () => {
        setUserProfile(null);
        setBalance(0);
        setTransactions([]);
        setUserTasks([]);
        setReferrals({level1: 0, level2: 0});
        setWalletPin(null);
        setSavedWithdrawalDetails(null);
        setIsWalletLocked(true);
        setView('DASHBOARD');
        setViewHistory(['DASHBOARD']);
        localStorage.removeItem('userProfile');
        setShowLanding(true);
    };

    const handleRequestPermission = async () => {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        setShowNotificationBanner(false);
    };
    
    const simulateNewTaskNotification = () => {
        if (notificationPermission === 'granted') {
            new Notification('New Task Available!', {
                body: 'A new high-paying task has just been added. Complete it now!',
                icon: '/favicon.ico'
            });
        } else {
            alert('Please enable notifications to get updates.');
        }
    };
    
    const handleDeposit = (amount: number, transactionId: string) => {
        if (!userProfile) return;
        const newTransaction: Transaction = { 
            id: `tx_${Date.now()}`, 
            type: TransactionType.PENDING_DEPOSIT,
            description: `Deposit via TXID: ${transactionId}`, 
            amount, 
            date: new Date().toISOString() 
        };
        const newTransactions = [...transactions, newTransaction];
        setTransactions(newTransactions);
        
        const updatedProfile = { ...userProfile };
        saveUserData(updatedProfile, balance, newTransactions, userTasks, referrals);
        
        alert(`Your deposit request for ${amount.toFixed(2)} Rs has been submitted and is pending verification.`);
    };

    const handleSpinWin = (amount: number) => {
        if (!userProfile) return;
        addTransaction(userProfile, TransactionType.EARNING, 'Spin Wheel Prize', amount);
    };
    
    const handleBuySpin = (cost: number): boolean => {
        if (!userProfile || balance < cost) {
            return false;
        }
        addTransaction(userProfile, TransactionType.SPIN_PURCHASE, `Spin purchase (${cost} Rs)`, -cost);
        return true;
    };

    const handleSimulateReferral = (level: 1 | 2) => {
        if(!userProfile) return;
        if (level === 1) {
            const newReferrals = { ...referrals, level1: referrals.level1 + 1 };
            setReferrals(newReferrals);
            addTransaction(userProfile, TransactionType.REFERRAL, 'Level 1 Referral Bonus', 20, newReferrals);
        } else {
            const newReferrals = { ...referrals, level2: referrals.level2 + 1 };
            setReferrals(newReferrals);
            addTransaction(userProfile, TransactionType.REFERRAL, 'Level 2 Referral Bonus', 5, newReferrals);
        }
    }
    
    const handlePinSet = (newPin: string) => {
        if (!userProfile) return;
        setWalletPin(newPin);
        localStorage.setItem(`walletPin_${userProfile.username}`, newPin);
        setShowPinModal(false);
    };
    
    const handlePinSkip = () => {
        if (!userProfile) return;
        const pinValue = 'SKIPPED';
        setWalletPin(pinValue);
        localStorage.setItem(`walletPin_${userProfile.username}`, pinValue);
        setShowPinModal(false);
    };

    const referralEarnings = useMemo(() => {
        return transactions
            .filter(tx => tx.type === TransactionType.REFERRAL)
            .reduce((sum, tx) => sum + tx.amount, 0);
    }, [transactions]);


    // --- RENDER LOGIC ---
    const renderContent = () => {
        if (!userProfile) return null;
        switch (view) {
            case 'DASHBOARD': return <DashboardView balance={balance} tasksCompleted={transactions.filter(t => t.type === TransactionType.EARNING).length} referrals={referrals.level1} setActiveView={handleSetActiveView} transactions={transactions} onSimulateNewTask={simulateNewTaskNotification} />;
            case 'EARN': return <EarnView tasks={tasks} onCompleteTask={handleCompleteTask} />;
            case 'SPIN_WHEEL': return <SpinWheelView onWin={handleSpinWin} balance={balance} onBuySpin={handleBuySpin} />;
            case 'WALLET': return <WalletView balance={balance} transactions={transactions} onWithdraw={handleWithdraw} username={userProfile.username} savedDetails={savedWithdrawalDetails} hasPin={!!walletPin} onSetupPin={() => setShowPinModal('set')} />;
            case 'DEPOSIT': return <DepositView onDeposit={handleDeposit} />;
            case 'CREATE_TASK': return <CreateTaskView balance={balance} onCreateTask={handleCreateTask} />;
            case 'TASK_HISTORY': return <TaskHistoryView userTasks={userTasks} />;
            case 'INVITE': return <InviteView referrals={referrals} referralEarnings={referralEarnings} onSimulateReferral={handleSimulateReferral} />;
            case 'PROFILE_SETTINGS': return <ProfileSettingsView />;
            case 'HOW_IT_WORKS': return <HowItWorksView />;
            case 'ABOUT_US': return <AboutUsView />;
            case 'CONTACT_US': return <ContactUsView />;
            case 'PRIVACY_POLICY': return <PrivacyPolicyView />;
            case 'TERMS_CONDITIONS': return <TermsAndConditionsView />;
            case 'JOBS': return <JobsView userProfile={userProfile} balance={balance} jobs={jobs} onSubscribe={handleSubscribeToJob} />;
            default: return <DashboardView balance={balance} tasksCompleted={0} referrals={0} setActiveView={handleSetActiveView} transactions={[]} onSimulateNewTask={() => {}} />;
        }
    };
    
    if (showLanding) {
        return <LandingView onGetStarted={() => setShowLanding(false)} />
    }

    if (!userProfile) {
        return <AuthView onLogin={handleLogin} onSignup={handleSignup} />;
    }

    if (userProfile.paymentStatus === 'UNPAID') {
        return <PaymentView onSubmit={handlePaymentSubmit} />;
    }

    if (userProfile.paymentStatus === 'PENDING_VERIFICATION') {
        return <PendingVerificationView />;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans flex">
            {showPinModal && (
                <PinLockView 
                    mode={showPinModal}
                    pinToVerify={walletPin || undefined}
                    onClose={() => setShowPinModal(false)}
                    onPinCorrect={() => {
                        setIsWalletLocked(false);
                        setShowPinModal(false);
                        handleSetActiveView('WALLET');
                    }}
                    onPinSet={handlePinSet}
                    onSkip={handlePinSkip}
                />
            )}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
            <Sidebar activeView={view} setActiveView={handleSetActiveView} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col transition-all duration-300 lg:ml-64`}>
                {showNotificationBanner && <NotificationBanner onRequestPermission={handleRequestPermission} onDismiss={() => setShowNotificationBanner(false)} />}
                <Header activeView={view} balance={balance} username={userProfile.username} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} canGoBack={viewHistory.length > 1} onBack={handleBack} />
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </main>
                <Footer setActiveView={handleSetActiveView} />
            </div>
        </div>
    );
};

export default App;
