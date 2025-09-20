// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  searchDialog: () => ipcRenderer.invoke("search:dialog"),
  searchFolder: (/** @type {string} */ folderPath) =>
    ipcRenderer.invoke("search:folder", folderPath),
  showFile: (/** @type {string} */ filePath) =>
    ipcRenderer.send("show:file", filePath),
  showFolder: (/** @type {string} */ folderPath) =>
    ipcRenderer.send("show:folder", folderPath),
  deleteFile: (/** @type {string} */ filePath) =>
    ipcRenderer.invoke("delete:file", filePath),
});
