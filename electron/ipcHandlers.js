const { app, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

function setupIpcHandlers(installPath) {
  const getInstallPath = (...subPaths) => path.join(installPath, ...subPaths);

  // 读取excalidraw文件
  ipcMain.on("loadData", (event, time) => {
    const [year, month, day] = time.split(" ")[0].split("-");
    const filePath = getInstallPath("data", year, month, `${day}.json`);

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

  // 存储excalidraw文件
  ipcMain.on("saveData", (event, time, content) => {
    const [year, month, day] = time.split(" ")[0].split("-");
    const dirPath = getInstallPath("data", year, month);
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

  // 存储日记
  ipcMain.on("saveDiaryEntry", (event, entry) => {
    const filePath = getInstallPath("data", "diary.json");

    fs.access(filePath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        // 文件不存在，创建并写入初始内容
        const initialData = [entry];
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFile(
          filePath,
          JSON.stringify(initialData, null, 2),
          (writeErr) => {
            if (writeErr) {
              console.log(`Error writing file: ${writeErr}`);
              event.reply("saveDiaryEntryResponse", {
                error: writeErr.message,
              });
              return;
            }
            console.log(`Created new file: ${filePath}`);
            event.reply("saveDiaryEntryResponse", { success: true });
          }
        );
      } else {
        // 文件存在，读取现有内容并追加新内容
        fs.readFile(filePath, "utf8", (readErr, data) => {
          if (readErr) {
            console.log(`Error reading file: ${readErr}`);
            event.reply("saveDiaryEntryResponse", { error: readErr.message });
            return;
          }
          let diaryEntries;
          try {
            diaryEntries = JSON.parse(data);
          } catch (parseErr) {
            console.log(`Error parsing JSON: ${parseErr}`);
            event.reply("saveDiaryEntryResponse", { error: parseErr.message });
            return;
          }

          // 检查是否已经存在相同的time
          const existingEntry = diaryEntries.find((e) => e.time === entry.time);
          if (existingEntry) {
            event.reply("saveDiaryEntryResponse", {
              error: "今天已经添加过日记了",
            });
            return;
          }

          diaryEntries.push(entry);
          fs.writeFile(
            filePath,
            JSON.stringify(diaryEntries, null, 2),
            (writeErr) => {
              if (writeErr) {
                console.log(`Error writing file: ${writeErr}`);
                event.reply("saveDiaryEntryResponse", {
                  error: writeErr.message,
                });
                return;
              }
              event.reply("saveDiaryEntryResponse", { success: true });
            }
          );
        });
      }
    });
  });

  // 读取日记
  ipcMain.on("loadDiaryEntries", (event) => {
    const filePath = getInstallPath("data", "diary.json");

    fs.access(filePath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        console.log(`File not found: ${filePath}`);
        event.reply("loadDiaryEntriesResponse", { error: "文件不存在" });
        return;
      }

      fs.readFile(filePath, "utf8", (readErr, data) => {
        if (readErr) {
          console.log(`Error reading file: ${readErr}`);
          event.reply("loadDiaryEntriesResponse", { error: readErr.message });
          return;
        }

        let diaryEntries;
        try {
          diaryEntries = JSON.parse(data);
        } catch (parseErr) {
          console.log(`Error parsing JSON: ${parseErr}`);
          event.reply("loadDiaryEntriesResponse", { error: parseErr.message });
          return;
        }

        event.reply("loadDiaryEntriesResponse", {
          success: true,
          data: diaryEntries,
        });
      });
    });
  });

  // 更新日记
  ipcMain.on("editDiaryEntry", (event, entry) => {
    const filePath = getInstallPath("data", "diary.json");

    fs.access(filePath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        event.reply("editDiaryEntryResponse", { error: "文件不存在" });
        return;
      }

      fs.readFile(filePath, "utf8", (readErr, data) => {
        if (readErr) {
          console.log(`Error reading file: ${readErr}`);
          event.reply("editDiaryEntryResponse", { error: readErr.message });
          return;
        }

        let diaryEntries;
        try {
          diaryEntries = JSON.parse(data);
        } catch (parseErr) {
          console.log(`Error parsing JSON: ${parseErr}`);
          event.reply("editDiaryEntryResponse", { error: parseErr.message });
          return;
        }

        const entryIndex = diaryEntries.findIndex((e) => e.time === entry.time);
        if (entryIndex === -1) {
          event.reply("editDiaryEntryResponse", {
            error: "未找到对应的日记条目",
          });
          return;
        }

        // 更新日记条目
        diaryEntries[entryIndex] = entry;

        fs.writeFile(
          filePath,
          JSON.stringify(diaryEntries, null, 2),
          (writeErr) => {
            if (writeErr) {
              console.log(`Error writing file: ${writeErr}`);
              event.reply("editDiaryEntryResponse", {
                error: writeErr.message,
              });
              return;
            }
            event.reply("editDiaryEntryResponse", { success: true });
          }
        );
      });
    });
  });

  // 存储或修改用户信息
  const saveOrUpdateUserInfo = async (event, userInfo) => {
    const filePath = getInstallPath("data", "user.json");

    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
    } catch (accessErr) {
      // 文件不存在，创建并写入初始内容
      try {
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        await fs.promises.writeFile(
          filePath,
          JSON.stringify(userInfo, null, 2)
        );
        console.log(`Created new file: ${filePath}`);
        event.reply("saveOrUpdateUserInfoResponse", { success: true });
      } catch (writeErr) {
        console.log(`Error writing file: ${writeErr}`);
        event.reply("saveOrUpdateUserInfoResponse", {
          error: writeErr.message,
        });
      }
      return;
    }

    // 文件存在，读取现有内容并更新内容
    try {
      await fs.promises.readFile(filePath, "utf8");
      await fs.promises.writeFile(filePath, JSON.stringify(userInfo, null, 2));
      event.reply("saveOrUpdateUserInfoResponse", { success: true });
    } catch (err) {
      console.log(`Error processing file: ${err}`);
      event.reply("saveOrUpdateUserInfoResponse", { error: err.message });
    }
  };

  ipcMain.on("saveOrUpdateUserInfo", (event, userInfo) => {
    saveOrUpdateUserInfo(event, userInfo);
  });

  // 读取用户信息
  ipcMain.on("loadUserInfo", (event) => {
    const filePath = getInstallPath("data", "user.json");

    fs.access(filePath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        console.log(`File not found: ${filePath}`);
        event.reply("loadUserInfoResponse", { error: "文件不存在" });
        return;
      }

      fs.readFile(filePath, "utf8", (readErr, data) => {
        if (readErr) {
          console.log(`Error reading file: ${readErr}`);
          event.reply("loadUserInfoResponse", { error: readErr.message });
          return;
        }

        let userInfo;
        try {
          userInfo = JSON.parse(data);
          if (typeof userInfo === "string") {
            let parsedUserInfo = JSON.parse(userInfo);
            event.reply("loadUserInfoResponse", {
              success: true,
              data: parsedUserInfo,
            });
          }
        } catch (parseErr) {
          console.log(`Error parsing JSON: ${parseErr}`);
          event.reply("loadUserInfoResponse", { error: parseErr.message });
          return;
        }
      });
    });
  });

  // 约会
  ipcMain.on("appointment", (event, data) => {
    // 获取当前天数并且转化为YYYY-MM-DD格式
    const now = dayjs().format("YYYY-MM-DD");
    const [year, month, day] = now.split("-");

    const filePath = getInstallPath("data", year, month, `${day}.json`);

    fs.access(filePath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        console.log(`File not found: ${filePath}`);
        event.reply("appointmentResponse", { error: "今天没有可约会的内容" });
        return;
      } else {
        fs.readFile(filePath, "utf8", (readErr, data) => {
          if (readErr) {
            console.log(`Error reading file: ${readErr}`);
            event.reply("appointmentResponse", { error: readErr.message });
            return;
          }

          let diaryEntries;
          let parsedDiaryEntries;
          try {
            diaryEntries = JSON.parse(data);
            if (typeof diaryEntries === "string") {
              parsedDiaryEntries = JSON.parse(diaryEntries);
            } else {
              parsedDiaryEntries = diaryEntries;
            }
          } catch (parseErr) {
            console.log(`Error parsing JSON: ${parseErr}`);
            event.reply("appointmentResponse", { error: parseErr.message });
            return;
          }
          const resultArray = [];
          for (let i = 0; i < parsedDiaryEntries.elements.length; i++) {
            if (parsedDiaryEntries.elements[i].type === "text") {
              resultArray.push(parsedDiaryEntries.elements[i].text);
            }
          }
          if (resultArray.length > 0) {
            event.reply("appointmentResponse", {
              success: true,
              data: resultArray,
            });
          } else {
            event.reply("appointmentResponse", {
              error: "今天没有可约会的内容",
            });
          }
        });
      }
    });
  });
}

module.exports = { setupIpcHandlers };
