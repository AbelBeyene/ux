import { useState } from "react";
import { ResumeCritiquePage } from "./pages/ResumeCritiquePage";
import { BuildPage } from "./pages/BuildPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";

export default function App() {
  const [pageId, setPageId] = useState(() => window.location.hash.slice(1) || "dashboard");
  const navigate = (id: string) => {
    window.location.hash = id;
    setPageId(id);
  };

  switch (pageId) {
    case "build":
      return <BuildPage onNavigate={navigate} />;
    case "resumes":
      return <ResumeCritiquePage onNavigate={navigate} />;
    case "history":
      return <HistoryPage onNavigate={navigate} />;
    case "settings":
      return <SettingsPage onNavigate={navigate} />;
    case "signin":
      return <SignInPage onNavigate={navigate} />;
    case "signup":
      return <SignUpPage onNavigate={navigate} />;
    default:
      return <DashboardPage onNavigate={navigate} />;
  }
}
