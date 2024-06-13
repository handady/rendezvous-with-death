const { app, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

async function readFile(filePath) {
  const data = await fs.promises.readFile(filePath, "utf8");
  try {
    let parseData = JSON.parse(data);
    let secondParseData = null;
    if (typeof parseData !== "object") {
      secondParseData = JSON.parse(parseData);
    } else {
      secondParseData = parseData;
    }

    return secondParseData;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

async function writeFile(filePath, data) {
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function createFileWithDefaultData(filePath, defaultData) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, defaultData);
}

function setupIpcHandlers(installPath) {
  const getInstallPath = (...subPaths) => path.join(installPath, ...subPaths);

  // 读取excalidraw文件
  ipcMain.on("loadData", async (event, time) => {
    const [year, month, day] = time.split(" ")[0].split("-");
    const filePath = getInstallPath("data", year, month, `${day}.json`);
    console.log(`Loading file from: ${filePath}`);

    try {
      if (!(await fileExists(filePath))) {
        const defaultData = {
          elements: [],
          appState: { viewBackgroundColor: "#fdf8f6" },
          files: {},
        };
        await createFileWithDefaultData(filePath, defaultData);
        console.log(`Created new file: ${filePath}`);
        event.reply("loadDataResponse", defaultData);
      } else {
        const data = await readFile(filePath);
        event.reply("loadDataResponse", data);
      }
    } catch (err) {
      console.log(`Error: ${err}`);
      event.reply("loadDataResponse", { error: err.message });
    }
  });

  // 存储excalidraw文件
  ipcMain.on("saveData", async (event, time, content) => {
    const [year, month, day] = time.split(" ")[0].split("-");
    const dirPath = getInstallPath("data", year, month);
    const filePath = path.join(dirPath, `${day}.json`);

    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
      console.log(`Saving file to: ${filePath}`);
      await writeFile(filePath, content);
      event.reply("saveDataResponse", { success: true });
    } catch (err) {
      console.log(`Error saving file: ${err}`);
      event.reply("saveDataResponse", { error: err.message });
    }
  });

  // 存储日记
  ipcMain.on("saveDiaryEntry", async (event, entry) => {
    const filePath = getInstallPath("data", "diary.json");

    try {
      const exists = await fileExists(filePath);
      let diaryEntries = exists ? await readFile(filePath) : [];

      if (diaryEntries.find((e) => e.time === entry.time)) {
        event.reply("saveDiaryEntryResponse", {
          error: "今天已经添加过日记了",
        });
        return;
      }

      diaryEntries.push(entry);
      await writeFile(filePath, diaryEntries);
      event.reply("saveDiaryEntryResponse", { success: true });
    } catch (err) {
      console.log(`Error: ${err}`);
      event.reply("saveDiaryEntryResponse", { error: err.message });
    }
  });

  // 读取日记
  ipcMain.on("loadDiaryEntries", async (event) => {
    const filePath = getInstallPath("data", "diary.json");

    try {
      if (!(await fileExists(filePath))) {
        event.reply("loadDiaryEntriesResponse", { error: "文件不存在" });
        return;
      }

      const diaryEntries = await readFile(filePath);
      event.reply("loadDiaryEntriesResponse", {
        success: true,
        data: diaryEntries,
      });
    } catch (err) {
      console.log(`Error: ${err}`);
      event.reply("loadDiaryEntriesResponse", { error: err.message });
    }
  });

  // 更新日记
  ipcMain.on("editDiaryEntry", async (event, entry) => {
    const filePath = getInstallPath("data", "diary.json");

    try {
      if (!(await fileExists(filePath))) {
        event.reply("editDiaryEntryResponse", { error: "文件不存在" });
        return;
      }

      let diaryEntries = await readFile(filePath);
      const entryIndex = diaryEntries.findIndex((e) => e.time === entry.time);

      if (entryIndex === -1) {
        event.reply("editDiaryEntryResponse", {
          error: "未找到对应的日记条目",
        });
        return;
      }

      diaryEntries[entryIndex] = entry;
      await writeFile(filePath, diaryEntries);
      event.reply("editDiaryEntryResponse", { success: true });
    } catch (err) {
      console.log(`Error: ${err}`);
      event.reply("editDiaryEntryResponse", { error: err.message });
    }
  });

  // 保存或更新用户信息
  ipcMain.on("saveOrUpdateUserInfo", async (event, userInfo) => {
    const filePath = getInstallPath("data", "user.json");

    try {
      if (!(await fileExists(filePath))) {
        await createFileWithDefaultData(filePath, userInfo);
        console.log(`Created new file: ${filePath}`);
      } else {
        await writeFile(filePath, userInfo);
      }
      event.reply("saveOrUpdateUserInfoResponse", { success: true });
    } catch (err) {
      console.log(`Error: ${err}`);
      event.reply("saveOrUpdateUserInfoResponse", { error: err.message });
    }
  });

  // 读取用户信息
  ipcMain.on("loadUserInfo", async (event) => {
    const filePath = getInstallPath("data", "user.json");

    try {
      if (!(await fileExists(filePath))) {
        event.reply("loadUserInfoResponse", { error: "文件不存在" });
        return;
      }

      const userInfo = await readFile(filePath);
      event.reply("loadUserInfoResponse", { success: true, data: userInfo });
    } catch (err) {
      console.log(`Error: ${err}`);
      event.reply("loadUserInfoResponse", { error: err.message });
    }
  });

  // 约会
  ipcMain.on("appointment", async (event) => {
    const now = dayjs().format("YYYY-MM-DD");
    const [year, month, day] = now.split("-");
    const filePath = getInstallPath("data", year, month, `${day}.json`);
    const diaryFilePath = getInstallPath("data", "diary.json");

    try {
      if (!(await fileExists(filePath))) {
        event.reply("appointmentResponse", { error: "今天没有可约会的内容" });
        return;
      }

      const fileData = await readFile(filePath);
      const resultArray = fileData.elements
        .filter((element) => element.type === "text")
        .map((element) => element.text);

      if (resultArray.length === 0) {
        event.reply("appointmentResponse", { error: "今天没有可约会的内容" });
        return;
      }

      if (!(await fileExists(diaryFilePath))) {
        event.reply("appointmentResponse", { error: "今天没有可约会的内容" });
        return;
      }

      const diaryEntries = await readFile(diaryFilePath);
      const todayData = diaryEntries.filter((item) => item.time === now);

      event.reply("appointmentResponse", {
        success: true,
        data: { content: resultArray, diary: todayData },
      });
    } catch (err) {
      console.log(`Error: ${err}`);
      event.reply("appointmentResponse", { error: err.message });
    }
  });

  // 保存约会内容
  ipcMain.on("saveAppointment", async (event, content) => {
    const now = dayjs().format("YYYY-MM-DD");
    const filePath = getInstallPath("data", "diary.json");

    try {
      const diaryEntries = await readFile(filePath);
      const targetObject = diaryEntries.find((item) => item.time === now);

      if (targetObject) {
        targetObject.appointmentTheme = content.appointmentTheme;
        targetObject.appointmentContent = content.appointmentContent;
        await writeFile(filePath, diaryEntries);
        event.reply("saveAppointmentResponse", { success: true });
      } else {
        event.reply("saveAppointmentResponse", {
          error: "未找到对应的日记条目",
        });
      }
    } catch (err) {
      console.log(`Error: ${err}`);
      event.reply("saveAppointmentResponse", { error: err.message });
    }
  });
}

module.exports = { setupIpcHandlers };
