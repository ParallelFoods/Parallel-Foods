'use client';

import React, { createContext, useContext, useState } from 'react';
import { Task, TaskStatus, MOCK_TASKS } from './data';

interface TaskContextType {
    tasks: Task[];
    addTask: (task: Task) => void;
    updateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

    const addTask = (task: Task) => {
        setTasks(prev => [...prev, task]);
    };

    const updateTaskStatus = (taskId: string, status: TaskStatus) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
}
