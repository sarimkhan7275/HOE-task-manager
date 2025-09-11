"use client";

import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border py-6 text-center text-sm text-muted-foreground">
      <p className="mb-2">
        Made with ❤️ by <span className="font-medium text-foreground">Sarim Khan</span>
      </p>
      <div className="flex justify-center gap-6">
        <Link
          href="https://github.com/sarimkhan7275"
          target="_blank"
          className="flex items-center gap-2 hover:text-foreground transition"
        >
          <Github className="h-4 w-4" />
          GitHub
        </Link>
        <Link
          href="https://linkedin.com/in/sarimkhan7275"
          target="_blank"
          className="flex items-center gap-2 hover:text-foreground transition"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Link>
      </div>
    </footer>
  );
}
