import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Home from "./pages/Home";
import ApiTest from "./pages/ApiTest";
import ApiTestDashboard from "./pages/ApiTestDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/test" element={<ApiTestDashboard />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
