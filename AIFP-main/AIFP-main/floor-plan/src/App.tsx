import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router"
import Home from "./pages/Home";
import Editor from "./pages/Editor";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;