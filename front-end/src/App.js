import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import Students from "./components/Students";
import Courses from "./components/Courses";
import Results from "./components/Results";

function App() {
  const currentPath = window.location.pathname;

  return (
    <>
      <div className="sidebar">
        <a className={currentPath === "/" ? "active" : ""} href="/">
          Home
        </a>
        <a className={currentPath === "/students" ? "active" : ""} href="/students">
          Students
        </a>
        <a className={currentPath === "/courses" ? "active" : ""} href="/courses">
          Courses
        </a>
        <a className={currentPath === "/results" ? "active" : ""} href="/results">
          Results
        </a>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/students" element={<Students />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/results" element={<Results />} />
          {/* Default Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
