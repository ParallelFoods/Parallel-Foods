export type TaskStatus = 'Not Started' | 'In Progress' | 'Almost Ready' | 'Done' | 'Completed';
export type Category = 'Development' | 'Design' | 'Marketing' | 'Management';

export interface Subtask {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface Task {
  id: string;
  taskname: string;
  category: Category;
  start: Date;
  end: Date;
  status: TaskStatus;
  subtasks: Subtask[];
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    taskname: 'Design Database Schema',
    category: 'Design',
    start: addDays(today, -2),
    end: addDays(today, 1),
    status: 'In Progress',
    subtasks: [
      { id: 's1-1', title: 'Define tables and relationships', status: 'Completed' },
      { id: 's1-2', title: 'Review with engineering team', status: 'Not Started' },
    ],
  },
  {
    id: 't2',
    taskname: 'Implement Auth Endpoints',
    category: 'Development',
    start: today,
    end: addDays(today, 3),
    status: 'Not Started',
    subtasks: [
      { id: 's2-1', title: 'Setup NextAuth', status: 'Not Started' },
      { id: 's2-2', title: 'Create login/register pages', status: 'Not Started' },
      { id: 's2-3', title: 'Test authentication flow', status: 'Not Started' },
    ],
  },
  {
    id: 't3',
    taskname: 'Marketing Launch Strategy',
    category: 'Marketing',
    start: addDays(today, 1),
    end: addDays(today, 5),
    status: 'Not Started',
    subtasks: [
      { id: 's3-1', title: 'Identify target audience', status: 'Not Started' },
      { id: 's3-2', title: 'Draft social media posts', status: 'Not Started' },
    ],
  },
  {
    id: 't4',
    taskname: 'Q1 Performance Review',
    category: 'Management',
    start: addDays(today, -5),
    end: addDays(today, -1),
    status: 'Done' as TaskStatus,
    subtasks: [
      { id: 's4-1', title: 'Collect team feedback', status: 'Completed' },
      { id: 's4-2', title: 'Finalize report', status: 'Completed' },
    ],
  },
  {
    id: 't5',
    taskname: 'Optimize Landing Page Performance',
    category: 'Development',
    start: addDays(today, 2),
    end: addDays(today, 7),
    status: 'Not Started',
    subtasks: [
      { id: 's5-1', title: 'Audit bundle size', status: 'Not Started' },
      { id: 's5-2', title: 'Implement image optimization', status: 'Not Started' },
    ],
  },
  {
    id: 't6',
    taskname: 'Design Onboarding Flow',
    category: 'Design',
    start: today,
    end: addDays(today, 4),
    status: 'In Progress',
    subtasks: [
      { id: 's6-1', title: 'Create wireframes', status: 'Completed' },
      { id: 's6-2', title: 'Design high-fidelity mockups', status: 'In Progress' },
    ],
  },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Development: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Design: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Marketing: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Management: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export const CATEGORY_BG_COLORS: Record<Category, string> = {
  Development: 'bg-blue-500',
  Design: 'bg-purple-500',
  Marketing: 'bg-emerald-500',
  Management: 'bg-amber-500',
};

export const KANBAN_COLUMNS: TaskStatus[] = ['Not Started', 'In Progress', 'Almost Ready', 'Done'];

export const STATUS_STYLES: Record<string, string> = {
  'Not Started': 'bg-neutral-800/50 text-neutral-400 border border-neutral-700/50',
  'In Progress': 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  'Almost Ready': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'Done': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Completed': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

export const COLUMN_STYLES: Record<string, { header: string; dot: string }> = {
  'Not Started': { header: 'text-neutral-400', dot: 'bg-neutral-500' },
  'In Progress': { header: 'text-indigo-400', dot: 'bg-indigo-500' },
  'Almost Ready': { header: 'text-amber-400', dot: 'bg-amber-500' },
  'Done': { header: 'text-emerald-400', dot: 'bg-emerald-500' },
};
