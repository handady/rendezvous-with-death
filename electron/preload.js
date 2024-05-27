// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, ...args) => {
    // 使用 ...args 以支持多个参数
    let validChannels = [
      "loadData",
      "saveData",
      "saveDiaryEntry",
      "loadDiaryEntries",
      "editDiaryEntry",
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    }
  },
  receive: (channel, func) => {
    let validChannels = [
      "loadDataResponse",
      "saveDataResponse",
      "saveDiaryEntryResponse",
      "loadDiaryEntriesResponse",
      "editDiaryEntryResponse",
    ];
    if (validChannels.includes(channel)) {
      // 从主进程接收
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  once: (channel, func) => {
    let validChannels = [
      "loadDataResponse",
      "saveDataResponse",
      "saveDiaryEntryResponse",
      "loadDiaryEntriesResponse",
      "editDiaryEntryResponse",
    ];
    if (validChannels.includes(channel)) {
      // 从主进程接收
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    }
  },
});
