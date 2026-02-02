"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Circle,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";

/* ------------------------
   Types
------------------------ */

export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  projectId: string;
  status: TaskStatus;
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
};

/* ------------------------
   Storage keys
------------------------ */

const PROJECTS_KEY = "mock_projects";
const TASKS_KEY = "mock_tasks";

/* ------------------------
   Helpers
------------------------ */

function getProjectById(id: string): Project | null {
  const stored = localStorage.getItem(PROJECTS_KEY);
  const projects: Project[] = stored ? JSON.parse(stored) : [];
  return projects.find((p) => p.id === id) || null;
}

function getTasksByProject(projectId: string): Task[] {
  const stored = localStorage.getItem(TASKS_KEY);
  const tasks: Task[] = stored ? JSON.parse(stored) : [];
  return tasks.filter((t) => t.projectId === projectId);
}

function saveTask(task: Task) {
  const stored = localStorage.getItem(TASKS_KEY);
  const tasks: Task[] = stored ? JSON.parse(stored) : [];
  localStorage.setItem(TASKS_KEY, JSON.stringify([task, ...tasks]));
}

function updateTaskStatus(taskId: string, status: TaskStatus) {
  const stored = localStorage.getItem(TASKS_KEY);
  const tasks: Task[] = stored ? JSON.parse(stored) : [];

  const updated = tasks.map((t) => (t.id === taskId ? { ...t, status } : t));

  localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
  return updated;
}

/* ------------------------
   UI Config
------------------------ */

const statusConfig: Record<TaskStatus, { label: string; icon: typeof Circle }> =
  {
    todo: { label: "To Do", icon: Circle },
    in_progress: { label: "In Progress", icon: Clock },
    done: { label: "Done", icon: CheckCircle2 },
  };

/* ------------------------
   Component
------------------------ */

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

// Load project + tasks


  useEffect(() => {
    if (!projectId) return;

    const project = getProjectById(projectId);

    if (!project) {
      router.replace("/dashboard");
      return;
    }

    setProject(project);
    setTasks(getTasksByProject(projectId));
    setLoading(false);
  }, [projectId, router]);

//  Create task


  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setCreating(true);

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title.trim(),
      description: newTask.description.trim() || null,
      projectId,
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    saveTask(task);
    setTasks((prev) => [task, ...prev]);

    setNewTask({ title: "", description: "" });
    setIsDialogOpen(false);
    setCreating(false);

    toast.success("Task created");
  };

//   Update status


  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    const updated = updateTaskStatus(taskId, status);
    setTasks(updated.filter((t) => t.projectId === projectId));
    toast.success("Status updated");
  };

//   Group tasks


  const tasksByStatus: Record<TaskStatus, Task[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

//  Loading


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

// UI


  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("features/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-xl font-semibold truncate">{project?.name}</h1>
            {project?.description && (
              <p className="text-sm text-muted-foreground truncate">
                {project.description}
              </p>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateTask} className="space-y-4 mt-4">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, title: e.target.value }))
                  }
                  required
                />
                <Textarea
                  placeholder="Optional description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
                <Button className="w-full" disabled={creating}>
                  {creating ? "Creating..." : "Create Task"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(Object.keys(tasksByStatus) as TaskStatus[]).map((status) => {
            const StatusIcon = statusConfig[status].icon;

            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center gap-2">
                  <StatusIcon className="h-4 w-4" />
                  <span className="font-medium">
                    {statusConfig[status].label}
                  </span>
                  <Badge className="ml-auto">
                    {tasksByStatus[status].length}
                  </Badge>
                </div>

                {tasksByStatus[status].map((task) => (
                  <Card key={task.id}>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">{task.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      {task.description && (
                        <p className="text-xs text-muted-foreground">
                          {task.description}
                        </p>
                      )}

                      <Select
                        value={task.status}
                        onValueChange={(value) =>
                          handleStatusChange(task.id, value as TaskStatus)
                        }
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
