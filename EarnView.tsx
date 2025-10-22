// components/EarnView.tsx
import React from 'react';
import type { Task } from '../types';

interface EarnViewProps {
  tasks: Task[];
  onCompleteTask: (task: Task) => void;
}

const EarnView: React.FC<EarnViewProps> = ({ tasks, onCompleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">No Tasks Available</h2>
        <p className="text-gray-600 dark:text-gray-300">
          There are currently no new tasks. Please check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Available Tasks</h2>
      {tasks.map(task => (
        <div key={task.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <span className="text-xs font-semibold uppercase text-primary-500">{task.type}</span>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{task.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold text-green-500">{task.reward.toFixed(2)} Rs</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
             <a href={task.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline break-all">
                {task.url}
             </a>
             <button
                onClick={() => onCompleteTask(task)}
                className="bg-primary-500 text-white py-2 px-6 rounded-md hover:bg-primary-600 transition-colors w-full sm:w-auto"
              >
                Complete Task
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EarnView;
