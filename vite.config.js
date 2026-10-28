import { defineConfig, createServer } from "vite";
import react from "@vitejs/plugin-react";
import { readFile, writeFile } from "node:fs/promises";

const prerender = {
  name: "prerender",
  apply: "build",
  async closeBundle() {
    const vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
    const { default: App } = await vite.ssrLoadModule("/src/App.jsx");
    const { renderToString } = await import("react-dom/server");
    const { createElement } = await import("react");
    const html = await readFile("dist/index.html", "utf8");
    await writeFile("dist/index.html", html.replace('<div id="root"></div>', `<div id="root">${renderToString(createElement(App))}</div>`));
    await vite.close();
  },
};

export default defineConfig({ plugins: [react(), prerender] });
