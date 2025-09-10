"use client"

import { useEffect, useState } from "react"

import { TaskCard } from "@/components/task-card"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { toast } from "sonner"
import { fetchTasks, Task } from "@/store/tasksSlice"
import { TodoColumn } from "@/components/todo-column"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

export default function Dashboard() {


  const [editingTask, setEditingTask] = useState<any>(null)
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  console.log(tasks)


  const handleAddTask = (columnId: string, title: string, description?: string) => {
    // try {
    //   addTask(columnId, title, description)
    //   toast.success("Task created",{description: "Your new task has been added successfully."})
    // } catch (error) {
    //   toast.error("Error creating task", {description : "An unexpected error occurred."})
    // }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

  const handleSaveTask = (taskId: string, updates: { title: string; description?: string }) => {
    // try {
    //   updateTask(taskId, updates)
    //   setEditingTask(null)
    //   toast.success("Task updated",{description: "Your changes have been saved successfully."})
    // } catch (error) {
    //   toast.error("Error updating task", {description : "An unexpected error occurred."})
    // }
  }

  const handleDeleteTask = (taskId: string) => {
    // const confirmed = window.confirm("Are you sure you want to delete this task?")
    // if (confirmed) {
    //   deleteTask(taskId)
    //   toast.error("Task deleted", {description : "The task has been removed successfully."})
    // }
  }


  return (
    <div
    >
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl p-6">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground text-balance">Task Dashboard</h1>
                <p className="text-muted-foreground mt-2 text-pretty">
                  Organize and manage your tasks with an intuitive drag-and-drop interface
                </p>
              </div>
              <div className="text-right">
                {/* <div className="text-2xl font-bold text-foreground">{getTotalTaskCount()}</div> */}
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* <div><TodoColumn/></div> */}
            <div>
              {
                tasks.todo.map((el,i)=>(
                  <TodoColumn data={el} taskLength={tasks.todo.length} />
                ))
              }
            </div>
          </div>
        </div>

        <EditTaskDialog
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTask}
        />
      </div>
    </div>
  )
}



// {columns.map((column) => (
//               <DroppableTaskColumn
//                 key={column.id}
//                 column={column}
//                 onAddTask={handleAddTask}
//                 onEditTask={handleEditTask}
//                 onDeleteTask={handleDeleteTask}
//                 onClearColumn={handleClearColumn}
//               />
//             ))}