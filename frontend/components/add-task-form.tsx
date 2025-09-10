"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

interface AddTaskFormProps {
  onAddTask: (title: string, description?: string) => void
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddTask(title.trim(), description.trim() || undefined)
      setTitle("")
      setDescription("")
      setIsOpen(false)
    }
  }

  const handleCancel = () => {
    setTitle("")
    setDescription("")
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 border-2 border-dashed border-border hover:border-primary transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a task
      </Button>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          <Textarea
            placeholder="Add a description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
              Add Task
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
