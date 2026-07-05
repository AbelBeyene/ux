import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import { queryClient } from "./app/queryClient";
import { ResumeCritiquePage } from "./pages/ResumeCritiquePage";
import { BuildPage } from "./pages/BuildPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";

/**
 * Maps the design system's page-id navigation contract (`onNavigate("build")`,
 * used by Sidebar/HeaderUtilities/page-to-page links) onto real routes, so no
 * page component needs to know a router exists.
 */
const PAGE_PATHS: Record<string, string> = {
  dashboard: "/",
  resumes: "/resumes",
  build: "/build",
  history: "/history",
  settings: "/settings",
  signin: "/signin",
  signup: "/signup",
};

function useAppNavigate() {
  const navigate = useNavigate();
  return (pageId: string) => navigate(PAGE_PATHS[pageId] ?? "/");
}

function AppRoutes() {
  const onNavigate = useAppNavigate();
  return (
    <Routes>
      <Route path="/" element={<DashboardPage onNavigate={onNavigate} />} />
      <Route path="/resumes" element={<ResumeCritiquePage onNavigate={onNavigate} />} />
      <Route path="/build" element={<BuildPage onNavigate={onNavigate} />} />
      <Route path="/history" element={<HistoryPage onNavigate={onNavigate} />} />
      <Route path="/settings" element={<SettingsPage onNavigate={onNavigate} />} />
      <Route path="/signin" element={<SignInPage onNavigate={onNavigate} />} />
      <Route path="/signup" element={<SignUpPage onNavigate={onNavigate} />} />
      <Route path="*" element={<DashboardPage onNavigate={onNavigate} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
