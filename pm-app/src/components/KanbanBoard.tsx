'use client';

import { useTasks } from '@/lib/TaskContext';
import { Task, TaskStatus, Subtask, KANBAN_COLUMNS, STATUS_STYLES, COLUMN_STYLES, CATEGORY_BG_COLORS } from '@/lib/data';
import { useState, useRef, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { Calendar, CheckCircle2, CircleDashed, ChevronDown, GripVertical } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ==== TaskCard Component ====
function TaskCard({ task, forceExpanded }: { task: Task; forceExpanded: boolean }) {
    const { updateTaskStatus } = useTasks();
    const [isLocalExpanded, setIsLocalExpanded] = useState(false);

    const isExpanded = forceExpanded || isLocalExpanded;

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('taskId', task.id);
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '0.5';
        }
    };

    const handleDragEnd = (e: React.DragEvent) => {
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '1';
        }
    };

    const completedSubtasks = task.subtasks.filter(s => s.status === 'Completed').length;
    const totalSubtasks = task.subtasks.length;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => setIsLocalExpanded(!isLocalExpanded)}
            className="group relative bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-neutral-700 transition-all cursor-grab active:cursor-grabbing hover:-translate-y-0.5"
        >
            {/* Category Bar */}
            <div className={cn("absolute left-0 top-3 bottom-3 w-1 rounded-r-md opacity-70 group-hover:opacity-100 transition-opacity", CATEGORY_BG_COLORS[task.category])} />

            <div className="pl-2">
                <div className="flex justify-between items-start mb-2 group/header">
                    <h4 className="font-semibold text-neutral-200 text-sm leading-tight pr-4">
                        {task.taskname}
                    </h4>

                    <div className="flex items-center gap-2">
                        {totalSubtasks > 0 && (
                            <div className="p-1 rounded bg-neutral-800/50 text-neutral-500 hover:text-white transition-colors cursor-pointer group-hover/header:bg-neutral-800">
                                <ChevronDown
                                    size={14}
                                    className={cn(
                                        "transition-transform duration-300",
                                        isExpanded ? "rotate-180" : "rotate-0"
                                    )}
                                />
                            </div>
                        )}
                        <GripVertical size={14} className="text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-500">
                        <Calendar size={12} />
                        <span>{format(task.start, 'MMM d')} - {format(task.end, 'MMM d')}</span>
                    </div>
                    {totalSubtasks > 0 && (
                        <div className="flex items-center gap-1.5 font-medium text-neutral-400 bg-neutral-950/50 px-2 py-0.5 rounded-md border border-neutral-800/50">
                            <CheckSquare size={10} />
                            <span>{completedSubtasks}/{totalSubtasks}</span>
                        </div>
                    )}
                </div>

                {/* Subtasks (Expandable) */}
                <div
                    className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        isExpanded ? "grid-rows-[1fr] mt-3 opacity-100" : "grid-rows-[0fr] mt-0 opacity-0"
                    )}
                >
                    <div className="overflow-hidden">
                        <div className="pt-2 border-t border-neutral-800/80 space-y-1">
                            {task.subtasks.map(st => (
                                <div key={st.id} className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-neutral-800/30 transition-colors group/st">
                                    {st.status === 'Completed' ? (
                                        <CheckCircle2 size={12} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                                    ) : (
                                        <CircleDashed size={12} className="mt-0.5 text-neutral-600 group-hover/st:text-neutral-400 flex-shrink-0 transition-colors" />
                                    )}
                                    <span className={cn(
                                        "text-xs leading-snug",
                                        st.status === 'Completed' ? "text-neutral-500 line-through" : "text-neutral-300"
                                    )}>
                                        {st.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==== KanbanBoard Component ====
export default function KanbanBoard({ showAllSubtasks = false }: { showAllSubtasks?: boolean }) {
    const { tasks, updateTaskStatus } = useTasks();
    const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

    const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

    const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
        e.preventDefault();
        setDragOverCol(status);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverCol(null);
    };

    const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
        e.preventDefault();
        setDragOverCol(null);
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            updateTaskStatus(taskId, status);
        }
    };

    return (
        <div className="h-full w-full bg-neutral-900 border border-neutral-800/50 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col pt-4 overflow-hidden">
            <div className="flex h-full gap-5 overflow-x-auto pb-4 no-scrollbar">
                {KANBAN_COLUMNS.map(column => {
                    const columnTasks = getTasksByStatus(column);
                    const isDragOver = dragOverCol === column;
                    const style = COLUMN_STYLES[column];

                    return (
                        <div
                            key={column}
                            className={cn(
                                "flex-shrink-0 w-[320px] flex flex-col bg-neutral-950/40 rounded-2xl border transition-all duration-200 overflow-hidden",
                                isDragOver ? "border-indigo-500/50 bg-neutral-950/60 shadow-inner shadow-indigo-500/10" : "border-neutral-800/50"
                            )}
                            onDragOver={(e) => handleDragOver(e, column)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, column)}
                        >
                            {/* Column Header */}
                            <div className="p-4 border-b border-neutral-800/50 flex justify-between items-center bg-neutral-900/30 sticky top-0 z-10 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", style.dot)} />
                                    <h3 className={cn("font-bold text-sm tracking-wide uppercase", style.header)}>
                                        {column}
                                    </h3>
                                </div>
                                <span className="bg-neutral-800/80 text-neutral-400 text-xs font-bold px-2 py-1 rounded-md">
                                    {columnTasks.length}
                                </span>
                            </div>

                            {/* Column Body / Drop Zone */}
                            <div className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-3">
                                {columnTasks.map(task => (
                                    <TaskCard key={task.id} task={task} forceExpanded={showAllSubtasks} />
                                ))}

                                {columnTasks.length === 0 && (
                                    <div className="h-24 border-2 border-dashed border-neutral-800/50 rounded-xl flex items-center justify-center text-neutral-500 text-sm font-medium">
                                        Drop tasks here
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Temporary import for CheckSquare used in TaskCard
import { CheckSquare } from 'lucide-react';
