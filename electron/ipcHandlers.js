const { ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

function setupIpcHandlers() {
  ipcMain.on("loadData", (event, time) => {
    const [year, month, day] = time.split(" ")[0].split("-");
    const filePath = path.join(__dirname, "data", year, month, `${day}.json`);

    console.log(`Loading file from: ${filePath}`);

    fs.access(filePath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        // 如果文件不存在，创建目录并写入默认内容
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        const defaultData = {
          elements: [],
          appState: { viewBackgroundColor: "#fdf8f6" },
          files: {},
        };
        fs.writeFile(filePath, JSON.stringify(defaultData), (writeErr) => {
          if (writeErr) {
            console.log(`Error writing file: ${writeErr}`);
            event.reply("loadDataResponse", { error: writeErr.message });
            return;
          }
          console.log(`Created new file: ${filePath}`);
          event.reply("loadDataResponse", defaultData);
        });
      } else {
        // 文件存在，读取文件内容
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.log(`Error reading file: ${err}`);
            event.reply("loadDataResponse", { error: err.message });
            return;
          }
          try {
            const parsedData = JSON.parse(data);
            if (typeof parsedData === "string") {
              const doubleParsedData = JSON.parse(parsedData);
              event.reply("loadDataResponse", doubleParsedData);
            } else {
              event.reply("loadDataResponse", parsedData);
            }
          } catch (parseError) {
            console.log(`Error parsing JSON: ${parseError}`);
            event.reply("loadDataResponse", { error: parseError.message });
          }
        });
      }
    });
  });

  ipcMain.on("saveData", (event, time, content) => {
    const [year, month, day] = time.split(" ")[0].split("-");
    const dirPath = path.join(__dirname, "data", year, month);
    const filePath = path.join(dirPath, `${day}.json`);

    fs.mkdirSync(dirPath, { recursive: true });

    console.log(`Saving file to: ${filePath}`);
    fs.writeFile(filePath, JSON.stringify(content), (err) => {
      if (err) {
        console.log(`Error saving file: ${err}`);
        event.reply("saveDataResponse", { error: err.message });
        return;
      }
      event.reply("saveDataResponse", { success: true });
    });
  });
}

module.exports = { setupIpcHandlers };
