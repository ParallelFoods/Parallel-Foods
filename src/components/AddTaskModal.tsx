'use client';

import { useState } from 'react';
import { useTasks } from '@/lib/TaskContext';
import { Category, Subtask, TaskStatus, CATEGORY_COLORS } from '@/lib/data';
import { X, Plus, Trash2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
    const { addTask } = useTasks();

    const [taskname, setTaskname] = useState('');
    const [category, setCategory] = useState<Category>('Development');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [status] = useState<TaskStatus>('Not Started');

    // Subtasks State
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    if (!isOpen) return null;

    const handleAddSubtask = () => {
        if (!newSubtaskTitle.trim()) return;
        const newSubtask: Subtask = {
            id: `sub-${Date.now()}`,
            title: newSubtaskTitle.trim(),
            status: 'Not Started',
        };
        setSubtasks([...subtasks, newSubtask]);
        setNewSubtaskTitle(''); // Reset input
    };

    const handleRemoveSubtask = (id: string) => {
        setSubtasks(subtasks.filter(s => s.id !== id));
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!taskname || !start || !end) {
            alert('Please fill in the task name and both dates.');
            return;
        }

        addTask({
            id: `task-${Date.now()}`,
            taskname,
            category,
            start: new Date(start),
            end: new Date(end),
            status,
            subtasks,
        });

        // Reset and close
        setTaskname('');
        setCategory('Development');
        setStart('');
        setEnd('');
        setSubtasks([]);
        setNewSubtaskTitle('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
            <div className="bg-neutral-900 border border-neutral-800/50 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-neutral-800/50">
                    <h2 className="text-xl font-bold text-white tracking-tight">Add New Task</h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto no-scrollbar flex-1">
                    <form id="add-task-form" onSubmit={handleSubmit} className="space-y-5">
                        {/* Task Name */}
                        <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Task Name</label>
                            <input
                                type="text"
                                value={taskname}
                                onChange={(e) => setTaskname(e.target.value)}
                                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-200 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-neutral-600"
                                placeholder="e.g. Design Database Schema"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as Category)}
                                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-200 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                            >
                                <option value="Development">Development</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Management">Management</option>
                            </select>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Start Date</label>
                                <input
                                    type="date"
                                    value={start}
                                    onChange={(e) => setStart(e.target.value)}
                                    className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-200 outline-none focus:border-indigo-500/50 transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">End Date</label>
                                <input
                                    type="date"
                                    value={end}
                                    onChange={(e) => setEnd(e.target.value)}
                                    className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-200 outline-none focus:border-indigo-500/50 transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        <hr className="border-neutral-800/50 my-2" />

                        {/* Subtasks Section */}
                        <div className="space-y-3">
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Subtasks</label>

                            {/* Listed Subtasks */}
                            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                                {subtasks.map((subtask, i) => (
                                    <div key={subtask.id} className="flex items-center justify-between bg-neutral-950/80 border border-neutral-800 rounded-lg px-3 py-2">
                                        <span className="text-sm text-neutral-300 truncate pr-2">{i + 1}. {subtask.title}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSubtask(subtask.id)}
                                            className="text-neutral-500 hover:text-red-400 transition-colors flex-shrink-0"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {subtasks.length === 0 && (
                                    <p className="text-xs text-neutral-600 italic">No subtasks added yet.</p>
                                )}
                            </div>

                            {/* Add Subtask Input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSubtaskTitle}
                                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSubtask();
                                        }
                                    }}
                                    className="flex-1 bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/50 transition-all placeholder:text-neutral-600"
                                    placeholder="Add a subtask..."
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSubtask}
                                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-2 rounded-xl border border-neutral-700 transition-colors flex items-center justify-center"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-neutral-800/50 bg-neutral-950/40 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-medium text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit()}
                        className="px-5 py-2.5 rounded-xl font-medium text-sm bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                    >
                        Add Task
                    </button>
                </div>
            </div>
        </div>
    );
}
