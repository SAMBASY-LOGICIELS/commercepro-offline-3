const { app, BrowserWindow, Menu, shell, session } = require("electron");
const path = require("path");

app.setAppUserModelId("com.sambasylogiciels.commercepro");

// Une seule fenêtre à la fois : évite deux instances sur la même base de données
const gotLock = app.requestSingleInstanceLock();
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 900,
    minHeight: 600,
    show: false,
    backgroundColor: "#f1f5f9",
    title: "CommercePro Offline — Samba Sy Logiciels",
    icon: path.join(__dirname, "build", "icon.ico"),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });

  win.once("ready-to-show", () => {
    win.maximize();
    win.show();
  });

  win.loadFile(path.join(__dirname, "www", "index.html"));

  // L'application reste enfermée dans sa fenêtre : tout lien externe s'ouvre dans le navigateur
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file://")) event.preventDefault();
  });

  win.on("closed", () => { win = null; });
}

if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    // Aucune permission (caméra, micro, géolocalisation...) n'est nécessaire
    session.defaultSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
