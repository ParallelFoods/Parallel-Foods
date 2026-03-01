'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, CalendarDays, Activity, Plus } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import AddTaskModal from './AddTaskModal';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Tasks', href: '/tasks', icon: CheckSquare },
        { name: 'Calendar', href: '/calendar', icon: CalendarDays },
    ];

    return (
        <aside className="w-64 h-full bg-neutral-950 flex flex-col p-6 text-neutral-400">
            <div className="flex items-center gap-3 mb-10 pl-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <Activity size={18} strokeWidth={3} />
                </div>
                <h1 className="text-xl font-bold text-neutral-100 tracking-tight">Parallel</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group',
                                isActive
                                    ? 'bg-neutral-800/80 text-white shadow-md'
                                    : 'hover:bg-neutral-900 hover:text-neutral-200'
                            )}
                        >
                            <item.icon
                                size={20}
                                className={cn(
                                    'transition-colors duration-300',
                                    isActive ? 'text-indigo-400' : 'text-neutral-500 group-hover:text-neutral-300'
                                )}
                            />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-8 mb-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white py-3 rounded-2xl font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Add New Task</span>
                </button>
            </div>

            <div className="mt-auto px-4 py-3 text-xs bg-neutral-900/50 rounded-2xl border border-neutral-800/50">
                <p className="text-neutral-500">Parallel Foods LLC</p>
                <p className="text-neutral-600 mt-1">Version 1.0.0</p>
            </div>

            <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </aside>
    );
}
