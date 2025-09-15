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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, WifiOff, LogOut } from "lucide-react";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton"; 
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";
import { PrioritizeByAI } from "@/components/prioritize-by-ai";
import { logout } from "@/store/authSlice";
import { toast } from "sonner";

export default function Home() {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  const { token } = useAppSelector((state) => state.auth);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

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
    setHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  if (!hydrated) return null;

  const handleSummarize = async () => {
    setLoadingSummary(true);
    setIsDialogOpen(true);
    try {
      const prompt = `
        You are an expert project manager. Analyze the following tasks and write a short but appealing **Project Status Report**.
        
        🔹 Structure:
        - A short **executive summary** in 2–3 lines.
        - Clear **sections with bold titles** (Todo, In Progress, Done).
        - *Insightful comments* about progress (e.g., blockers, progress pace, bottlenecks).
        - Use ✅, ⚠️, ⏳ icons where relevant for visual appeal.
        - Keep it concise but engaging.

        🔹 Tasks:

        Todo:
        ${tasks.todo.map((t) => `- ${t.title} | ${t.description || "No description"}`).join("\n")}

        In Progress:
        ${tasks.inProgress.map((t) => `- ${t.title} | ${t.description || "No description"}`).join("\n")}

        Done:
        ${tasks.done.map((t) => `- ${t.title} | ${t.description || "No description"}`).join("\n")}
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

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully 🚪");
    router.replace("/login");
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">

          <header className="mb-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">AI TaskFlow</h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Organize your tasks and summarize with AI
                </p>
              </div>

              {/* User Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer border h-9 w-9 md:h-10 md:w-10">
                    <AvatarImage src="/user-avatar.png" alt="User" />
                    <AvatarFallback>SK</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto ">
              <PrioritizeByAI />
              <Button
                onClick={handleSummarize}
                size={"lg"}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg hover:opacity-90 transition rounded-full whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4" />
                Summarize with AI
              </Button>
            </div>
          </header>

          {/* Task Columns */}
          {loading ? (
            <div className="flex gap-4 overflow-x-auto ">
              {[1, 2, 3].map((el) => (
                <div
                  key={el}
                  className="min-w-[280px] md:w-full h-[500px] rounded-lg border border-border p-4 space-y-4 "
                >
                  <Skeleton className="h-6 w-1/2 bg-zinc-900" />
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-md bg-zinc-600" />
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
            <div className="flex gap-4 overflow-x-auto">
              <TaskColumn data={tasks?.todo} status="todo" />
              <TaskColumn data={tasks?.inProgress} status="inProgress" />
              <TaskColumn data={tasks?.done} status="done" />
            </div>
          )}
        </div>
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

      {/* Sticky footer */}
      <Footer />
    </main>
  );
}
