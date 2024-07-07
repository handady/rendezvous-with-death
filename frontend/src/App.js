// src/App.js

import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/index.tsx";
import Challenge from "./pages/Challenge/index.tsx";
import "./App.css";
import "./styles/common.css";
import "./assets/font/font.css";
import { ConfigProvider } from "antd";

function App() {
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#f783ac",
            fontFamily: "Muyao-Softbrush",
            fontSize: 16,
          },
          components: {
            Progress: {
              remainingColor: "transparent",
            },
          },
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/challenge" element={<Challenge />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </div>
  );
}

export default App;
