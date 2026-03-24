"use client";

import { InsforgeBrowserProvider } from "@insforge/nextjs";
import { insforge } from "@/lib/insforge";

export function InsforgeProvider({ 
  children,
  initialState
}: { 
  children: React.ReactNode;
  initialState?: any;
}) {
  return (
    <InsforgeBrowserProvider client={insforge} afterSignInUrl="/admin" initialState={initialState}>
      {children}
    </InsforgeBrowserProvider>
  );
}
