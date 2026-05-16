const API_BASE = 'http://localhost:5000/api';

export type TaskData = {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee_name?: string;
  assignee_avatar?: string;
  due_date?: string;
  tags?: string[];
  project_id?: number;
  assignee?: {
    name?: string;
    avatar?: string;
  };
  dueDate?: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  color: string;
  task_count: number;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: number;
  project_id: number | null;
  project_name: string | null;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee_name: string;
  assignee_avatar: string;
  due_date: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type ProjectData = {
  name: string;
  description?: string;
  color?: string;
};

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch(`${API_BASE}/tasks`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const fetchTask = async (id: number): Promise<Task> => {
  const res = await fetch(`${API_BASE}/tasks/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const createTask = async (data: TaskData): Promise<Task> => {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const updateTask = async (id: number, data: Partial<TaskData>): Promise<Task> => {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
};

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await fetch(`${API_BASE}/projects`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};

export const createProject = async (data: ProjectData): Promise<Project> => {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
};
