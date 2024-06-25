import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import MainComponent from "./pages/mainComponent";

function App() {
  return (
    <Routes>
      <Route path="/home" element={<MainComponent />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
