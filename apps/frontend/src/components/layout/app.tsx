// app/layout.tsx
import type { ReactNode } from "react";
import Providers from "./Providers"; // Only import the Client Component wrapper

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
