'use client';

import { useState } from 'react';
import { CATEGORY_COLORS, STATUS_STYLES } from '@/lib/data';
import { useTasks } from '@/lib/TaskContext';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown, CheckCircle2, CircleDashed, ChevronsDownUp, ChevronsUpDown, List, Columns3 } from 'lucide-react';
import KanbanBoard from '@/components/KanbanBoard';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type ViewMode = 'list' | 'kanban';

export default function TasksPage() {
    const { tasks } = useTasks();
    const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());
    const [allExpanded, setAllExpanded] = useState(false);
    const [view, setView] = useState<ViewMode>('list');

    const toggleTask = (taskId: string) => {
        setExpandedTaskIds(prev => {
            const next = new Set(prev);
            if (next.has(taskId)) {
                next.delete(taskId);
            } else {
                next.add(taskId);
            }
            return next;
        });
    };

    const toggleAll = () => {
        if (allExpanded) {
            setExpandedTaskIds(new Set());
            setAllExpanded(false);
        } else {
            const allIds = new Set(tasks.filter(t => t.subtasks.length > 0).map(t => t.id));
            setExpandedTaskIds(allIds);
            setAllExpanded(true);
        }
    };

    return (
        <div className="h-full flex flex-col p-8 gap-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 overflow-hidden">
            <header className="flex-shrink-0 flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
                        All Tasks
                    </h1>
                    <p className="text-neutral-400 mt-2 text-lg">
                        {view === 'list' ? 'Manage and view all your project items in an Excel-like grid.' : 'Drag and drop tasks between status columns.'}
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                        <button
                            onClick={() => setView('list')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                view === 'list'
                                    ? "bg-neutral-700 text-white shadow-sm"
                                    : "text-neutral-500 hover:text-neutral-300"
                            )}
                        >
                            <List size={15} />
                            List
                        </button>
                        <button
                            onClick={() => setView('kanban')}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                view === 'kanban'
                                    ? "bg-neutral-700 text-white shadow-sm"
                                    : "text-neutral-500 hover:text-neutral-300"
                            )}
                        >
                            <Columns3 size={15} />
                            Kanban
                        </button>
                    </div>

                    {/* Show/Hide All Subtasks — both views */}
                    <button
                        onClick={toggleAll}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-700/50 bg-neutral-800/50 text-neutral-300 hover:text-white hover:bg-neutral-700/60 transition-all text-sm font-medium"
                    >
                        {allExpanded ? (
                            <><ChevronsDownUp size={16} /> Hide All Subtasks</>
                        ) : (
                            <><ChevronsUpDown size={16} /> Show All Subtasks</>
                        )}
                    </button>
                </div>
            </header>

            {view === 'kanban' ? (
                <div className="flex-1 overflow-hidden">
                    <KanbanBoard showAllSubtasks={allExpanded} />
                </div>
            ) : (
                <div className="flex-1 overflow-hidden bg-neutral-900 border border-neutral-800/50 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col">
                    {/* Table Header */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] bg-neutral-950/60 p-4 border-b border-neutral-800/80 sticky top-0 z-10 font-semibold text-neutral-400 text-sm tracking-wider uppercase">
                        <div className="pl-10">Task Name</div>
                        <div>Category</div>
                        <div>Start Date</div>
                        <div>End Date</div>
                        <div>Status</div>
                    </div>

                    {/* Table Body */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {tasks.map((task, index) => {
                            const isExpanded = expandedTaskIds.has(task.id);
                            const hasSubtasks = task.subtasks.length > 0;

                            return (
                                <div key={task.id}>
                                    {/* Main Task Row */}
                                    <div
                                        onClick={() => hasSubtasks && toggleTask(task.id)}
                                        className={cn(
                                            "grid grid-cols-[2fr_1fr_1fr_1fr_1fr] p-4 items-center border-b border-neutral-800/30 transition-all group",
                                            hasSubtasks ? "cursor-pointer hover:bg-neutral-800/50" : "hover:bg-neutral-800/20",
                                            index % 2 === 0 ? "bg-neutral-900/30" : "bg-transparent",
                                            isExpanded && "bg-neutral-800/40"
                                        )}
                                    >
                                        <div className="pl-4 font-medium text-neutral-200 truncate pr-4 flex items-center gap-2">
                                            {hasSubtasks ? (
                                                <ChevronDown
                                                    size={16}
                                                    className={cn(
                                                        "text-neutral-500 flex-shrink-0 transition-transform duration-300",
                                                        isExpanded ? "rotate-180" : "rotate-0"
                                                    )}
                                                />
                                            ) : (
                                                <span className="w-4 flex-shrink-0" />
                                            )}
                                            <span className="truncate">{task.taskname}</span>
                                            {hasSubtasks && (
                                                <span className="ml-1 text-[10px] text-neutral-500 font-normal flex-shrink-0">
                                                    {task.subtasks.length}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <span className={cn('text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-md border', CATEGORY_COLORS[task.category])}>
                                                {task.category}
                                            </span>
                                        </div>
                                        <div className="text-neutral-300 font-mono text-sm">
                                            {format(task.start, 'MMM dd, yyyy')}
                                        </div>
                                        <div className="text-neutral-300 font-mono text-sm">
                                            {format(task.end, 'MMM dd, yyyy')}
                                        </div>
                                        <div>
                                            <span className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md", STATUS_STYLES[task.status])}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Subtask Rows */}
                                    <div
                                        className={cn(
                                            "overflow-hidden transition-all duration-300 ease-in-out",
                                            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                        )}
                                    >
                                        {task.subtasks.map((subtask) => (
                                            <div
                                                key={subtask.id}
                                                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-4 py-2.5 items-center border-b border-neutral-800/20 bg-neutral-950/40 transition-colors hover:bg-neutral-950/60"
                                            >
                                                <div className="pl-10 flex items-center gap-3">
                                                    <div className="w-px h-4 bg-neutral-700 flex-shrink-0" />
                                                    {subtask.status === 'Completed' || subtask.status === 'Done' ? (
                                                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                                                    ) : (
                                                        <CircleDashed size={14} className="text-neutral-500 flex-shrink-0" />
                                                    )}
                                                    <span className="text-sm text-neutral-400 truncate">{subtask.title}</span>
                                                </div>
                                                <div /><div /><div />
                                                <div>
                                                    <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-semibold", STATUS_STYLES[subtask.status])}>
                                                        {subtask.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Empty filler rows */}
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={`empty-${i}`}
                                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] p-6 items-center border-b border-neutral-800/10"
                            >
                                <div /> <div /> <div /> <div /> <div />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
