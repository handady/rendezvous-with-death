const { ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

function setupIpcHandlers(app) {
  // 读取文件
  ipcMain.on("loadData", (event, time) => {
    const [year, month, day] = time.split(" ")[0].split("-");
    const filePath = path.join(__dirname, "data", year, month, `${day}.json`);

    console.log(`Loading file from: ${filePath}`);
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        event.reply("loadDataResponse", { error: err.message });
        return;
      }
      event.reply("loadDataResponse", JSON.parse(data));
    });
  });

  // 保存文件
  ipcMain.on("saveData", (event, time, content) => {
    const [year, month, day] = time.split(" ")[0].split("-");
    const dirPath = path.join(__dirname, "data", year, month);
    const filePath = path.join(dirPath, `${day}.json`);

    // 确保目录存在
    fs.mkdirSync(dirPath, { recursive: true });

    console.log(`Saving file to: ${filePath}`);
    fs.writeFile(filePath, JSON.stringify(content), (err) => {
      if (err) {
        console.log(err);
        event.reply("saveDataResponse", { error: err.message });
        return;
      }
      event.reply("saveDataResponse", { success: true });
    });
  });
}

module.exports = { setupIpcHandlers };
