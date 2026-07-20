"use client";

import type { ReactNode } from "react";

interface SceneContainerProps {
  children: ReactNode;
  className?: string;
}

export function SceneContainer({ children, className = "" }: SceneContainerProps) {
  return (
    <div
      className={`fixed inset-0 min-w-0 flex flex-col ${className}`}
    >
      <div className="flex-1 min-h-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveGrid({ children, className = "" }: ResponsiveGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto px-4 md:px-6 ${className}`}
    >
      {children}
    </div>
  );
}