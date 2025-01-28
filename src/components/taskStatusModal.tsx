import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"; // Pastikan menggunakan komponen Dialog dari ShadCN
import { Button } from "@/components/ui/button"; // Gunakan Button dari ShadCN

interface Task {
  id: number;
  title: string;
  status: string;
}

interface TaskStatusModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, status: string) => void;
}

const TaskStatusModal: React.FC<TaskStatusModalProps> = ({ task, isOpen, onClose, onUpdate }) => {
  const [status, setStatus] = useState(task?.status || "");

  const handleUpdate = () => {
    onUpdate(task.id, status);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Task: <strong>{task?.title}</strong></p>
          <p>Current Status: <strong>{task?.status}</strong></p>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {/* <option value="New Assigned">New Assigned</option> */}
            <option value="Pending">Pending</option>
            <option value="On Progress">On Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="ghost">Cancel</Button>
          <Button onClick={handleUpdate} variant="default">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskStatusModal;
