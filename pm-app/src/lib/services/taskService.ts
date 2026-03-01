import { supabase } from '../supabase/client';
import { Task, Subtask, Category, TaskStatus } from '../data';

// A temporary hardcoded org_id for development until auth is integrated
const ACTIVE_ORG_ID = '2251b6f8-976b-4ce0-bc10-44a728ec8afc'; // Wait, let me just fetch all since RLS is loose or we can just fetch without org_id filter if RLS allows. Actually, let's just fetch all tasks for now.

export const taskService = {
    async getTasks(): Promise<Task[]> {
        const { data: tasksData, error: tasksError } = await supabase
            .from('pm_tasks')
            .select('*')
            .order('start_date', { ascending: true });

        if (tasksError) throw tasksError;

        const { data: subtasksData, error: subtasksError } = await supabase
            .from('pm_subtasks')
            .select('*');

        if (subtasksError) throw subtasksError;

        // Map database rows to frontend Task interface
        return tasksData.map((t) => ({
            id: t.id,
            taskname: t.taskname,
            category: t.category as Category,
            start: new Date(t.start_date + 'T00:00:00'),
            end: new Date(t.end_date + 'T00:00:00'),
            status: t.status as TaskStatus,
            subtasks: subtasksData
                .filter((st) => st.task_id === t.id)
                .map((st) => ({
                    id: st.id,
                    title: st.title,
                    status: st.status as TaskStatus,
                })),
        }));
    },

    async updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
        const { error } = await supabase
            .from('pm_tasks')
            .update({ status })
            .eq('id', taskId);

        if (error) throw error;
    },

    async updateSubtaskStatus(subtaskId: string, status: TaskStatus): Promise<void> {
        const { error } = await supabase
            .from('pm_subtasks')
            .update({ status })
            .eq('id', subtaskId);

        if (error) throw error;
    },

    async addTask(task: Omit<Task, 'id' | 'subtasks'>, orgId?: string): Promise<Task> {
        const { data, error } = await supabase
            .from('pm_tasks')
            .insert({
                org_id: orgId || null,
                taskname: task.taskname,
                category: task.category,
                status: task.status,
                start_date: task.start.toISOString().split('T')[0],
                end_date: task.end.toISOString().split('T')[0],
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            taskname: data.taskname,
            category: data.category as Category,
            start: new Date(data.start_date + 'T00:00:00'),
            end: new Date(data.end_date + 'T00:00:00'),
            status: data.status as TaskStatus,
            subtasks: [],
        };
    }
};
