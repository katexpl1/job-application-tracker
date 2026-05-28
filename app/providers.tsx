"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ConfirmProvider,
  GlobalStyles,
  ThemeProvider,
  ToastProvider,
  createNeoBrutalTheme,
} from "blunt-ui";
import { useState } from "react";

const theme = createNeoBrutalTheme("#4f46e5");

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ToastProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
