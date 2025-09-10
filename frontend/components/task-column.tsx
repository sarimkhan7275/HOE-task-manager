"use client"

import { TaskCard } from "./task-card"
import { AddTaskForm } from "./add-task-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Column, Task } from "@/types/task"

interface TaskColumnProps {
  column: Column
  onAddTask: (columnId: string, title: string, description?: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onDuplicateTask: (taskId: string) => void
  onClearColumn: (columnId: string) => void
}

const columnColors = {
  todo: "border-l-blue-500",
  "in-progress": "border-l-amber-500",
  done: "border-l-green-500",
}

const columnBadgeColors = {
  todo: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "in-progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  done: "bg-green-500/10 text-green-400 border-green-500/20",
}

export function TaskColumn({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onClearColumn,
}: TaskColumnProps) {
  const handleClearColumn = () => {
    if (column.tasks.length > 0) {
      const confirmed = window.confirm(
        `Are you sure you want to clear all ${column.tasks.length} tasks from ${column.title}?`,
      )
      if (confirmed) {
        onClearColumn(column.id)
      }
    }
  }

  return (
    <Card className={`bg-card border-border border-l-4 ${columnColors[column.status]} h-fit`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">{column.title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${columnBadgeColors[column.status]}`}>
              {column.tasks.length}
            </span>
            {column.tasks.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleClearColumn} className="text-destructive focus:text-destructive">
                    <Trash2 className="h-3 w-3 mr-2" />
                    Clear all tasks
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-3 min-h-[200px]">
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDuplicate={onDuplicateTask}
            />
          ))}
        </div>
        <AddTaskForm onAddTask={(title, description) => onAddTask(column.id, title, description)} />
      </CardContent>
    </Card>
  )
}
