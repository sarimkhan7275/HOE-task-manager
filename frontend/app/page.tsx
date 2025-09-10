"use client";

import { useEffect, useState } from "react";
import { fetchTasks } from "@/store/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { TaskColumn } from "@/components/task-column";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, WifiOff } from "lucide-react";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton"; 

export default function Home() {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [displayedSummary, setDisplayedSummary] = useState("");

  useEffect(() => {
    if (!summary) return;

    let i = 0;
    const words = summary.split(" ");
    setDisplayedSummary("");

    const interval = setInterval(() => {
      setDisplayedSummary((prev) => prev + (prev ? " " : "") + words[i]);
      i++;
      if (i >= words.length) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [summary]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleSummarize = async () => {
    setLoadingSummary(true);
    setIsDialogOpen(true);

    try {
      const prompt = `
        You are an assistant that summarizes tasks into a short project status report.
        Format with **bold** titles, *italic* highlights, and bullet points.

        Todo:
        ${tasks.todo.map((t) => `- ${t.title}`).join("\n")}

        In Progress:
        ${tasks.inProgress.map((t) => `- ${t.title}`).join("\n")}

        Done:
        ${tasks.done.map((t) => `- ${t.title}`).join("\n")}
      `;

      const client = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      setSummary(response.choices[0].message.content ?? "No summary generated.");
    } catch (err) {
      console.error("AI Summarizer Error:", err);
      setSummary("⚠️ AI summarizer failed. Please try again later.");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 md:flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Task Manager</h1>
            <p className="text-muted-foreground mt-2">
              Organize your tasks and summarize with AI
            </p>
          </div>

          <Button
            onClick={handleSummarize}
            size={'lg'}
            className="mt-5 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg hover:opacity-90 transition rounded-full"
          >
            <Sparkles className="h-4 w-4" />
            Summarize with AI
          </Button>
        </header>

        {loading ? (
          <div className="flex gap-6 overflow-x-auto">
            {[1, 2, 3].map((col) => (
              <div
                key={col}
                className="w-[320px] flex-shrink-0 rounded-lg border border-border p-4 space-y-4"
              >
                <Skeleton className="h-6 w-1/2 bg-zinc-900 " />
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-md bg-zinc-600 " />
                ))}
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
            <WifiOff className="h-10 w-10 mb-2 text-destructive" />
            <p className="font-medium">Connection Error</p>
            <p className="text-sm">Unable to load tasks. Please try again.</p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto">
            <TaskColumn data={tasks?.todo} status="todo" />
            <TaskColumn data={tasks?.inProgress} status="inProgress" />
            <TaskColumn data={tasks?.done} status="done" />
          </div>
        )}
      </div>

      {/* AI Summary Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Project Summary
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 prose prose-sm dark:prose-invert max-w-none">
            {loadingSummary ? (
              <p className="text-muted-foreground">✨ Summarizing your board...</p>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {displayedSummary || summary}
              </ReactMarkdown>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
