"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createTask, fetchTasks } from "@/store/tasksSlice";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddTaskDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  status: string;

}

export function AddTaskDialog({ isOpen, setIsOpen, status }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"P1" | "P2" | "P3">("P3");
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required!");
      return;
    }

    try {
      await dispatch(
        createTask({
          title,
          description,
          status,
          priority,
        })
      ).unwrap();

      toast.success("Task created successfully 🎉");
      setTitle("");
      setDescription("");
      setPriority("P3");
      setIsOpen(false);
      dispatch(fetchTasks());
    } catch {
      toast.error("Failed to create task ❌");
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPriority("P3");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(val) => setPriority(val as "P1" | "P2" | "P3")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P1">
                  <span className="text-red-500 font-semibold">P1 (High)</span>
                </SelectItem>
                <SelectItem value="P2">
                  <span className="text-orange-500 font-semibold">P2 (Medium)</span>
                </SelectItem>
                <SelectItem value="P3">
                  <span className="text-green-500 font-semibold">P3 (Low)</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" className="rounded-full " variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
