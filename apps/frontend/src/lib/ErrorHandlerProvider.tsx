"use client";

import { createContext, useContext, ReactNode } from "react";

type ErrorHandler = (error: unknown) => void;

const ErrorHandlerContext = createContext<ErrorHandler | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const handleError: ErrorHandler = (error) => {
    console.error("App Error:", error);
  };

  return (
    <ErrorHandlerContext.Provider value={handleError}>
      {children}
    </ErrorHandlerContext.Provider>
  );
}

export function useErrorHandler() {
  const ctx = useContext(ErrorHandlerContext);
  if (!ctx) {
    throw new Error("useErrorHandler must be used within ErrorProvider");
  }
  return ctx;
}
