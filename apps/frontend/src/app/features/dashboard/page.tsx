"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/lib/auth/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, LogOut, Loader2, Folder } from "lucide-react";

// Types
type Project = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  taskCount: number;
};

const PROJECTS_KEY = "mock_projects";

// Helpers
function getProjects(userId: string): Project[] {
  const stored = localStorage.getItem(PROJECTS_KEY);
  const allProjects: Project[] = stored ? JSON.parse(stored) : [];
  return allProjects.filter((p) => p.userId === userId);
}

function saveProject(project: Project) {
  const stored = localStorage.getItem(PROJECTS_KEY);
  const allProjects: Project[] = stored ? JSON.parse(stored) : [];
  localStorage.setItem(PROJECTS_KEY, JSON.stringify([project, ...allProjects]));
}

// Component
export default function Dashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    setProjects(getProjects(user.id));
    setLoading(false);
  }, [user, router]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newProject.name.trim()) return;

    setCreating(true);

    const project: Project = {
      id: crypto.randomUUID(),
      name: newProject.name.trim(),
      description: newProject.description.trim() || undefined,
      userId: user.id,
      createdAt: new Date().toISOString(),
      taskCount: 0,
    };

    saveProject(project);
    setProjects((prev) => [project, ...prev]);
    setNewProject({ name: "", description: "" });
    setIsDialogOpen(false);
    setCreating(false);
    toast.success("Project created");
  };

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully");
    router.push("/auth");
  };


  // UI

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary flex items-center justify-center">
              <Image
                src="https://res.cloudinary.com/dxvf9uqwe/image/upload/v1770028108/woldreamz_cover_j50v3r.jpg"
                alt="Taskflow logo"
                width={200}
                height={300}
                priority
                className=""
              />
            </div>
            <span className="font-semibold text-lg">TaskFlow</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Manage your projects and tasks
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
                <Input
                  placeholder="Project name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
                <Textarea
                  placeholder="Optional description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
                <Button type="submit" disabled={creating} className="w-full">
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Folder className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
              <p className="mb-4 text-muted-foreground">No projects yet</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-lg border border-[#dce2e5]"
                onClick={() => router.push(`/features/project/${project.id}`)}
              >
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  {project.description && (
                    <CardDescription>{project.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {project.taskCount} tasks •{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
