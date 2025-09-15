"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Task, updateTask, fetchTasks } from "@/store/tasksSlice"
import { useAppDispatch } from "@/store/hooks"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface EditTaskDialogProps {
  task: Task
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function EditTaskDialog({ task, isOpen, setIsOpen }: EditTaskDialogProps) {
  const dispatch = useAppDispatch()

  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [priority, setPriority] = useState<"P1" | "P2" | "P3">(task.priority || "P3")
  const [loading, setLoading] = useState(false) 

  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority || "P3")
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Title cannot be empty!")
      return
    }

    try {
      setLoading(true) 
      await dispatch(
        updateTask({
          id: task.id,
          updates: {
            title,
            description,
            status: task.status,
            priority,
          },
        })
      ).unwrap()

      dispatch(fetchTasks())
      toast.success("Task updated successfully ✅")
      setIsOpen(false)
    } catch {
      toast.error("Failed to update task ❌")
    } finally {
      setLoading(false) 
    }
  }

  const handleClose = () => {
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority || "P3")
    setIsOpen(false)
  }

  const priorityColors: Record<string, string> = {
    P1: "text-red-500",
    P2: "text-orange-500",
    P3: "text-green-500",
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={priority}
              onValueChange={(val: "P1" | "P2" | "P3") => setPriority(val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P1">
                  <span className="h-3 w-3 rounded-full inline-block mr-2 bg-red-500" />
                  <span className={priorityColors["P1"]}>P1 (High)</span>
                </SelectItem>
                <SelectItem value="P2">
                  <span className="h-3 w-3 rounded-full inline-block mr-2 bg-orange-500" />
                  <span className={priorityColors["P2"]}>P2 (Medium)</span>
                </SelectItem>
                <SelectItem value="P3">
                  <span className="h-3 w-3 rounded-full inline-block mr-2 bg-green-500" />
                  <span className={priorityColors["P3"]}>P3 (Low)</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              className="rounded-full"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="rounded-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
