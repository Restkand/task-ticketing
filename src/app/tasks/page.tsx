"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";
import { isSameDay, parseISO, format } from "date-fns";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assignedTo: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
}

interface User {
  id: number;
  name: string;
}

export default function TasksPage() {
  const [isAddTaskOpen, setAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setEditTaskOpen] = useState(false); // Modal edit task
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Task yang dipilih untuk diedit

  // Filter states
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const addTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
  
      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setAddTaskOpen(false);
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
  
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
        setEditTaskOpen(false);
        setSelectedTask(null);
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Filter tasks based on date and status
  const filteredTasks = tasks.filter((task) => {
    const matchesDate =
      filterDate === "" ||
      isSameDay(parseISO(task.createdAt), parseISO(filterDate));
    const matchesStatus = filterStatus === "" || task.status === filterStatus;
    return matchesDate && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <Button onClick={() => setAddTaskOpen(true)}>Add New Task</Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium">Filter by Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">All Status</option>
            <option value="New Assigned">New Assigned</option>
            <option value="Pending">Pending</option>
            <option value="On Progress">On Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="p-4 border rounded flex flex-col space-y-2 cursor-pointer"
            onClick={() => {
              setSelectedTask(task);
              setEditTaskOpen(true);
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">{task.title}</span>
              <span
                className={`px-3 py-1 rounded ${
                  task.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{task.description}</p>
            <div className="text-sm text-gray-500">
              Due Date: {format(new Date(task.dueDate), "yyyy-MM-dd")}
            </div>
            <div className="text-sm text-gray-500">
              Assigned to:{" "}
              {
                users.find((user) => user.id === task.assignedTo)?.name || "Unknown"
              }{" "}
              | Created by:{" "}
              {
                users.find((user) => user.id === task.createdBy)?.name || "Unknown"
              }
            </div>
            <div className="text-xs text-gray-400">
              Created at: {format(new Date(task.createdAt), "yyyy-MM-dd HH:mm")} |
              Updated at: {format(new Date(task.updatedAt), "yyyy-MM-dd HH:mm")}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for Adding Task */}
      <Modal
        isOpen={isAddTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        title="Add New Task"
      >
        <TaskForm
          users={users}
          onSubmit={(task) => addTask(task)}
        />
      </Modal>

      {/* Modal for Editing Task */}
      {selectedTask && (
        <Modal
          isOpen={isEditTaskOpen}
          onClose={() => {
            setEditTaskOpen(false);
            setSelectedTask(null);
          }}
          title="Edit Task"
        >
          <TaskForm
            users={users}
            initialData={selectedTask}
            onSubmit={(task) => {
              if (selectedTask) {
                updateTask({ ...selectedTask, ...task });
              }
            }}
            onDelete={() => {
              deleteTask(selectedTask.id);
              setEditTaskOpen(false);
              setSelectedTask(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

function TaskForm({
  users,
  onSubmit,
  initialData,
  onDelete,
}: {
  users: User[];
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  initialData?: Task;
  onDelete?: () => void;
}) {
  const isEditMode = Boolean(initialData); // Tentukan mode (edit jika initialData tersedia)
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState(initialData?.status || "New Assigned");
  const [assignedTo, setAssignedTo] = useState<number | null>(initialData?.assignedTo || null);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || ""); // Tambahkan state untuk dueDate
  const [createdBy] = useState(initialData?.createdBy || 4); // Assume ID 4 sebagai pengguna saat ini

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim() && assignedTo !== null && dueDate) {
      const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
        title,
        description,
        status,
        assignedTo: assignedTo!,
        createdBy,
        dueDate, // Sertakan dueDate
      };
      onSubmit(taskData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="New Assigned">New Assigned</option>
        <option value="Pending">Pending</option>
        <option value="On Progress">On Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <select
        value={assignedTo ?? ""}
        onChange={(e) => setAssignedTo(Number(e.target.value))}
        className="w-full p-2 border rounded"
        required
      >
        <option value="" disabled>
          Select User
        </option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        placeholder="Due Date"
        className="w-full p-2 border rounded"
        // required
      />
      <div className="flex space-x-2">
        <Button type="submit" className="w-full">
          {isEditMode ? "Update Task" : "Add Task"}
        </Button>
        {isEditMode && onDelete && (
          <Button
            type="button"
            onClick={onDelete}
            className="bg-red-500 w-full"
          >
            Delete Task
          </Button>
        )}
      </div>
    </form>
  );
}
