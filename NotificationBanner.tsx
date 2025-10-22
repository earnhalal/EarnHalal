import React from 'react';

interface NotificationBannerProps {
  onRequestPermission: () => void;
  onDismiss: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ onRequestPermission, onDismiss }) => {
  return (
    <div className="bg-primary-500 text-white p-3 shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between">
        <p className="font-semibold">
          Get notified about new tasks and account updates!
        </p>
        <div className="flex items-center space-x-4">
          <button
            onClick={onRequestPermission}
            className="bg-white text-primary-600 font-bold py-1 px-4 rounded-full hover:bg-primary-100 transition-colors"
          >
            Enable
          </button>
          <button onClick={onDismiss} className="text-white font-bold text-xl hover:text-primary-200">
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;