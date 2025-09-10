"use client"

import { Column, Task } from "@/types/task"
import { useState, useCallback } from "react"

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "Todo",
    status: "todo",
    tasks: [
      {
        id: "demo-1",
        title: "Design new landing page",
        description: "Create wireframes and mockups for the new product landing page",
        status: "todo",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "demo-2",
        title: "Set up development environment",
        description: "Install necessary tools and configure the development workspace",
        status: "todo",
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-16"),
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    status: "in-progress",
    tasks: [
      {
        id: "demo-3",
        title: "Implement user authentication",
        description: "Add login and registration functionality with proper validation",
        status: "in-progress",
        createdAt: new Date("2024-01-14"),
        updatedAt: new Date("2024-01-17"),
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    status: "done",
    tasks: [
      {
        id: "demo-4",
        title: "Project setup and initial configuration",
        description: "Initialize the project repository and set up basic structure",
        status: "done",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-13"),
      },
    ],
  },
]

export function useTasks() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)

  const addTask = useCallback((columnId: string, title: string, description?: string) => {
    if (!title.trim()) {
      throw new Error("Task title is required")
    }

    if (title.length > 100) {
      throw new Error("Task title must be less than 100 characters")
    }

    if (description && description.length > 500) {
      throw new Error("Task description must be less than 500 characters")
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim(),
      status: columnId as Task["status"],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setColumns((prev) =>
      prev.map((column) => (column.id === columnId ? { ...column, tasks: [...column.tasks, newTask] } : column)),
    )

    return newTask
  }, [])

  const updateTask = useCallback((taskId: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
    if (updates.title !== undefined && !updates.title.trim()) {
      throw new Error("Task title cannot be empty")
    }

    if (updates.title && updates.title.length > 100) {
      throw new Error("Task title must be less than 100 characters")
    }

    if (updates.description && updates.description.length > 500) {
      throw new Error("Task description must be less than 500 characters")
    }

    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...updates,
                title: updates.title?.trim() || task.title,
                description: updates.description?.trim() || task.description,
                updatedAt: new Date(),
              }
            : task,
        ),
      })),
    )
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      })),
    )
  }, [])

  const duplicateTask = useCallback((taskId: string) => {
    setColumns((prev) => {
      const newColumns = [...prev]

      for (const column of newColumns) {
        const taskIndex = column.tasks.findIndex((task) => task.id === taskId)
        if (taskIndex !== -1) {
          const originalTask = column.tasks[taskIndex]
          const duplicatedTask: Task = {
            ...originalTask,
            id: crypto.randomUUID(),
            title: `${originalTask.title} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          column.tasks.splice(taskIndex + 1, 0, duplicatedTask)
          break
        }
      }

      return newColumns
    })
  }, [])

  const getTaskById = useCallback(
    (taskId: string): Task | null => {
      for (const column of columns) {
        const task = column.tasks.find((task) => task.id === taskId)
        if (task) return task
      }
      return null
    },
    [columns],
  )

  const getTasksByStatus = useCallback(
    (status: Task["status"]): Task[] => {
      const column = columns.find((col) => col.status === status)
      return column ? column.tasks : []
    },
    [columns],
  )

  const clearColumn = useCallback((columnId: string) => {
    setColumns((prev) => prev.map((column) => (column.id === columnId ? { ...column, tasks: [] } : column)))
  }, [])

  const moveTask = useCallback((taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
    setColumns((prev) => {
      const newColumns = [...prev]

      // Find the task to move
      const fromColumn = newColumns.find((col) => col.id === fromColumnId)
      const toColumn = newColumns.find((col) => col.id === toColumnId)

      if (!fromColumn || !toColumn) {
        console.error("Invalid column IDs provided")
        return prev
      }

      const taskIndex = fromColumn.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex === -1) {
        console.error("Task not found in source column")
        return prev
      }

      const [task] = fromColumn.tasks.splice(taskIndex, 1)

      // Update task status and timestamp
      task.status = toColumnId as Task["status"]
      task.updatedAt = new Date()

      // Ensure newIndex is within bounds
      const safeIndex = Math.max(0, Math.min(newIndex, toColumn.tasks.length))
      toColumn.tasks.splice(safeIndex, 0, task)

      return newColumns
    })
  }, [])

  const getTotalTaskCount = useCallback(() => {
    return columns.reduce((total, column) => total + column.tasks.length, 0)
  }, [columns])

  return {
    columns,
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
    moveTask,
    clearColumn,
    getTaskById,
    getTasksByStatus,
    getTotalTaskCount,
  }
}
