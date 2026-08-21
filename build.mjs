import { build } from "esbuild";
import { mkdir } from "node:fs/promises";

await mkdir("lib", { recursive: true });
await build({ entryPoints: ["src/index.js"], outfile: "lib/index.js", bundle: true, format: "esm", platform: "node", target: "node22", sourcemap: true });
await build({ entryPoints: ["src/client.js"], outfile: "lib/client.js", bundle: true, format: "cjs", platform: "browser", target: "es2022", sourcemap: true, banner: { js: "window.__ModuleLoader__.load({ id: 'dsh-local-file-reference', factory: (require) => { var module = { exports: {} }; var exports = module.exports;" }, footer: { js: "return module.exports; } });" } });
