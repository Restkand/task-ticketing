"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardHeader} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle, Loader } from "lucide-react";
import TaskStatusModal from "@/components/taskStatusModal";

export default function Home() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<
    { id: number; title: string; status: string; dueDate: string; assignedTo: number; description?: string; createdAt: string; updatedAt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTask, setSelectedTask] = useState<{
    id: number;
    title: string;
    status: string;
    dueDate: string;
    assignedTo: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const handleFilter = (status: string | null) => {
    setFilterStatus(status);
  };
  

  const handleEditClick = (task: { id: number; title: string; status: string; dueDate: string; assignedTo: number; description?: string; createdAt: string; updatedAt: string }) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  // const updateTaskStatus = async (taskId: number, newStatus: string) => {
  //   try {
  //     const res = await fetch(`/api/tasks/${taskId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ status: newStatus }),
  //     });
  
  //     if (!res.ok) {
  //       throw new Error("Failed to update task status");
  //     }
  
  //     // Setelah berhasil mengupdate status di server, update state local
  //     const updatedTask = await res.json();
  //     const updatedTasks = tasks.map((task) =>
  //       task.id === taskId ? updatedTask : task
  //     );
  //     setTasks(updatedTasks);
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   } catch (error) {
  //     setError("Error updating task status");
  //   }
  // };  

  const handleUpdateTask = async (taskId: number, newStatus: string) => {
    try {
      const updatedTask = tasks.find((task) => task.id === taskId);
  
      if (!updatedTask) return;
  
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatedTask.id,
          title: updatedTask.title,
          description: updatedTask.description,
          status: newStatus,
          assignedTo: updatedTask.assignedTo,
          dueDate: updatedTask.dueDate,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
  
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = await response.json();
  
      // Update local state after successful update
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task");
    }
  };   

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      async function fetchTasks() {
        try {
          setLoading(true);
          const res = await fetch("/api/tasks", {
            headers: { "user-id": session?.user?.id?.toString() || "" }, // Menggunakan ID dari session
          });

          if (!res.ok) {
            throw new Error("Failed to fetch tasks");
          }

          const data = await res.json();
          setTasks(data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred");
          }
        } finally {
          setLoading(false);
        }
      }

      fetchTasks();
    }
  }, [session?.user?.id, status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <p>You are not signed in</p>
        <Button onClick={() => signIn()}>Sign In</Button>
      </div>
    );
  }

  const completedTasks = tasks.filter(
    (task) => task.assignedTo === session.user?.id && task.status === "Completed"
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.assignedTo === session.user?.id && task.status === "Pending"
  ).length;
  const newAssignedTasks = tasks.filter(
    (task) => task.assignedTo === session.user?.id && task.status === "New Assigned"
  ).length;
  const onProgressTasks = tasks.filter(
    (task) => task.assignedTo === session.user?.id && task.status === "On Progress"
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {session.user.name}!</h1>
        <Button onClick={() => handleFilter(null)}>Show All Tasks</Button>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition" onClick={() => handleFilter("New Assigned")}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <AlertTriangle className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">New Assigned</p>
                <p className="text-xl font-bold">{newAssignedTasks}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition" onClick={() => handleFilter("On Progress")}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Loader className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">On Progress</p>
                <p className="text-xl font-bold">{onProgressTasks}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition" onClick={() => handleFilter("Completed")}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-xl font-bold">{completedTasks}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-lg transition" onClick={() => handleFilter("Pending")}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-xl font-bold">{pendingTasks}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Task List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Tasks</h2>
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : tasks.length > 0 ? (
          <ul className="space-y-4">
            {tasks
              .filter((task) => task.assignedTo === session.user?.id)
              .filter((task) => (filterStatus ? task.status === filterStatus : true)) // Tambahkan kondisi filter
              .map((task) => (
                <li
                  key={task.id}
                  className="p-4 border rounded flex flex-col space-y-2 cursor-pointer hover:shadow-md transition"
                  onClick={() => handleEditClick(task)} // Memunculkan pop-up saat item diklik
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{task.title}</span>
                    <span
                      className={`px-3 py-1 rounded ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{task.description || "No description provided"}</p>
                  <div className="text-sm text-gray-500">
                    Due Date: {task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">
                    Created at: {format(new Date(task.createdAt), "yyyy-MM-dd HH:mm")} | Updated at:{" "}
                    {format(new Date(task.updatedAt), "yyyy-MM-dd HH:mm")}
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tasks assigned to you yet.</p>
        )}

        {/* Render Modal */}
        {selectedTask && (
          <TaskStatusModal
            task={selectedTask}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onUpdate={handleUpdateTask}
          />
        )}
      </div>
    </div>
  );
}