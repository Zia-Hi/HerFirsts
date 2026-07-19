"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-[#1c1a17] text-white">
        <h2 className="text-3xl font-bold mb-4">An error occurred</h2>
        <p className="text-gray-400 mb-6">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-[#5d4a37] text-white rounded-full hover:bg-[#4a3a2a] transition-colors"
        >
          Refresh
        </button>
      </body>
    </html>
  );
}