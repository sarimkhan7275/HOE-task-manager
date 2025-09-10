"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRight, ArrowLeft, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import {
  Task,
  deleteTask,
  fetchTasks,
  updateTaskStatus,
} from "@/store/tasksSlice";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "sonner";
import { EditTaskDialog } from "./edit-task-dialog";

export const TaskCard = ({ task, status }: { task: Task; status: string }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(task.id)).unwrap();
      dispatch(fetchTasks());
      toast.success("Task deleted successfully 🗑️");
    } catch (err) {
      toast.error("Failed to delete task ❌");
    }
  };

  const handleMove = async (newStatus: "todo" | "inProgress" | "done") => {
    try {
      await dispatch(updateTaskStatus({ id: task.id, status: newStatus })).unwrap();
      dispatch(fetchTasks());
      toast.success(`Task moved to ${newStatus} ✅`);
    } catch (err) {
      toast.error("Failed to move task ❌");
    }
  };

  // Define possible moves with icons
  const statusMoves: Record<
    string,
    { label: string; value: "todo" | "inProgress" | "done"; icon: React.ElementType }[]
  > = {
    todo: [
      { label: "Move to In Progress", value: "inProgress", icon: ArrowRight },
      { label: "Move to Done", value: "done", icon: ArrowRight },
    ],
    inProgress: [
      { label: "Move to Todo", value: "todo", icon: ArrowLeft },
      { label: "Move to Done", value: "done", icon: ArrowRight },
    ],
    done: [
      { label: "Move to Todo", value: "todo", icon: ArrowLeft },
      { label: "Move to In Progress", value: "inProgress", icon: ArrowLeft },
    ],
  };

  return (
    <>
      <Card className="bg-card hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-card-foreground text-balance">
              {task.title}
            </h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>

                {statusMoves[status]?.map((move) => (
                  <DropdownMenuItem
                    key={move.value}
                    onClick={() => handleMove(move.value)}
                  >
                    <move.icon className="w-4 h-4 mr-2" />
                    {move.label}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3 text-pretty">
            {task.description}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(task.date).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>

        </CardContent>
      </Card>

      <EditTaskDialog
        task={task}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
      />
    </>
  );
};
