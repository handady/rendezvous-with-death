// src/App.js

import React from "react";
import Home from "./pages/Home/index.tsx";
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
            fontFamily: "YunFengHanChanTi",
            fontSize: 16,
          },
        }}
      >
        <Home />
      </ConfigProvider>
      {/* <Home /> */}
    </div>
  );
}

export default App;
