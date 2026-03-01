'use client';

import { useTasks } from '@/lib/TaskContext';
import { CATEGORY_COLORS, CATEGORY_BG_COLORS, STATUS_STYLES } from '@/lib/data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, CircleDashed, ChevronDown, Calendar, CheckSquare, List, Columns3, ChevronsUpDown, ChevronsDownUp } from 'lucide-react';
import KanbanBoard from '@/components/KanbanBoard';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function TasksPage() {
    const { tasks } = useTasks();
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
    const [view, setView] = useState<'list' | 'kanban'>('list');
    const [allExpanded, setAllExpanded] = useState(false);

    const toggleTask = (taskId: string) => {
        setExpandedTasks(prev => {
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
            setExpandedTasks(new Set());
            setAllExpanded(false);
        } else {
            const allIds = new Set(tasks.map(t => t.id));
            setExpandedTasks(allIds);
            setAllExpanded(true);
        }
    };

    return (
        <div className="h-full flex flex-col p-8 gap-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 overflow-hidden">
            <header className="flex-shrink-0 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
                        Tasks
                    </h1>
                    <p className="text-neutral-400 mt-2 text-lg">
                        {view === 'list' ? 'Manage your team\'s tasks and subtasks.' : 'Drag and drop tasks across columns.'}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="flex items-center bg-neutral-900/50 border border-neutral-700/50 p-1 rounded-xl">
                        <button
                            onClick={() => setView('list')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                view === 'list'
                                    ? "bg-neutral-800 text-white shadow-md shadow-black/20"
                                    : "text-neutral-400 hover:text-neutral-200"
                            )}
                        >
                            <List size={16} /> List
                        </button>
                        <button
                            onClick={() => setView('kanban')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                view === 'kanban'
                                    ? "bg-neutral-800 text-white shadow-md shadow-black/20"
                                    : "text-neutral-400 hover:text-neutral-200"
                            )}
                        >
                            <Columns3 size={16} /> Kanban
                        </button>
                    </div>

                    {/* Show/Hide All Subtasks — both views */}
                    <button
                        onClick={toggleAll}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-700/50 bg-neutral-800/50 text-neutral-300 hover:text-white hover:bg-neutral-700/60 transition-all text-sm font-medium"
                    >
                        {allExpanded ? (
                            <><ChevronsDownUp size={16} /> Hide All</>
                        ) : (
                            <><ChevronsUpDown size={16} /> Show All</>
                        )}
                    </button>
                </div>
            </header>

            {view === 'kanban' ? (
                <div className="flex-1 overflow-hidden">
                    <KanbanBoard showAllSubtasks={allExpanded} />
                </div>
            ) : (
                <div className="flex-1 border border-neutral-800/80 rounded-3xl bg-neutral-900/50 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-4 p-4 border-b border-neutral-800/80 bg-neutral-900/90 text-sm font-semibold text-neutral-400 uppercase tracking-widest sticky top-0 z-10">
                        <div className="pl-4">Task Details</div>
                        <div>Category</div>
                        <div>Status</div>
                        <div>Timeline</div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-2">
                        {tasks.map(task => {
                            const isExpanded = expandedTasks.has(task.id);
                            const completionPercentage = task.subtasks.length > 0
                                ? Math.round((task.subtasks.filter(s => s.status === 'Completed').length / task.subtasks.length) * 100)
                                : 0;

                            return (
                                <div key={task.id} className="group flex flex-col bg-neutral-950/40 border border-neutral-800/50 rounded-2xl hover:border-neutral-700/50 hover:bg-neutral-900/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg relative">
                                    <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-80", CATEGORY_BG_COLORS[task.category])} />

                                    <div
                                        className={cn(
                                            "grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-4 p-5 cursor-pointer items-center relative z-10",
                                            isExpanded && "bg-neutral-900/40"
                                        )}
                                        onClick={() => toggleTask(task.id)}
                                    >
                                        <div className="flex items-center gap-4 pl-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-indigo-400 transition-colors shadow-inner flex-shrink-0">
                                                <CheckSquare size={16} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-neutral-200 group-hover:text-white transition-colors text-base">{task.taskname}</h3>
                                                {task.subtasks.length > 0 && (
                                                    <div className="flex items-center gap-2 mt-1.5 opacity-70">
                                                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden max-w-[100px]">
                                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${completionPercentage}%` }} />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-neutral-500">{completionPercentage}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <span className={cn(
                                                "inline-block px-3 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm",
                                                CATEGORY_COLORS[task.category]
                                            )}>
                                                {task.category}
                                            </span>
                                        </div>

                                        <div>
                                            <span className={cn(
                                                "inline-block px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm",
                                                STATUS_STYLES[task.status] || STATUS_STYLES['In Progress']
                                            )}>
                                                {task.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm font-medium text-neutral-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-neutral-500" />
                                                    <span>{format(task.start, 'MMM d')}</span>
                                                </div>
                                                <span className="text-neutral-600">→</span>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-neutral-500" />
                                                    <span>{format(task.end, 'MMM d')}</span>
                                                </div>
                                            </div>
                                            <ChevronDown size={18} className={cn(
                                                "text-neutral-600 transition-transform duration-300",
                                                isExpanded ? "rotate-180 text-neutral-400" : "group-hover:text-neutral-400"
                                            )} />
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "grid transition-all duration-300 ease-in-out bg-neutral-900/20 relative z-0",
                                        isExpanded ? "grid-rows-[1fr] opacity-100 border-t border-neutral-800/50" : "grid-rows-[0fr] opacity-0"
                                    )}>
                                        <div className="overflow-hidden">
                                            <div className="p-4 pl-16 space-y-2 relative">
                                                <div className="absolute left-[39px] top-0 bottom-8 border-l-2 border-dashed border-neutral-800" />

                                                {task.subtasks.map((st, i) => (
                                                    <div key={st.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/50 hover:bg-neutral-900 border border-neutral-800/30 transition-colors group/st relative">
                                                        <div className="absolute left-[-26px] top-1/2 w-4 border-t-2 border-dashed border-neutral-800" />

                                                        <div className="flex items-center gap-3">
                                                            {st.status === 'Completed' ? (
                                                                <CheckCircle2 size={18} className="text-emerald-500 shadow-sm" />
                                                            ) : (
                                                                <CircleDashed size={18} className="text-neutral-600 group-hover/st:text-neutral-400 transition-colors" />
                                                            )}
                                                            <span className={cn(
                                                                "text-sm font-medium",
                                                                st.status === 'Completed' ? "text-neutral-500 line-through" : "text-neutral-300"
                                                            )}>{st.title}</span>
                                                        </div>
                                                        <span className={cn(
                                                            "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md",
                                                            st.status === 'Completed' ? "bg-emerald-500/10 text-emerald-500" : "bg-neutral-800 text-neutral-500"
                                                        )}>
                                                            {st.status}
                                                        </span>
                                                    </div>
                                                ))}
                                                {task.subtasks.length === 0 && (
                                                    <p className="text-sm text-neutral-500 italic ml-4">No subtasks for this item.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
