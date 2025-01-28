import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handle GET request
export async function GET() {
  try {
    const tasks = await prisma.tasks.findMany();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// Handle POST request
export async function POST(request: Request) {
  try {
    const { title, description, status, assignedTo, createdBy, dueDate } = await request.json();

    if (!title || !description || !status || !assignedTo || !createdBy || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTask = await prisma.tasks.create({
      data: {
        title,
        description,
        status,
        assignedTo,
        createdBy,
        dueDate: new Date(dueDate),
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}