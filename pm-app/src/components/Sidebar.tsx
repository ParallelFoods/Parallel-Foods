'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Calendar, ChevronRight, Settings, Users, LogOut, Plus } from 'lucide-react';
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
        { name: 'Calendar', href: '/calendar', icon: Calendar },
    ];

    const bottomItems = [
        { name: 'Team', href: '#', icon: Users },
        { name: 'Settings', href: '#', icon: Settings },
    ];

    return (
        <>
            <aside className="w-64 bg-[#0a0a0a] border-r border-neutral-800/60 flex flex-col justify-between h-full relative z-20 shadow-2xl">
                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                    {/* Logo Area */}
                    <div className="p-6 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md z-10 border-b border-neutral-800/40">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                                Parallel Foods
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-1">
                        {/* Add New Task Button */}
                        <div className="mb-6 px-2">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                            >
                                <Plus size={18} />
                                <span>Add New Task</span>
                            </button>
                        </div>

                        <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 mt-4">Overview</p>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                        isActive
                                            ? "bg-neutral-800/80 text-white"
                                            : "text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} className={cn(
                                            "transition-colors",
                                            isActive ? "text-indigo-400" : "text-neutral-500 group-hover:text-neutral-300"
                                        )} />
                                        <span className="font-medium text-sm">{item.name}</span>
                                    </div>
                                    {isActive && <ChevronRight size={14} className="text-neutral-600" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-neutral-800/60 bg-neutral-900/20 mt-auto">
                    <div className="space-y-1 mb-4">
                        {bottomItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200 transition-colors group"
                            >
                                <item.icon size={18} className="text-neutral-500 group-hover:text-neutral-300" />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* User Profile Snippet */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/30 border border-neutral-800/50 hover:bg-neutral-800/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-inner cursor-pointer relative overflow-hidden">
                                <span className="relative z-10">NJ</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-neutral-200 leading-none mb-1">NJ Park</span>
                                <span className="text-[10px] text-neutral-500 leading-none">Founder</span>
                            </div>
                        </div>
                        <LogOut size={14} className="text-neutral-600 group-hover:text-rose-400 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* Modal */}
            <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
