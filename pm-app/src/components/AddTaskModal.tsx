'use client';

import { useState } from 'react';
import { useTasks } from '@/lib/TaskContext';
import { Task, Category, Subtask } from '@/lib/data';
import { X, Plus, Trash2, Calendar as CalendarIcon, Tag, AlignLeft, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function AddTaskModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { addTask } = useTasks();

    const [taskname, setTaskname] = useState('');
    const [category, setCategory] = useState<Category>('Development');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [subtasks, setSubtasks] = useState<{ id: string; title: string }[]>([]);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const resetForm = () => {
        setTaskname('');
        setCategory('Development');
        setStart('');
        setEnd('');
        setSubtasks([]);
        setNewSubtaskTitle('');
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleAddSubtask = (e: React.KeyboardEvent | React.MouseEvent) => {
        if ('key' in e && e.key !== 'Enter') return;
        e.preventDefault();

        if (newSubtaskTitle.trim()) {
            setSubtasks(prev => [...prev, { id: Math.random().toString(36).substring(7), title: newSubtaskTitle.trim() }]);
            setNewSubtaskTitle('');
        }
    };

    const handleRemoveSubtask = (id: string) => {
        setSubtasks(prev => prev.filter(st => st.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!taskname.trim()) {
            setError('Task name is required.');
            return;
        }
        if (!start || !end) {
            setError('Start and End dates are required.');
            return;
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (endDate < startDate) {
            setError('End date cannot be before start date.');
            return;
        }

        const formattedSubtasks: Subtask[] = subtasks.map(st => ({
            id: st.id,
            title: st.title,
            status: 'Not Started',
        }));

        const newTask: Task = {
            id: Math.random().toString(36).substring(7),
            taskname: taskname.trim(),
            category,
            start: startDate,
            end: endDate,
            status: 'Not Started',
            subtasks: formattedSubtasks,
        };

        addTask(newTask);
        handleClose();
    };

    const categories: Category[] = ['Development', 'Design', 'Marketing', 'Management'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-white">Create New Task</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 -mr-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto no-scrollbar flex-1">
                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-400">
                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form id="add-task-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Task Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                <AlignLeft size={16} className="text-neutral-500" />
                                Task Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={taskname}
                                onChange={(e) => setTaskname(e.target.value)}
                                placeholder="e.g. Design Database Schema"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Category */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                    <Tag size={16} className="text-neutral-500" />
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as Category)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer"
                                >
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Dates */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                        <CalendarIcon size={16} className="text-neutral-500" />
                                        Start Date <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={start}
                                        onChange={(e) => setStart(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer [color-scheme:dark]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                        <CalendarIcon size={16} className="text-neutral-500" />
                                        End Date <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={end}
                                        onChange={(e) => setEnd(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Subtasks */}
                        <div className="pt-2 border-t border-neutral-800">
                            <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-3">
                                <CheckSquare size={16} className="text-neutral-500" />
                                Subtasks
                            </label>

                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newSubtaskTitle}
                                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                    onKeyDown={handleAddSubtask}
                                    placeholder="Add a subtask..."
                                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSubtask}
                                    disabled={!newSubtaskTitle.trim()}
                                    className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-200 rounded-xl flex items-center justify-center transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {subtasks.length > 0 && (
                                <div className="bg-neutral-950/50 rounded-xl border border-neutral-800/50 max-h-48 overflow-y-auto no-scrollbar">
                                    {subtasks.map((st, i) => (
                                        <div
                                            key={st.id}
                                            className={cn(
                                                "flex items-center justify-between p-3 group",
                                                i !== subtasks.length - 1 && "border-b border-neutral-800/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded border border-neutral-600 bg-neutral-900 flex-shrink-0" />
                                                <span className="text-sm text-neutral-300">{st.title}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSubtask(st.id)}
                                                className="text-neutral-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3 flex-shrink-0">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-5 py-2.5 rounded-xl font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-6 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all"
                    >
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
}

// Temporary inline CheckSquare import since we aren't importing it at the top level here to avoid conflicts
import { CheckSquare } from 'lucide-react';
