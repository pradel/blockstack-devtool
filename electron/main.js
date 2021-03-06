const { app, dialog, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const { readdirSync, readFileSync } = require("fs");
const Store = require("electron-store");

let mainWindow;

function createWindow() {
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "../index.html"),
      protocol: "file:",
      slashes: true,
    });
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadURL(startUrl);
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle("select-project-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  return result;
});

ipcMain.handle("get-folder-at-path", async (event, folderPath) => {
  const result = readdirSync(folderPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  return result;
});

ipcMain.handle("get-files-at-path", async (event, folderPath) => {
  const result = readdirSync(folderPath, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);
  return result;
});

ipcMain.handle("get-file-at-path", async (event, filePath) => {
  const result = readFileSync(filePath).toString();
  return result;
});

ipcMain.handle("get-project-store-value", async (event, folderPath, key) => {
  const store = new Store({
    cwd: folderPath,
  });
  const result = store.get(key);
  return result;
});

ipcMain.handle(
  "set-project-store-value",
  async (event, folderPath, key, value) => {
    const store = new Store({
      cwd: folderPath,
    });
    const result = store.set(key, value);
    return result;
  }
);
