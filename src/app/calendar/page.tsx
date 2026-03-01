'use client';

import { useState, useRef, useEffect } from 'react';
import { CATEGORY_BG_COLORS } from '@/lib/data';
import { useTasks } from '@/lib/TaskContext';
import {
    startOfMonth, endOfMonth, eachDayOfInterval,
    format, isSameMonth, isToday, getDay,
    addMonths, subMonths, setMonth, setYear,
} from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const YEAR_RANGE = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 3 + i);

export default function CalendarPage() {
    const { tasks } = useTasks();
    const [viewDate, setViewDate] = useState(new Date());
    const [pickerOpen, setPickerOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Close picker when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const firstDay = startOfMonth(viewDate);
    const lastDay = endOfMonth(viewDate);
    const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
    const startingDayIndex = getDay(firstDay);
    const paddingDays = Array.from({ length: startingDayIndex }).map((_, i) => `padding-${i}`);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const goToPrev = () => setViewDate(prev => subMonths(prev, 1));
    const goToNext = () => setViewDate(prev => addMonths(prev, 1));

    const handleMonthSelect = (monthIndex: number) => {
        setViewDate(prev => setMonth(prev, monthIndex));
        setPickerOpen(false);
    };

    const handleYearSelect = (year: number) => {
        setViewDate(prev => setYear(prev, year));
        setPickerOpen(false);
    };

    return (
        <div className="h-full flex flex-col p-8 gap-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 overflow-hidden">
            <header className="flex-shrink-0 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
                        Calendar
                    </h1>
                    <p className="text-neutral-400 mt-2 text-lg">Your monthly overview.</p>
                </div>

                {/* Month/Year Header + Navigation */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={goToPrev}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-neutral-700/50 bg-neutral-800/50 text-neutral-400 hover:text-white hover:bg-neutral-700/60 transition-all"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Today button */}
                    <button
                        onClick={() => setViewDate(new Date())}
                        className="px-4 py-2 rounded-xl border border-neutral-700/50 bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-700/60 transition-all text-sm font-medium"
                    >
                        Today
                    </button>

                    <div className="relative" ref={pickerRef}>
                        <button
                            onClick={() => setPickerOpen(prev => !prev)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-700/50 bg-neutral-800/40 hover:bg-neutral-700/50 transition-all group"
                        >
                            <span className="text-2xl font-bold tracking-tight text-neutral-200 group-hover:text-white transition-colors">
                                {format(viewDate, 'MMMM yyyy')}
                            </span>
                            <ChevronDown
                                size={18}
                                className={cn(
                                    "text-neutral-500 transition-transform duration-200",
                                    pickerOpen ? "rotate-180" : "rotate-0"
                                )}
                            />
                        </button>

                        {/* Dropdown Picker */}
                        {pickerOpen && (
                            <div className="absolute right-0 top-full mt-2 z-50 bg-neutral-900 border border-neutral-700/50 rounded-2xl shadow-2xl w-72 p-4 overflow-hidden">
                                {/* Year row */}
                                <div className="mb-4">
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-2 px-1">Year</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {YEAR_RANGE.map(year => (
                                            <button
                                                key={year}
                                                onClick={() => handleYearSelect(year)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                                                    viewDate.getFullYear() === year
                                                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                                                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                                )}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-neutral-800 mb-4" />

                                {/* Month grid */}
                                <div>
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-2 px-1">Month</p>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {MONTHS.map((month, i) => (
                                            <button
                                                key={month}
                                                onClick={() => handleMonthSelect(i)}
                                                className={cn(
                                                    "py-2 rounded-xl text-sm font-medium transition-all",
                                                    viewDate.getMonth() === i
                                                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                                )}
                                            >
                                                {month.slice(0, 3)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={goToNext}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-neutral-700/50 bg-neutral-800/50 text-neutral-400 hover:text-white hover:bg-neutral-700/60 transition-all"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </header>

            <div className="flex-1 bg-neutral-900 border border-neutral-800/50 rounded-3xl shadow-xl backdrop-blur-md flex flex-col overflow-hidden">
                {/* Days of week header */}
                <div className="grid grid-cols-7 border-b border-neutral-800/80 bg-neutral-950/40 flex-shrink-0">
                    {weekDays.map(day => (
                        <div key={day} className="py-4 text-center text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-auto bg-neutral-950/20">
                    {paddingDays.map(key => (
                        <div key={key} className="border-r border-b border-neutral-800/30 p-2 min-h-[120px] bg-neutral-950/40" />
                    ))}

                    {daysInMonth.map((day) => {
                        const isCurrentMonth = isSameMonth(day, viewDate);
                        const dayTasks = tasks.filter(task => {
                            const start = new Date(task.start);
                            start.setHours(0, 0, 0, 0);
                            const end = new Date(task.end);
                            end.setHours(23, 59, 59, 999);
                            return day >= start && day <= end;
                        });

                        return (
                            <div
                                key={day.toISOString()}
                                className={cn(
                                    "border-r border-b border-neutral-800/30 p-2 relative overflow-hidden transition-colors hover:bg-neutral-800/30 min-h-[120px] group flex flex-col",
                                    !isCurrentMonth ? "text-neutral-600 bg-neutral-950/40" : "text-neutral-200"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ml-1 mt-1 transition-all duration-300",
                                        isToday(day)
                                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 ring-4 ring-indigo-500/20"
                                            : "text-neutral-400 group-hover:text-white"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 px-1 pb-1">
                                    {dayTasks.map(task => (
                                        <div
                                            key={task.id}
                                            className={cn(
                                                "text-xs px-2 py-1 rounded w-full truncate border bg-opacity-20",
                                                CATEGORY_BG_COLORS[task.category].replace('bg-', 'bg-').replace('text-', 'text-').concat('/10 '),
                                                "border-" + CATEGORY_BG_COLORS[task.category].split('-')[1] + "-500/30",
                                                "text-" + CATEGORY_BG_COLORS[task.category].split('-')[1] + "-400"
                                            )}
                                            title={task.taskname}
                                        >
                                            {task.taskname}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
