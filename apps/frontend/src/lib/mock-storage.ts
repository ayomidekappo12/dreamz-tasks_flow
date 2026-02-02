
// Types

export type TaskStatus = "todo" | "in_progress" | "done";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  user_id: string;
  status: TaskStatus;
  created_at: string;
};

// Storage Keys

const PROJECTS_KEY = "mock_projects";
const TASKS_KEY = "mock_tasks";

// Internal Helpers

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function write<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Projects

export function getProjects(userId: string): Project[] {
  return read<Project>(PROJECTS_KEY).filter((p) => p.user_id === userId);
}

export function getProjectById(projectId: string): Project | null {
  return read<Project>(PROJECTS_KEY).find((p) => p.id === projectId) ?? null;
}

export function createProject(project: Project) {
  write(PROJECTS_KEY, [project, ...read<Project>(PROJECTS_KEY)]);
}

export function deleteProject(projectId: string) {
  // delete project
  write(
    PROJECTS_KEY,
    read<Project>(PROJECTS_KEY).filter((p) => p.id !== projectId),
  );

  // cascade delete tasks
  write(
    TASKS_KEY,
    read<Task>(TASKS_KEY).filter((t) => t.project_id !== projectId),
  );
}

// Tasks

export function getTasksByProject(projectId: string): Task[] {
  return read<Task>(TASKS_KEY).filter((t) => t.project_id === projectId);
}

export function createTask(task: Task) {
  write(TASKS_KEY, [task, ...read<Task>(TASKS_KEY)]);
}

export function updateTaskStatus(taskId: string, status: TaskStatus): Task[] {
  const updated = read<Task>(TASKS_KEY).map((t) =>
    t.id === taskId ? { ...t, status } : t,
  );

  write(TASKS_KEY, updated);
  return updated;
}
