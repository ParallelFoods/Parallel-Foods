import { Task, Subtask, CATEGORY_COLORS } from '@/lib/data';
import { CheckCircle2, CircleDashed } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ToDoListProps {
    title: string;
    tasks: Task[];
}

export default function ToDoList({ title, tasks }: ToDoListProps) {
    return (
        <div className="bg-neutral-900 border border-neutral-800/50 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col h-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                {title}
            </h3>

            <div className="space-y-4">
                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-neutral-500">
                        <CheckCircle2 size={40} className="mb-2 opacity-20" />
                        <p className="text-sm">All caught up!</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className="bg-neutral-950/50 border border-neutral-800/60 rounded-2xl p-4 transition-all hover:bg-neutral-950/80 hover:border-neutral-700/50">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-neutral-200">{task.taskname}</h4>
                                <span className={cn('text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border', CATEGORY_COLORS[task.category])}>
                                    {task.category}
                                </span>
                            </div>

                            <div className="space-y-2 pl-2 border-l-2 border-neutral-800 ml-2">
                                {task.subtasks.map(subtask => (
                                    <div key={subtask.id} className="flex items-start gap-3 group">
                                        <button className="mt-0.5 flex-shrink-0 transition-transform active:scale-95">
                                            {subtask.status === 'Completed' ? (
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                            ) : (
                                                <CircleDashed size={16} className="text-neutral-500 group-hover:text-indigo-400 transition-colors" />
                                            )}
                                        </button>
                                        <span
                                            className={cn(
                                                "text-sm transition-colors duration-200",
                                                subtask.status === 'Completed' ? "text-neutral-500 line-through" : "text-neutral-300 group-hover:text-neutral-100"
                                            )}
                                        >
                                            {subtask.title}
                                        </span>
                                    </div>
                                ))}
                                {task.subtasks.length === 0 && (
                                    <p className="text-xs text-neutral-600 italic">No subtasks found.</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
