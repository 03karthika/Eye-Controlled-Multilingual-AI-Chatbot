import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Features from "./components/Features";
import Contact from "./components/Contact";
import Chatbot from "./components/Chatbot";
import HeadTracker from "./components/HeadTracker";

export default function App() {
  const [trackOn, setTrackOn] = useState(false);

  return (
    <div className="app-root">
      <Navbar trackOn={trackOn} setTrackOn={setTrackOn} />
      {trackOn && <HeadTracker />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </div>
  );
}
