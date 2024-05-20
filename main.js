const { app, BrowserWindow } = require("electron");
require('@electron/remote/main').initialize();
const path = require("path");
const isDev = require("electron-is-dev");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = isDev
    ? "http://localhost:520"
    : `file://${path.join(__dirname, "frontend/build/index.html")}`;
  mainWindow.loadURL(startUrl);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
