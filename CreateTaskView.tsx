import React, { useState, useMemo } from 'react';
import type { Task, TaskType as TaskTypeEnum } from '../types';
import { TaskType } from '../types';
import { CheckCircleIcon } from './icons';


interface CreateTaskViewProps {
  balance: number;
  onCreateTask: (task: Omit<Task, 'id'>, quantity: number, totalCost: number) => void;
}

type FormState = {
    taskType: TaskTypeEnum;
    title: string;
    description: string;
    url: string;
    reward: string;
    quantity: string;
}

const initialFormState: FormState = {
    taskType: TaskType.VISIT_WEBSITE,
    title: '',
    description: '',
    url: '',
    reward: '',
    quantity: ''
};

const CreateTaskView: React.FC<CreateTaskViewProps> = ({ balance, onCreateTask }) => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedTask, setSubmittedTask] = useState<Omit<Task, 'id'> & { quantity: number; totalCost: number; } | null>(null);

  const totalCost = useMemo(() => {
    const rewardNum = parseFloat(form.reward);
    const quantityNum = parseInt(form.quantity, 10);
    if (!isNaN(rewardNum) && !isNaN(quantityNum) && rewardNum > 0 && quantityNum > 0) {
      return rewardNum * quantityNum;
    }
    return 0;
  }, [form.reward, form.quantity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (totalCost <= 0) {
      setError('Please enter a valid reward and quantity.');
      return;
    }
    if (totalCost > balance) {
      setError('Insufficient balance to create this task campaign.');
      return;
    }

    setIsSubmitting(true);
    const taskData: Omit<Task, 'id'> = {
        type: form.taskType,
        title: form.title,
        description: form.description,
        url: form.url,
        reward: parseFloat(form.reward)
    };
    const quantityNum = parseInt(form.quantity, 10);
    
    setSubmittedTask({ ...taskData, quantity: quantityNum, totalCost });
    
    // Simulate API call
    setTimeout(() => {
        onCreateTask(taskData, quantityNum, totalCost);
        setIsSubmitting(false);
        setIsSuccess(true);
    }, 1500);
  };
  
  const handleCreateAnother = () => {
    setForm(initialFormState);
    setIsSuccess(false);
    setSubmittedTask(null);
    setError('');
  };

  if (isSuccess && submittedTask) {
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-3xl mx-auto text-center animate-fade-in">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Campaign Launched!</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 mb-6">
                Your task "{submittedTask.title}" is now live for the community.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg text-left space-y-2 mb-8">
                <p><strong>Type:</strong> {submittedTask.type}</p>
                <p><strong>Quantity:</strong> {submittedTask.quantity} tasks</p>
                <p><strong>Reward per Task:</strong> {submittedTask.reward.toFixed(2)} Rs</p>
                <p><strong>Total Cost:</strong> <span className="font-bold text-red-500">{submittedTask.totalCost.toFixed(2)} Rs</span> (deducted)</p>
            </div>
            <button 
                onClick={handleCreateAnother}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-lg"
            >
                Create Another Campaign
            </button>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Create a New Task Campaign</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Promote your content by creating tasks for our community to complete.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={isSubmitting}>
            <div className="p-6 border rounded-lg dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">1. Task Details</h3>
                <div className="space-y-4">
                    <div>
                      <label htmlFor="taskType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Type</label>
                      <select 
                        id="taskType" 
                        value={form.taskType} 
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600"
                      >
                        {Object.values(TaskType).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Title</label>
                      <input type="text" id="title" value={form.title} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., Visit my new blog post" required />
                    </div>
                    <div>
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
                      <input type="url" id="url" value={form.url} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" placeholder="https://example.com" required />
                    </div>
                     <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                      <textarea id="description" rows={3} value={form.description} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" placeholder="A short description of what users need to do." required />
                    </div>
                </div>
            </div>

            <div className="p-6 border rounded-lg dark:border-gray-700">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">2. Budget</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="reward" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reward per Task (Rs)</label>
                    <input type="number" id="reward" value={form.reward} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., 5" step="0.01" min="0.1" required />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Tasks</label>
                    <input type="number" id="quantity" value={form.quantity} onChange={handleChange} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600" placeholder="e.g., 100" min="1" required />
                  </div>
                </div>
            </div>
        </fieldset>

        <div className="bg-primary-50 dark:bg-gray-700/50 p-6 rounded-lg text-center">
            <p className="font-medium text-lg text-gray-700 dark:text-gray-200">Total Campaign Cost</p>
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 my-2">{totalCost.toFixed(2)} Rs</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your current balance: {balance.toFixed(2)} Rs</p>
        </div>

        {error && (
          <div className="p-4 rounded-md text-center text-sm font-semibold bg-red-100 text-red-800">
              {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting || totalCost <= 0 || totalCost > balance}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Launching...
            </>
          ) : 'Launch Campaign'}
        </button>
      </form>
       <style>{`
            @keyframes fade-in {
                0% { opacity: 0; transform: translateY(10px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default CreateTaskView;
