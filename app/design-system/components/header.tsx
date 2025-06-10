"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-gradient">BellBot</span> Design System
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              A comprehensive guide to BellBot's UI components and styles
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
