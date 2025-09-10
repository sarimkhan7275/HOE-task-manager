"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Task } from "@/store/tasksSlice"


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

export function TodoColumn({data, taskLength}:{data:Task, taskLength:number}) {


//   const handleClearColumn = () => {
//     if (column.tasks.length > 0) {
//       const confirmed = window.confirm(
//         `Are you sure you want to clear all ${column.tasks.length} tasks from ${column.title}?`,
//       )
//       if (confirmed) {
//         onClearColumn(column.id)
//       }
//     }
//   }

  return (
    <Card
      className={`bg-card border-border border-l-4 border-l-blue-500 h-fit transition-colors`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">{data.title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${columnBadgeColors["todo"]}`}>
              {taskLength}
            </span>
            {taskLength > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
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
        {/* <AddTaskForm onAddTask={(title, description) => onAddTask(column.id, title, description)} /> */}
      </CardContent>
    </Card>
  )
}
