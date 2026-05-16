import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as api from '../services/api'
import { connectSocket } from '../services/socket'

type ThemeMode = 'light' | 'dark'
type DashboardView = 'cards' | 'list' | 'kanban'

interface UserProfile {
  name: string
  email: string
  avatarInitial: string
}

interface ProjectSummary {
  id: string
  name: string
  description: string
  color: string
  taskCount: number
}

interface TaskSummary {
  total: number
  completed: number
  pending: number
}

const normalizeQuery = (value: string) => value.trim().toLowerCase()

export const taskMatchesQuery = (task: AppTask, query: string) => {
  const normalized = normalizeQuery(query)
  if (!normalized) return true

  const haystack = [
    task.title,
    task.description,
    task.status,
    task.priority,
    task.assignee.name,
    task.assignee.avatar,
    task.dueDate,
    task.tags.join(' '),
    task.projectName,
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(normalized)
}

export interface AppTask {
  id: string
  projectId: string | null
  projectName: string | null
  title: string
  description: string
  status: 'To Do' | 'In Progress' | 'Done'
  priority: 'High' | 'Medium' | 'Low'
  assignee: { name: string; avatar: string }
  dueDate: string
  tags: string[]
}

export interface TaskFormData {
  title: string
  description: string
  projectId: string
  status: AppTask['status']
  priority: AppTask['priority']
  assignee: { name: string; avatar: string }
  dueDate: string
  tags: string[]
}

const taskToAppTask = (t: api.Task): AppTask => ({
  id: String(t.id),
  projectId: t.project_id !== null ? String(t.project_id) : null,
  projectName: t.project_name || null,
  title: t.title,
  description: t.description,
  status: (t.status as AppTask['status']) || 'To Do',
  priority: (t.priority as AppTask['priority']) || 'Medium',
  assignee: {
    name: t.assignee_name || '',
    avatar: t.assignee_avatar || '',
  },
  dueDate: t.due_date || '',
  tags: t.tags || [],
});

const taskFormDataToApiData = (data: Partial<TaskFormData>): Partial<api.TaskData> => ({
  ...(data.title !== undefined ? { title: data.title } : {}),
  ...(data.description !== undefined ? { description: data.description } : {}),
  ...(data.projectId !== undefined && data.projectId !== ''
    ? { project_id: Number(data.projectId) }
    : {}),
  ...(data.status !== undefined ? { status: data.status } : {}),
  ...(data.priority !== undefined ? { priority: data.priority } : {}),
  ...(data.assignee?.name !== undefined ? { assignee_name: data.assignee.name } : {}),
  ...(data.assignee?.avatar !== undefined ? { assignee_avatar: data.assignee.avatar } : {}),
  ...(data.dueDate !== undefined ? { due_date: data.dueDate || undefined } : {}),
  ...(data.tags !== undefined ? { tags: data.tags } : {}),
});

const computeSummary = (tasks: AppTask[]): TaskSummary => ({
  total: tasks.length,
  completed: tasks.filter((t) => t.status === 'Done').length,
  pending: tasks.filter((t) => t.status !== 'Done').length,
});

interface AppState {
  theme: ThemeMode
  toggleTheme: () => void
  user: UserProfile
  projects: ProjectSummary[]
  taskSummary: TaskSummary
  tasks: AppTask[]
  searchTerm: string
  activeProjectId: string
  dashboardView: DashboardView
  hideCompletedInDashboard: boolean
  loading: boolean
  addTask: (task: AppTask) => void
  updateTask: (id: string, data: Partial<AppTask>) => void
  removeTask: (id: string) => void
  fetchTasks: () => Promise<void>
  fetchProjects: () => Promise<void>
  createTask: (data: TaskFormData) => Promise<void>
  editTask: (id: string, data: Partial<TaskFormData>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  createProject: (data: { name: string; description?: string; color?: string }) => Promise<void>
  setUser: (user: Partial<UserProfile>) => void
  clearUser: () => void
  setSearchTerm: (term: string) => void
  clearSearchTerm: () => void
  setDashboardView: (view: DashboardView) => void
  toggleHideCompletedInDashboard: () => void
  setActiveProjectId: (projectId: string) => void
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const socket = connectSocket();

      socket.on('task:updated', (updated: api.Task) => {
        const appTask = taskToAppTask(updated);
        set((state) => {
          const tasks = state.tasks.map((t) =>
            t.id === appTask.id ? appTask : t
          );
          return { tasks, taskSummary: computeSummary(tasks) };
        });
      });

      socket.on('task:deleted', ({ id }: { id: number }) => {
        const idStr = String(id);
        set((state) => {
          const tasks = state.tasks.filter((t) => t.id !== idStr);
          return { tasks, taskSummary: computeSummary(tasks) };
        });
      });

      return {
        theme: 'dark',
        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === 'dark' ? 'light' : 'dark',
          })),
        user: {
          name: '',
          email: '',
          avatarInitial: '',
        },
        projects: [],
        taskSummary: { total: 0, completed: 0, pending: 0 },
        tasks: [],
        searchTerm: '',
        activeProjectId: 'all',
        dashboardView: 'cards',
        hideCompletedInDashboard: false,
        loading: false,

        addTask: (task) =>
          set((state) => {
            const tasks = [task, ...state.tasks];
            return { tasks, taskSummary: computeSummary(tasks) };
          }),

        updateTask: (id, data) =>
          set((state) => {
            const tasks = state.tasks.map((t) =>
              t.id === id ? { ...t, ...data } : t
            );
            return { tasks, taskSummary: computeSummary(tasks) };
          }),

        removeTask: (id) =>
          set((state) => {
            const tasks = state.tasks.filter((t) => t.id !== id);
            return { tasks, taskSummary: computeSummary(tasks) };
          }),

        fetchTasks: async () => {
          set({ loading: true });
          try {
            const data = await api.fetchTasks();
            const tasks = data.map(taskToAppTask);
            set({ tasks, taskSummary: computeSummary(tasks), loading: false });
          } catch {
            set({ loading: false });
          }
        },

        fetchProjects: async () => {
          try {
            const data = await api.fetchProjects();
            const projects = data.map((project) => ({
              id: String(project.id),
              name: project.name,
              description: project.description,
              color: project.color,
              taskCount: project.task_count,
            }));
            set((state) => ({
              projects,
              activeProjectId:
                state.activeProjectId === 'all' && projects.length > 0
                  ? projects[0].id
                  : state.activeProjectId,
            }));
          } catch {
            set({ projects: [] });
          }
        },

        createTask: async (data) => {
          const created = await api.createTask(taskFormDataToApiData(data) as api.TaskData);
          const appTask = taskToAppTask(created);
          get().addTask(appTask);
        },

        editTask: async (id, data) => {
          const updated = await api.updateTask(Number(id), taskFormDataToApiData(data));
          const appTask = taskToAppTask(updated);
          get().updateTask(id, appTask);
        },

        deleteTask: async (id) => {
          await api.deleteTask(Number(id));
          get().removeTask(id);
        },
        createProject: async (data) => {
          const created = await api.createProject(data);
          const project = {
            id: String(created.id),
            name: created.name,
            description: created.description,
            color: created.color,
            taskCount: created.task_count,
          };
          set((state) => ({
            projects: [...state.projects, project],
            activeProjectId: project.id,
          }));
        },
        setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
        clearUser: () => set({ user: { name: '', email: '', avatarInitial: '' } }),
        setSearchTerm: (term) => set({ searchTerm: term }),
        clearSearchTerm: () => set({ searchTerm: '' }),
        setDashboardView: (view) => set({ dashboardView: view }),
        toggleHideCompletedInDashboard: () =>
          set((state) => ({ hideCompletedInDashboard: !state.hideCompletedInDashboard })),
        setActiveProjectId: (projectId) => set({ activeProjectId: projectId }),
      };
    },
    {
      name: 'devcollab-app-store',
      partialize: (state) => ({
        theme: state.theme,
        dashboardView: state.dashboardView,
        hideCompletedInDashboard: state.hideCompletedInDashboard,
      }),
    },
  ),
)

export default useAppStore
