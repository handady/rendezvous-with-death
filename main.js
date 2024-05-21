const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const { setupIpcHandlers } = require("./electron/ipcHandlers");

function createWindow() {
  console.log('Creating window...');
  // 创建浏览器窗口
  let mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "/electron/preload.js"),
      contextIsolation: true, // 保持开启状态
      nodeIntegration: false, // 保持禁用状态
    },
  });

  // 并且为你的应用加载index.html
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "frontend/build/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // 打开开发者工具
  mainWindow.webContents.openDevTools();

  // 当 window 被关闭，这个事件会被触发
  mainWindow.on("closed", function () {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    mainWindow = null;
  });
}

// Electron 会在初始化后并准备创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on("ready", function () {
  createWindow();
  setupIpcHandlers(app);
});

// 当全部窗口关闭时退出。
app.on("window-all-closed", function () {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
