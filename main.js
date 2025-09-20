// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "icon.ico"),
    width: 1000,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadFile("dist/gallery/browser/index.html");
  mainWindow.loadURL(`file://${__dirname}/dist/gallery/browser/index.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

if (require("electron-squirrel-startup")) app.quit();

async function handlePathSearchDialog() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (!canceled) {
    return filePaths[0];
  }
}

async function handlePathSearch(filePath) {
  return fs.readdirSync(filePath, {
    withFileTypes: true,
    recursive: true,
  });
}

async function handleFileDelete(filePath) {
  try {
    fs.unlinkSync(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("search:dialog", handlePathSearchDialog);
  ipcMain.on("show:file", (event, filePath) => {
    shell.showItemInFolder(filePath);
  });
  ipcMain.on("show:folder", (event, folderPath) => {
    shell.openPath(folderPath);
  });
  ipcMain.handle("search:folder", (event, folderPath) => {
    const res = handlePathSearch(folderPath);
    return res;
  });
  ipcMain.handle("delete:file", (event, filePath) =>
    handleFileDelete(filePath)
  );

  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
