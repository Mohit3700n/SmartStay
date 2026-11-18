import { appendFileSync } from "node:fs";
import { app, BrowserWindow, dialog, shell } from "electron";
import net from "node:net";
import path from "node:path";
import { pathToFileURL } from "node:url";

const host = "127.0.0.1";
const startupTimeoutMs = 60_000;
let mainWindow;

function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", reject);
    probe.listen(0, host, () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        probe.close(() => reject(new Error("Could not reserve a local port.")));
        return;
      }

      probe.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(address.port);
      });
    });
  });
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function logStartup(message) {
  const logPath = path.join(app.getPath("userData"), "startup.log");
  appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`);
}

async function waitForServer(url) {
  const deadline = Date.now() + startupTimeoutMs;
  let lastError = "No response from the local app server.";

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.status < 500) {
        await response.body?.cancel();
        return;
      }
      lastError = `The local app server returned HTTP ${response.status}.`;
      await response.body?.cancel();
    } catch (error) {
      lastError = error.message;
    }

    await wait(250);
  }

  throw new Error(`The local app server did not start: ${lastError}`);
}

function getServerDirectory() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "app-server")
    : path.join(__dirname, "..", ".next", "standalone");
}

async function startServer() {
  const serverDirectory = getServerDirectory();
  const serverPath = path.join(serverDirectory, "server.js");
  const port = await getAvailablePort();

  logStartup(`Starting local server from ${serverPath} on port ${port}.`);
  process.env.HOSTNAME = host;
  process.env.NODE_ENV = "production";
  process.env.PORT = String(port);
  await import(pathToFileURL(serverPath).href);

  const url = `http://${host}:${port}`;
  logStartup("Waiting for the local server to become ready.");
  await waitForServer(url);
  logStartup("Local server is ready.");
  return url;
}

function openWindow(url) {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 900,
    minHeight: 650,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const appOrigin = new URL(url).origin;
  mainWindow.webContents.setWindowOpenHandler(({ url: targetUrl }) => {
    if (targetUrl.startsWith("https://")) {
      void shell.openExternal(targetUrl);
    }
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, targetUrl) => {
    if (new URL(targetUrl).origin !== appOrigin) {
      event.preventDefault();
      if (targetUrl.startsWith("https://")) {
        void shell.openExternal(targetUrl);
      }
    }
  });
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  void mainWindow.loadURL(url);
}

const hasSingleInstance = app.requestSingleInstanceLock();
if (!hasSingleInstance) {
  app.quit();
} else {
  app.on("second-instance", () => mainWindow?.focus());
  app.whenReady().then(async () => {
    app.setAppUserModelId("com.smartstay.desktop");
    try {
      const url = await startServer();
      openWindow(url);
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      logStartup(`Startup failed: ${details}`);
      dialog.showErrorBox(
        "SmartStay could not start",
        `${details}\n\nSee ${path.join(app.getPath("userData"), "startup.log")} for startup details.`,
      );
      app.quit();
    }
  });
  app.on("window-all-closed", () => app.quit());
}
