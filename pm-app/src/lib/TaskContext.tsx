'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus } from './data';
import { taskService } from './services/taskService';

interface TaskContextType {
    tasks: Task[];
    isLoading: boolean;
    error: Error | null;
    addTask: (task: Omit<Task, 'id' | 'subtasks'>) => Promise<void>;
    updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
    refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await taskService.getTasks();
            setTasks(data);
        } catch (err: any) {
            setError(err);
            console.error('Failed to load tasks', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async (taskData: Omit<Task, 'id' | 'subtasks'>) => {
        try {
            const newTask = await taskService.addTask(taskData);
            setTasks(prev => [...prev, newTask]);
        } catch (err: any) {
            console.error('Failed to add task', err);
            throw err;
        }
    };

    const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
        try {
            await taskService.updateTaskStatus(taskId, status);
        } catch (err: any) {
            console.error('Failed to update task status', err);
            // Revert on failure by refreshing
            fetchTasks();
            throw err;
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, isLoading, error, addTask, updateTaskStatus, refreshTasks: fetchTasks }}>
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
