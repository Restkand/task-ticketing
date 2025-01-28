import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handle PUT request (Update a task)
export async function PUT(request: Request) {
  try {
    const { id, title, description, status, assignedTo, dueDate } = await request.json();

    if (!id || !title || !description || !status || !assignedTo || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedTask = await prisma.tasks.update({
      where: { id },
      data: {
        title,
        description,
        status,
        assignedTo,
        dueDate: new Date(dueDate), // Update dueDate
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}


// Handle DELETE request (Delete a task)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = Number(params.id);

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    await prisma.tasks.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}