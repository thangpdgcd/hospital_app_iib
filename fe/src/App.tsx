import { Route, Routes } from "react-router-dom";
import LoginView from "./components/login";
import ChatView from "./components/chat";
import HomeView from "./components/home";
import SettingsView from "./components/setting";
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<HomeView />} />
      <Route path='/login' element={<LoginView />} />
      <Route path='/chat' element={<ChatView />} />
      <Route path='/settings' element={<SettingsView />} />
    </Routes>
  );
};

export default App;
