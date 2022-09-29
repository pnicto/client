import axios from "axios";
import "normalize.css";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { Landing, Register } from "./pages";
import MainApp from "./components/MainApp";
import GithubOauthWaitPage from "./pages/GithubOauthWaitPage";

axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/form" element={<Register />} />
      <Route path="/app" element={<MainApp />} />
      {/* Route where github gives the code for further actions */}
      <Route path="/github/auth" element={<GithubOauthWaitPage />} />
    </Routes>
  );
}

export default App;
