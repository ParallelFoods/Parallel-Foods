'use client';

import { useTasks } from '@/lib/TaskContext';
import { CATEGORY_COLORS, CATEGORY_BG_COLORS, Task } from '@/lib/data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, addDays, startOfWeek, eachDayOfInterval, isSameMonth, subDays, differenceInCalendarDays } from 'date-fns';
import { CheckCircle2, CircleDashed } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---- Gantt Chart Component ----
function GanttChart() {
  const { tasks, isLoading } = useTasks();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const chartStart = startOfWeek(subDays(today, 3), { weekStartsOn: 1 });

  // Dynamically extend chart to fit the latest task, with a minimum of 14 days
  const latestTaskEnd = tasks.reduce((latest, task) => {
    const end = new Date(task.end);
    end.setHours(0, 0, 0, 0);
    return end > latest ? end : latest;
  }, addDays(chartStart, 13));

  const totalDays = Math.max(14, differenceInCalendarDays(latestTaskEnd, chartStart) + 2);
  const chartEnd = addDays(chartStart, totalDays - 1);
  const days = eachDayOfInterval({ start: chartStart, end: chartEnd });

  return (
    <div className="bg-neutral-900 border border-neutral-800/50 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col h-full max-h-[600px] overflow-hidden">
      <h2 className="text-xl font-bold text-white mb-6">Timeline Overview</h2>

      <div className="flex-1 overflow-auto no-scrollbar border border-neutral-800/80 rounded-2xl bg-neutral-950/20">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <CircleDashed className="animate-spin text-neutral-500 w-8 h-8" />
          </div>
        ) : (
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[200px_1fr] border-b border-neutral-800/80 bg-neutral-950/40 sticky top-0 z-10">
              <div className="p-4 font-semibold text-neutral-400 text-sm border-r border-neutral-800/80 uppercase tracking-wider bg-neutral-950/40">
                Task
              </div>
              <div className="flex bg-neutral-950/40">
                {days.map((day, i) => {
                  const isFirstOfMonth = day.getDate() === 1 || i === 0;
                  return (
                    <div key={day.toISOString()} className="flex-1 border-r border-neutral-800/30 text-center flex flex-col min-w-[50px]">
                      <div className="text-[10px] font-bold text-neutral-500 py-1 border-b border-neutral-800/30 bg-neutral-900/50 uppercase tracking-widest">
                        {isFirstOfMonth ? format(day, 'MMM yyyy') : ''}
                      </div>
                      <div className="py-2 flex flex-col items-center justify-center relative">
                        <span className="text-[10px] font-semibold text-neutral-500 mb-1">{format(day, 'EEE')}</span>
                        <span className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold transition-colors",
                          day.getTime() === today.getTime()
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40"
                            : "text-neutral-300"
                        )}>
                          {format(day, 'd')}
                        </span>
                        {day.getTime() === today.getTime() && (
                          <div className="absolute top-10 bottom-[-1000px] w-0.5 bg-indigo-500/30 z-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              {tasks.map((task) => {
                const taskStart = new Date(task.start);
                const taskEnd = new Date(task.end);
                taskStart.setHours(0, 0, 0, 0);
                taskEnd.setHours(0, 0, 0, 0);

                const startDiff = (taskStart.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24);
                const duration = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24) + 1;

                const isVisible = startDiff < days.length && startDiff + duration > 0;

                return (
                  <div key={task.id} className="grid grid-cols-[200px_1fr] border-b border-neutral-800/30 hover:bg-neutral-800/20 transition-colors group">
                    <div className="p-4 border-r border-neutral-800/30">
                      <h3 className="text-sm font-medium text-neutral-200 truncate group-hover:text-white transition-colors">
                        {task.taskname}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">{task.category}</p>
                    </div>
                    <div className="relative py-3 px-0 flex items-center">
                      <div className="flex w-full">
                        {days.map((d, i) => {
                          const dayIndex = i;
                          const barStart = Math.max(0, startDiff);
                          const barEnd = Math.min(days.length, startDiff + duration);
                          const isInBar = isVisible && dayIndex >= barStart && dayIndex < barEnd;
                          const isBarStart = isVisible && dayIndex === Math.floor(barStart);
                          const isBarEnd = isVisible && dayIndex === Math.floor(barEnd - 1);

                          return (
                            <div key={d.toISOString()} className="flex-1 min-w-[50px] border-r border-neutral-800/10 h-12 relative flex items-center">
                              {isInBar && (
                                <div
                                  className={cn(
                                    "absolute inset-y-2 left-0 right-0 flex items-center z-10 backdrop-blur-sm",
                                    CATEGORY_COLORS[task.category],
                                    isBarStart && "rounded-l-lg left-1",
                                    isBarEnd && "rounded-r-lg right-1",
                                    !isBarStart && "border-l-0",
                                    !isBarEnd && "border-r-0",
                                    (isBarStart || isBarEnd) && "border",
                                    !isBarStart && !isBarEnd && "border-y",
                                    "shadow-md cursor-pointer hover:brightness-110 transition-all duration-300"
                                  )}
                                >
                                  {isBarStart && (
                                    <span className="text-xs font-semibold truncate mix-blend-plus-lighter opacity-90 px-3">{task.taskname}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- ToDo Component ----
function ToDoList() {
  const { tasks, isLoading } = useTasks();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysTasks = tasks.map(task => ({
    ...task,
    activeSubtasks: task.subtasks.filter(st => {
      const taskStart = new Date(task.start);
      taskStart.setHours(0, 0, 0, 0);
      return taskStart.getTime() <= today.getTime() && st.status !== 'Completed';
    })
  })).filter(task => task.activeSubtasks.length > 0);

  return (
    <div className="bg-neutral-900 border border-neutral-800/50 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col h-full max-h-[600px] overflow-hidden">
      <h2 className="text-xl font-bold text-white mb-6">Things to do today</h2>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <CircleDashed className="animate-spin text-neutral-500 w-6 h-6" />
          </div>
        ) : todaysTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-neutral-500">
            <CheckCircle2 size={32} className="mb-3 opacity-20" />
            <p>All caught up for today!</p>
          </div>
        ) : (
          todaysTasks.map(task => (
            <div key={task.id} className="p-4 rounded-2xl bg-neutral-950/50 border border-neutral-800/50 hover:border-neutral-700/50 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-neutral-200 group-hover:text-white transition-colors">{task.taskname}</h3>
                  <span className={cn(
                    "inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded border",
                    CATEGORY_COLORS[task.category]
                  )}>
                    {task.category}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {task.activeSubtasks.map(st => (
                  <div key={st.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-neutral-800/40 transition-colors cursor-pointer text-neutral-400 hover:text-neutral-200 group/item">
                    <CircleDashed size={16} className="mt-0.5 flex-shrink-0 group-hover/item:text-indigo-400 transition-colors" />
                    <span className="text-sm">{st.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==== MAIN DASHBOARD PAGE ====
export default function Dashboard() {
  return (
    <div className="h-full flex flex-col p-8 gap-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 overflow-hidden">
      <header className="flex-shrink-0">
        <h1 className="text-4xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
          Dashboard
        </h1>
        <p className="text-neutral-400 mt-2 text-lg">Welcome back. Here's what's happening today.</p>
      </header>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-8 min-h-0">
        <GanttChart />
        <ToDoList />
      </div>
    </div>
  );
}
