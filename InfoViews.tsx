import React from 'react';

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{title}</h2>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
            {children}
        </div>
    </div>
);

export const HowItWorksView = () => (
    <InfoCard title="How It Works">
        <p><strong>1. Sign Up:</strong> Create your account and complete the one-time verification process.</p>
        <p><strong>2. Complete Tasks:</strong> Browse available tasks in the 'Earn' section. Follow the simple instructions for each task, such as visiting a website or liking a social media page.</p>
        <p><strong>3. Earn Rewards:</strong> Once you complete a task, the reward amount is instantly added to your wallet balance.</p>
        <p><strong>4. Create Your Own Tasks:</strong> Need more engagement for your website or social media? Use your balance to create tasks for other users to complete.</p>
        <p><strong>5. Withdraw Earnings:</strong> You can request a withdrawal of your earnings once you reach the minimum threshold. Payments are processed quickly to your preferred method.</p>
    </InfoCard>
);

export const AboutUsView = () => (
    <InfoCard title="About Us">
        <p>Earn Halal is a platform dedicated to providing legitimate and ethical online earning opportunities. We believe in transparency, fairness, and upholding Halal principles in all our operations.</p>
        <p>Our mission is to connect individuals looking for simple online work with businesses and creators who need to boost their online presence. We ensure that all tasks on our platform are vetted and that payments are processed securely and on time.</p>
        <p>Join our community today and become a part of a trusted and growing network.</p>
    </InfoCard>
);

export const ContactUsView = () => (
    <InfoCard title="Contact Us">
        <p>If you have any questions, concerns, or feedback, please don't hesitate to reach out to our support team.</p>
        <p><strong>Email:</strong> support@earnhalal.com</p>
        <p>Our support team is available 24/7 to assist you with any issues you may encounter.</p>
    </InfoCard>
);

export const PrivacyPolicyView = () => (
    <InfoCard title="Privacy Policy">
        <p>Your privacy is important to us. It is Earn Halal's policy to respect your privacy regarding any information we may collect from you across our website.</p>
        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
        <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
    </InfoCard>
);

export const TermsAndConditionsView = () => (
    <InfoCard title="Terms & Conditions">
        <p>By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
        <p>The materials contained in this website are protected by applicable copyright and trademark law.</p>
        <p>Permission is granted to temporarily download one copy of the materials on Earn Halal's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
    </InfoCard>
);