'use client';

import { CATEGORY_BG_COLORS, Task } from '@/lib/data';
import { useTasks } from '@/lib/TaskContext';
import { format, differenceInDays, addDays, startOfDay } from 'date-fns';
import { useRef, useEffect } from 'react';

const OVERALL_START_OFFSET = -5;
const TOTAL_DAYS = 30;
const DAY_WIDTH = 64; // w-16 = 4rem = 64px
const NAME_COL_WIDTH = 160; // px

// Group consecutive days by a key (year or month label)
function groupDays(days: Date[], getKey: (d: Date) => string): { key: string; count: number }[] {
    const groups: { key: string; count: number }[] = [];
    for (const day of days) {
        const key = getKey(day);
        if (groups.length > 0 && groups[groups.length - 1].key === key) {
            groups[groups.length - 1].count++;
        } else {
            groups.push({ key, count: 1 });
        }
    }
    return groups;
}

export default function GanttChart() {
    const { tasks } = useTasks();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const today = startOfDay(new Date());
    const chartStart = addDays(today, OVERALL_START_OFFSET);
    const chartEnd = addDays(chartStart, TOTAL_DAYS);
    const days = Array.from({ length: TOTAL_DAYS }).map((_, i) => addDays(chartStart, i));

    const yearGroups = groupDays(days, d => format(d, 'yyyy'));
    const monthGroups = groupDays(days, d => format(d, 'MMMM yyyy'));

    useEffect(() => {
        if (scrollContainerRef.current) {
            const todayIndex = OVERALL_START_OFFSET * -1;
            const targetScroll = (todayIndex * DAY_WIDTH) - (scrollContainerRef.current.clientWidth / 2) + (DAY_WIDTH / 2) + NAME_COL_WIDTH;
            scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
    }, []);

    const getPositionStyles = (start: Date, end: Date) => {
        const taskStart = startOfDay(start);
        const taskEnd = startOfDay(end);

        let renderStart = taskStart;
        let renderEnd = taskEnd;

        if (taskEnd < chartStart || taskStart > chartEnd) return { display: 'none' };
        if (taskStart < chartStart) renderStart = chartStart;
        if (taskEnd > chartEnd) renderEnd = chartEnd;

        const startOffsetDays = differenceInDays(renderStart, chartStart);
        const durationDays = differenceInDays(renderEnd, renderStart) + 1;

        return {
            left: `${(startOffsetDays * DAY_WIDTH) + NAME_COL_WIDTH}px`,
            width: `${durationDays * DAY_WIDTH - 8}px`,
        };
    };

    return (
        <div className="flex flex-col w-full h-full bg-neutral-900 border border-neutral-800/50 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
            <div className="p-6 border-b border-neutral-800/50 bg-neutral-900/80 sticky top-0 z-20 backdrop-blur-md flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Project Timeline</h2>
                    <p className="text-neutral-400 mt-1">Visualize your team's progress</p>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-x-auto overflow-y-auto relative no-scrollbar"
            >
                <div className="min-w-max pb-8">
                    {/* ── HEADER ROWS ── */}
                    <div className="sticky top-0 z-10 bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800">

                        {/* Row 1: YEAR */}
                        <div className="flex border-b border-neutral-800/60">
                            {/* Sticky Task label spanning all 3 header rows — solved by using a multi-row grid; here we just set a wider padding */}
                            <div className="w-[160px] flex-shrink-0 border-r border-neutral-800 px-4 py-2 sticky left-0 z-20 bg-neutral-900/95 backdrop-blur-xl flex items-center">
                                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Year</span>
                            </div>
                            {yearGroups.map((g, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 border-r border-neutral-800/50 py-2 relative overflow-visible"
                                    style={{ width: `${g.count * DAY_WIDTH}px` }}
                                >
                                    {/* Sticky label: clamps to the left edge of the task column */}
                                    <span
                                        className="sticky text-sm font-bold text-neutral-200 px-3"
                                        style={{ left: `${NAME_COL_WIDTH}px` }}
                                    >
                                        {g.key}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Row 2: MONTH */}
                        <div className="flex border-b border-neutral-800/60">
                            <div className="w-[160px] flex-shrink-0 border-r border-neutral-800 px-4 py-2 sticky left-0 z-20 bg-neutral-900/95 backdrop-blur-xl flex items-center">
                                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Month</span>
                            </div>
                            {monthGroups.map((g, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 border-r border-neutral-800/50 py-2 relative overflow-visible"
                                    style={{ width: `${g.count * DAY_WIDTH}px` }}
                                >
                                    {/* Sticky label: clamps to the left edge of the task column */}
                                    <span
                                        className="sticky text-sm font-semibold text-neutral-300 px-3"
                                        style={{ left: `${NAME_COL_WIDTH}px` }}
                                    >
                                        {g.key.split(' ')[0]}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Row 3: DAY + DATE */}
                        <div className="flex">
                            <div className="w-[160px] flex-shrink-0 border-r border-neutral-800 p-4 sticky left-0 z-20 bg-neutral-900/95 backdrop-blur-xl flex items-center">
                                <span className="text-sm font-medium text-neutral-400">Task</span>
                            </div>
                            {days.map((day, i) => {
                                const isToday = differenceInDays(day, today) === 0;
                                return (
                                    <div
                                        key={i}
                                        className={`w-16 flex-shrink-0 border-r border-neutral-800/50 flex flex-col items-center justify-center py-3 text-xs ${isToday ? 'bg-indigo-500/10' : ''}`}
                                    >
                                        <span className={`font-semibold ${isToday ? 'text-indigo-400' : 'text-neutral-500'}`}>
                                            {format(day, 'EEE')}
                                        </span>
                                        <span className={`text-lg mt-0.5 ${isToday ? 'text-indigo-300 font-bold' : 'text-neutral-300'}`}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── GRID ROWS / TASKS ── */}
                    <div className="relative pt-4 text-sm">
                        {/* Background Grid Lines */}
                        <div className="absolute inset-0 flex pointer-events-none">
                            <div className="w-[160px] flex-shrink-0" />
                            {days.map((day, i) => {
                                const isToday = differenceInDays(day, today) === 0;
                                return (
                                    <div key={i} className={`w-16 flex-shrink-0 border-r border-neutral-800/30 ${isToday ? 'bg-indigo-500/5' : ''}`} />
                                );
                            })}
                        </div>

                        {/* Task Items */}
                        <div className="relative z-10">
                            {tasks.map(task => (
                                <div key={task.id} className="group relative flex items-center h-14 hover:bg-neutral-800/20 transition-colors">
                                    <div className="w-[160px] flex-shrink-0 p-4 sticky left-0 z-20 bg-neutral-900 group-hover:bg-neutral-800/90 transition-colors border-r border-neutral-800 truncate pr-6">
                                        <span className="font-medium text-neutral-200 truncate block" title={task.taskname}>{task.taskname}</span>
                                    </div>

                                    {/* Task Bar */}
                                    <div
                                        className="absolute h-8 rounded-full top-3 flex items-center px-4 overflow-hidden transition-all duration-300 hover:brightness-110 shadow-lg"
                                        style={{ ...getPositionStyles(task.start, task.end) }}
                                    >
                                        <div className={`absolute inset-0 opacity-20 ${CATEGORY_BG_COLORS[task.category]}`} />
                                        <div className="absolute left-0 bottom-0 top-0 w-1 bg-white/20" />
                                        <span className="relative text-xs font-semibold text-white/90 truncate z-10 w-full">
                                            {task.status === 'Completed' ? '✓ ' + task.status : task.status}
                                        </span>
                                        <div className={`absolute inset-0 border border-white/10 rounded-full ${CATEGORY_BG_COLORS[task.category].replace('bg-', 'border-')}`} />
                                        <div className={`absolute inset-0 -z-10 ${CATEGORY_BG_COLORS[task.category]}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
