"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTasks } from "@/store/tasksSlice";
import OpenAI from "openai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

type Priority = "P1" | "P2" | "P3";

interface AIResult {
  id: string;
  title: string;
  oldPriority: Priority;
  newPriority: Priority;
}

export function PrioritizeByAI() {
  const { tasks } = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIResult[]>([]);

  const handlePrioritize = async () => {
    setIsOpen(true);
    setLoading(true);

    try {
      const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.done];

      const res = await fetch("/api/prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: allTasks }),
      });

      const data = await res.json();

      const merged: AIResult[] = data.results.map((p: any) => {
        const task = allTasks.find((t) => t.id === p.id);
        return {
          id: p.id,
          title: task?.title || "Unknown Task",
          oldPriority: task?.priority || "P3",
          newPriority: p.newPriority,
        };
      });

      setResults(merged);
    } catch (err) {
      console.error("AI Prioritize Error:", err);
      toast.error("⚠️ AI prioritization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async () => {
    try {
      const updates = results.map((r) => ({
        id: r.id,
        priority: r.newPriority,
      }));

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/bulk-priority`,
        { updates },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("✅ Priorities updated successfully!");
      setIsOpen(false);
      dispatch(fetchTasks());
    } catch {
      toast.error("❌ Failed to update priorities.");
    }
  };

  return (
    <>
      <Button
        onClick={handlePrioritize}
        size={"lg"}
        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium shadow-lg hover:opacity-90 transition rounded-full"
      >
        <Sparkles className="h-4 w-4" />
        Prioritize by AI
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              AI Prioritization
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>AI is analyzing and prioritizing your tasks...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <h4 className="font-medium">{r.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Old Priority:{" "}
                      <span
                        className={
                          r.oldPriority === "P1"
                            ? "text-red-500"
                            : r.oldPriority === "P2"
                            ? "text-orange-500"
                            : "text-green-500"
                        }
                      >
                        {r.oldPriority}
                      </span>
                    </p>
                  </div>

                  <Select
                    value={r.newPriority}
                    onValueChange={(val: Priority) =>
                      setResults((prev) =>
                        prev.map((x) =>
                          x.id === r.id ? { ...x, newPriority: val } : x
                        )
                      )
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P1">🔴 P1</SelectItem>
                      <SelectItem value="P2">🟠 P2</SelectItem>
                      <SelectItem value="P3">🟢 P3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {results.length > 0 && (
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
                >
                  Finalize & Save
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
