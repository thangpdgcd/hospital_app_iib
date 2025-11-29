// src/App.tsx
import { Routes, Route } from "react-router-dom";
import LoginView from "./components/login";
import HomeView from "./components/home";
import ChatView from "./components/chat";
import SettingsView from "./components/setting";
import  ManageRequestsPage from "./components/managerequestspage"
import SchedulePlanningSection from"./components/schedule_planing"
import MainLayout from "../src/mainlayout";


const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomeView />} />
        <Route path="/schedule" element={<SchedulePlanningSection />} />
        <Route path="/chat" element={<ChatView />} />
        <Route path="/settings" element={<SettingsView />} />
       <Route path="/manage-requests" element={<ManageRequestsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
