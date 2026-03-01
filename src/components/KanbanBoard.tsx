'use client';

import { useState } from 'react';
import { useTasks } from '@/lib/TaskContext';
import { Task, TaskStatus, KANBAN_COLUMNS, CATEGORY_COLORS, CATEGORY_BG_COLORS, STATUS_STYLES, COLUMN_STYLES } from '@/lib/data';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GripVertical, Calendar, ChevronDown, CheckCircle2, CircleDashed } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface KanbanBoardProps {
    showAllSubtasks: boolean;
}

export default function KanbanBoard({ showAllSubtasks }: KanbanBoardProps) {
    const { tasks, updateTaskStatus } = useTasks();
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

    const getTasksByStatus = (status: TaskStatus) =>
        tasks.filter(t => {
            if (status === 'Done') return t.status === 'Done' || t.status === 'Completed';
            return t.status === status;
        });

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, column: TaskStatus) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(column);
    };

    const handleDrop = (e: React.DragEvent, column: TaskStatus) => {
        e.preventDefault();
        if (draggedTaskId) {
            updateTaskStatus(draggedTaskId, column);
        }
        setDraggedTaskId(null);
        setDragOverColumn(null);
    };

    const handleDragEnd = () => {
        setDraggedTaskId(null);
        setDragOverColumn(null);
    };

    return (
        <div className="flex gap-5 h-full overflow-x-auto pb-4 no-scrollbar">
            {KANBAN_COLUMNS.map(column => {
                const colTasks = getTasksByStatus(column);
                const styles = COLUMN_STYLES[column];
                const isDragTarget = dragOverColumn === column;

                return (
                    <div
                        key={column}
                        className={cn(
                            "flex flex-col flex-shrink-0 w-72 rounded-3xl border transition-all duration-200",
                            isDragTarget
                                ? "bg-neutral-800/60 border-indigo-500/40 shadow-lg shadow-indigo-500/10"
                                : "bg-neutral-900/60 border-neutral-800/50"
                        )}
                        onDragOver={(e) => handleDragOver(e, column)}
                        onDrop={(e) => handleDrop(e, column)}
                        onDragLeave={(e) => {
                            // Only clear if leaving the column entirely (not into a child)
                            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                setDragOverColumn(null);
                            }
                        }}
                    >
                        {/* Column Header — fixed */}
                        <div className="p-5 border-b border-neutral-800/50 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", styles.dot)} />
                                <h3 className={cn("font-semibold text-sm tracking-wide", styles.header)}>
                                    {column}
                                </h3>
                            </div>
                            <span className="text-xs font-semibold text-neutral-500 bg-neutral-800 px-2 py-1 rounded-full">
                                {colTasks.length}
                            </span>
                        </div>

                        {/* Cards — vertically scrollable */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar min-h-0">
                            {colTasks.length === 0 && (
                                <div className={cn(
                                    "flex items-center justify-center h-24 rounded-2xl border-2 border-dashed text-sm transition-colors",
                                    isDragTarget ? "border-indigo-500/40 text-indigo-400/60" : "border-neutral-800/50 text-neutral-600"
                                )}>
                                    {isDragTarget ? "Drop here" : "No tasks"}
                                </div>
                            )}
                            {colTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    isDragging={draggedTaskId === task.id}
                                    forceExpanded={showAllSubtasks}
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    onDragEnd={handleDragEnd}
                                />
                            ))}
                            {colTasks.length > 0 && isDragTarget && (
                                <div className="h-2 rounded-full bg-indigo-500/20 border border-dashed border-indigo-500/30 transition-all" />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function TaskCard({
    task,
    isDragging,
    forceExpanded,
    onDragStart,
    onDragEnd,
}: {
    task: Task;
    isDragging: boolean;
    forceExpanded: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: () => void;
}) {
    const [localExpanded, setLocalExpanded] = useState(false);
    const isExpanded = forceExpanded || localExpanded;

    const completedSubtasks = task.subtasks.filter(
        s => s.status === 'Completed' || s.status === 'Done'
    ).length;

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't toggle if we're starting a drag
        if ((e.target as HTMLElement).closest('[data-drag-handle]')) return;
        if (task.subtasks.length > 0) {
            setLocalExpanded(prev => !prev);
        }
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={handleCardClick}
            className={cn(
                "bg-neutral-950/70 border border-neutral-800/60 rounded-2xl p-4 transition-all duration-200 group select-none",
                task.subtasks.length > 0 ? "cursor-pointer" : "cursor-grab active:cursor-grabbing",
                isDragging
                    ? "opacity-40 scale-95 shadow-none"
                    : "hover:border-neutral-700/60 hover:bg-neutral-950 hover:shadow-lg hover:-translate-y-0.5"
            )}
        >
            {/* Category badge + drag handle */}
            <div className="flex items-center justify-between mb-3">
                <span className={cn('text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border', CATEGORY_COLORS[task.category])}>
                    {task.category}
                </span>
                <div className="flex items-center gap-1">
                    {task.subtasks.length > 0 && (
                        <ChevronDown
                            size={14}
                            className={cn(
                                "text-neutral-500 transition-transform duration-300",
                                isExpanded ? "rotate-180" : "rotate-0"
                            )}
                        />
                    )}
                    <div data-drag-handle className="cursor-grab active:cursor-grabbing">
                        <GripVertical size={14} className="text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Task Name */}
            <p className="text-sm font-semibold text-neutral-200 leading-snug mb-3">{task.taskname}</p>

            {/* Date range */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
                <Calendar size={11} />
                <span>{format(task.start, 'MMM d')} → {format(task.end, 'MMM d')}</span>
            </div>

            {/* Subtask progress bar */}
            {task.subtasks.length > 0 && (
                <div className="mb-1">
                    <div className="flex justify-between text-[10px] text-neutral-600 mb-1">
                        <span>Subtasks</span>
                        <span>{completedSubtasks}/{task.subtasks.length}</span>
                    </div>
                    <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all", CATEGORY_BG_COLORS[task.category])}
                            style={{ width: `${task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Expanded Subtask List */}
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded && task.subtasks.length > 0 ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
                )}
            >
                <div className="border-t border-neutral-800/60 pt-3 space-y-2">
                    {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-start gap-2">
                            {subtask.status === 'Completed' || subtask.status === 'Done' ? (
                                <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                            ) : (
                                <CircleDashed size={13} className="text-neutral-600 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={cn(
                                "text-xs leading-snug flex-1",
                                subtask.status === 'Completed' || subtask.status === 'Done'
                                    ? "text-neutral-600 line-through"
                                    : "text-neutral-400"
                            )}>
                                {subtask.title}
                            </span>
                            <span className={cn(
                                "text-[9px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0",
                                STATUS_STYLES[subtask.status]
                            )}>
                                {subtask.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
