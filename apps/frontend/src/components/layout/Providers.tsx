// app/providers.tsx
"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorProvider } from "@/lib/ErrorHandlerProvider";
import { AuthProvider } from "@/lib/auth/auth";
import { LoadingIndicatorProvider } from "@/lib/LoadingIndicatorProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AuthGuard from "@/components/custom/AuthGuard";

// Safe singleton pattern for QueryClient (client-only)
let queryClient: QueryClient | null = null;
function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
        },
      },
    });
  }
  return queryClient;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // Handle hot reloads in development
  const [client] = useState(() => getQueryClient());

  // Cleanup on unmount (critical for HMR)
  useEffect(() => {
    return () => {
      queryClient = null;
    };
  }, []);

  return (
    <ErrorProvider>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <LoadingIndicatorProvider />
          <TooltipProvider>
            <Sonner />
            <AuthGuard>{children}</AuthGuard>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorProvider>
  );
}
