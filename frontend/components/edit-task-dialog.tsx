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

interface EditTaskDialogProps {
  task: Task
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function EditTaskDialog({ task, isOpen, setIsOpen }: EditTaskDialogProps) {
  const dispatch = useAppDispatch()

  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)

  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description)
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Title cannot be empty!")
      return
    }

    try {
      await dispatch(
        updateTask({
          id: task.id,
          updates: {
            title,
            description,
            status: task.status,
          },
        })
      ).unwrap()

      // ✅ Refetch all tasks
      dispatch(fetchTasks())

      toast.success("Task updated successfully ✅")
      setIsOpen(false)
    } catch {
      toast.error("Failed to update task ❌")
    }
  }

  const handleClose = () => {
    setTitle(task.title)
    setDescription(task.description)
    setIsOpen(false)
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
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Update Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
