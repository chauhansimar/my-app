import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Chatbot from "./Pages/Chatbot";
import AddWebsite from "./Pages/AddWebsite";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 🔥 ADD THESE */}
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/add-website" element={<AddWebsite />} />
      </Routes>
    </Router>
  );
}


export default App;