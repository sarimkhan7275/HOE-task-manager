"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Task } from "@/store/tasksSlice";
import { AddTaskDialog } from "./add-task-dialog";
import { TaskCard } from "./task-card";
import { Plus } from "lucide-react";

export const TaskColumn = ({ data, status }: { data: Task[]; status: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const title =
    status === "todo"
      ? "Todo"
      : status === "inProgress"
      ? "In Progress"
      : "Done";

  return (
    <div className="min-w-[300px] min-h-[450px] md:min-h-[600px] flex flex-col rounded-xl bg-zinc-900 border border-border w-full shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border sticky overflow-hidden rounded-t-4xl top-0 bg-zinc-900 z-10">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <span className="text-sm text-muted-foreground bg-background px-2 py-1 rounded">
          {data?.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[70vh] ">
        {data?.length ? (
          data.map((task) => (
            <TaskCard key={task.id} task={task} status={status} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic text-center py-4">
            No tasks yet
          </p>
        )}
      </div>


      <div className="p-4 border-t border-border bg-zinc-900 sticky bottom-0 overflow-hidden rounded-b-4xl ">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-2 rounded-full font-medium shadow-md "
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Add Task Modal */}
      <AddTaskDialog isOpen={isOpen} setIsOpen={setIsOpen} status={status} />
    </div>
  );
};
