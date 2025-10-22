import React from 'react';
import type { UserCreatedTask } from '../types';

interface TaskHistoryViewProps {
    userTasks: UserCreatedTask[];
}

const TaskHistoryView: React.FC<TaskHistoryViewProps> = ({ userTasks }) => {
    if (userTasks.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">No Tasks Created Yet</h2>
                <p className="text-gray-600 dark:text-gray-300">You haven't created any tasks. Go to the 'Create Task' page to start a new campaign.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">My Created Task History</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Task Title</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Completions</th>
                            <th scope="col" className="px-6 py-3 text-center">Views</th>
                            <th scope="col" className="px-6 py-3 text-right">Total Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userTasks.map(task => {
                            const completionPercentage = task.quantity > 0 ? (task.completions / task.quantity) * 100 : 0;
                            const isCompleted = task.completions >= task.quantity;
                            const totalCost = task.reward * task.quantity;

                            return (
                                <tr key={task.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {task.title}
                                        <p className="text-xs font-normal text-gray-500">{task.type}</p>
                                    </th>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            isCompleted ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                        }`}>
                                            {isCompleted ? 'Completed' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center">
                                            <span>{task.completions} / {task.quantity}</span>
                                            <div className="w-16 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ml-2">
                                                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">{task.views.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-semibold">{totalCost.toFixed(2)} Rs</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskHistoryView;