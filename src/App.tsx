import axios from "axios";
import "normalize.css";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { Landing, Register } from "./pages";
import MainApp from "./components/MainApp";

axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/form" element={<Register />} />
      <Route path="/app" element={<MainApp />} />
    </Routes>
  );
}

export default App;
