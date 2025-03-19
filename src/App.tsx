
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Create a client for React Query
const queryClient = new QueryClient();

// Load n8n Chat CSS
const loadChatCSS = () => {
  const link = document.createElement("link");
  link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

const App = () => {
  useEffect(() => {
    // Load n8n Chat CSS when the app mounts
    loadChatCSS();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" expand closeButton />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
