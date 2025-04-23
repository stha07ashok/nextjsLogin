"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export default function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(true);
  }, []);
  if (!open) {
    return null;
  }
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
