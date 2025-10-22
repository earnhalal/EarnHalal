import React from 'react';
import { DashboardIcon, EarnIcon, WalletIcon, CreateTaskIcon, InviteIcon, SettingsIcon, InfoIcon, LogoutIcon, DocumentTextIcon, ClipboardListIcon, GiftIcon, PlusCircleIcon } from './icons';
import type { View } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-primary-500 text-white shadow-lg'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    {icon}
    <span className="font-semibold">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout, isSidebarOpen }) => {
  const mainViews: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'DASHBOARD', label: 'Dashboard', icon: <DashboardIcon className="w-6 h-6" /> },
    { view: 'EARN', label: 'Earn', icon: <EarnIcon className="w-6 h-6" /> },
    { view: 'SPIN_WHEEL', label: 'Spin & Win', icon: <GiftIcon className="w-6 h-6" /> },
    { view: 'WALLET', label: 'Wallet', icon: <WalletIcon className="w-6 h-6" /> },
    { view: 'DEPOSIT', label: 'Deposit', icon: <PlusCircleIcon className="w-6 h-6" /> },
    { view: 'CREATE_TASK', label: 'Create Task', icon: <CreateTaskIcon className="w-6 h-6" /> },
    { view: 'TASK_HISTORY', label: 'Task History', icon: <ClipboardListIcon className="w-6 h-6" /> },
    { view: 'INVITE', label: 'Invite Friends', icon: <InviteIcon className="w-6 h-6" /> },
  ];

  const secondaryViews: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'PROFILE_SETTINGS', label: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> },
    { view: 'HOW_IT_WORKS', label: 'How it Works', icon: <InfoIcon className="w-6 h-6" /> },
    { view: 'ABOUT_US', label: 'About Us', icon: <InfoIcon className="w-6 h-6" /> },
    { view: 'CONTACT_US', label: 'Contact Us', icon: <InfoIcon className="w-6 h-6" /> },
    { view: 'PRIVACY_POLICY', label: 'Privacy Policy', icon: <DocumentTextIcon className="w-6 h-6" /> },
    { view: 'TERMS_CONDITIONS', label: 'Terms & Conditions', icon: <DocumentTextIcon className="w-6 h-6" /> },
  ];

  return (
    <aside
      className={`bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-64 fixed top-0 left-0 h-full shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:w-64`}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center space-x-2 mb-10 px-2">
           <svg className="w-10 h-10 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <span className="text-2xl font-bold text-gray-800 dark:text-white">Earn Halal</span>
        </div>
        <nav className="flex-1 space-y-2">
          {mainViews.map(({ view, label, icon }) => (
            <NavItem
              key={view}
              icon={icon}
              label={label}
              isActive={activeView === view}
              onClick={() => setActiveView(view)}
            />
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          {secondaryViews.map(({ view, label, icon }) => (
            <NavItem
              key={view}
              icon={icon}
              label={label}
              isActive={activeView === view}
              onClick={() => setActiveView(view)}
            />
          ))}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogoutIcon className="w-6 h-6" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;