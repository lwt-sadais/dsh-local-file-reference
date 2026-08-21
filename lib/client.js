window.__ModuleLoader__.load({ id: 'dsh-local-file-reference', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.js
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(client_exports);
var SOURCE = "local-file-attachment";
var STYLE_ID = "dsh-local-file-attachment-style";
var CARD_HOST_ATTRIBUTE = "data-local-file-attachments";
var filesBySession = /* @__PURE__ */ new Map();
function currentInfo(ctx) {
  return ctx.sessions.currentProvideInfo.getSnapshot();
}
function currentSessionId(ctx) {
  return ctx.sessions.list.getSnapshot().current;
}
function recordsFor(sessionId) {
  let records = filesBySession.get(sessionId);
  if (records === void 0) {
    records = /* @__PURE__ */ new Map();
    filesBySession.set(sessionId, records);
  }
  return records;
}
function encodeReference(record) {
  return encodeURIComponent(JSON.stringify({ path: record.path, name: record.name, size: record.size }));
}
function decodeReference(ref) {
  const value = JSON.parse(decodeURIComponent(ref));
  if (typeof value.path !== "string" || value.path.trim() === "") throw new Error("\u672C\u5730\u9644\u4EF6\u8DEF\u5F84\u65E0\u6548");
  return {
    path: value.path,
    name: typeof value.name === "string" && value.name !== "" ? value.name : value.path,
    size: typeof value.size === "number" ? value.size : 0
  };
}
function serializeReference(ref) {
  const file = decodeReference(ref);
  return `
<local_file path=${JSON.stringify(file.path)} name=${JSON.stringify(file.name)}>\u8BF7\u5728\u9700\u8981\u65F6\u4F7F\u7528\u5408\u9002\u7684\u672C\u5730\u6587\u4EF6\u5DE5\u5177\u6309\u6B64\u8DEF\u5F84\u8BFB\u53D6\uFF1B\u4E0D\u8981\u5047\u8BBE\u6587\u4EF6\u5185\u5BB9\u3002</local_file>
`;
}
function displaySize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
function installStyle() {
  if (document.getElementById(STYLE_ID) !== null) return () => {
  };
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
[data-decoration="chip"][title^="\u672C\u5730\u9644\u4EF6\uFF1A"] { display: none !important; }
[${CARD_HOST_ATTRIBUTE}] { display:flex; flex-wrap:wrap; gap:8px; padding:0 12px 0; }
.dshLocalFileCard { box-sizing:border-box; max-width:270px; height:38px; display:flex; align-items:center; gap:8px; padding:0 9px; border:1px solid var(--dsw-alias-border-l2, #d9dce1); border-radius:7px; background:var(--dsw-alias-bg-layer-2, #f7f8fa); color:var(--dsw-alias-label-primary, #292d33); font-size:13px; line-height:18px; }
.dshLocalFileIcon { width:18px; height:18px; flex:none; color:var(--dsw-alias-state-business-primary, #2784ff); }
.dshLocalFileText { min-width:0; flex:1; }
.dshLocalFileName { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dshLocalFileMeta { color:var(--dsw-alias-label-caption, #8b919a); font-size:10px; line-height:11px; }
.dshLocalFileRemove { width:20px; height:20px; flex:none; display:grid; place-items:center; border:0; border-radius:5px; padding:0; background:transparent; color:var(--dsw-alias-label-tertiary, #777d86); cursor:pointer; font-size:16px; }
.dshLocalFileRemove:hover { background:var(--dsw-alias-interactive-bg-hover, #e8e9ec); color:var(--dsw-alias-label-primary, #292d33); }
`;
  document.head.append(style);
  return () => style.remove();
}
function fileIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "dshLocalFileIcon");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = '<path d="M5 2.75h6.1L15 6.65v10.6H5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M11 2.9v3.9h3.9M7.5 10h5M7.5 13h5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>';
  return svg;
}
function removeReference(ctx, sessionId, ref) {
  const info = currentInfo(ctx);
  if (info.sessionId !== sessionId) return;
  const input = info.hooks.input?.getSnapshot();
  const actions = info.props.inputActions;
  if (input === void 0 || actions === void 0) return;
  const occurrence = input.occurrences.find((item) => item.source === SOURCE && item.ref === ref);
  if (occurrence === void 0) return;
  actions.setDraft(input.draft.slice(0, occurrence.offset) + input.draft.slice(occurrence.offset + 1));
  recordsFor(sessionId).delete(ref);
}
function renderCards(ctx) {
  const sessionId = currentSessionId(ctx);
  const info = currentInfo(ctx);
  const composer = document.querySelector("[data-composer-card]");
  if (!(composer instanceof HTMLElement)) return;
  let host = composer.querySelector(`[${CARD_HOST_ATTRIBUTE}]`);
  if (!(host instanceof HTMLElement)) {
    host = document.createElement("div");
    host.setAttribute(CARD_HOST_ATTRIBUTE, "");
    composer.prepend(host);
  }
  host.replaceChildren();
  if (sessionId === void 0 || info.sessionId !== sessionId) return;
  const input = info.hooks.input?.getSnapshot();
  if (input === void 0) return;
  const live = input.occurrences.filter((item) => item.source === SOURCE);
  const records = recordsFor(sessionId);
  for (const occurrence of live) {
    let record = records.get(occurrence.ref);
    if (record === void 0) {
      try {
        record = decodeReference(occurrence.ref);
      } catch {
        continue;
      }
      records.set(occurrence.ref, record);
    }
    const card = document.createElement("div");
    card.className = "dshLocalFileCard";
    card.title = record.path;
    card.append(fileIcon());
    const text = document.createElement("div");
    text.className = "dshLocalFileText";
    const name2 = document.createElement("div");
    name2.className = "dshLocalFileName";
    name2.textContent = record.name;
    const meta = document.createElement("div");
    meta.className = "dshLocalFileMeta";
    meta.textContent = displaySize(record.size);
    text.append(name2, meta);
    card.append(text);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "dshLocalFileRemove";
    remove.setAttribute("aria-label", `\u79FB\u9664 ${record.name}`);
    remove.textContent = "\xD7";
    remove.addEventListener("click", () => removeReference(ctx, sessionId, occurrence.ref));
    card.append(remove);
    host.append(card);
  }
  host.hidden = host.childElementCount === 0;
}
function addFileReference(ctx, textarea, file, path) {
  const sessionId = currentSessionId(ctx);
  if (sessionId === void 0) throw new Error("\u8BF7\u5148\u8FDB\u5165\u4E00\u4E2A\u4F1A\u8BDD\u518D\u6DFB\u52A0\u9644\u4EF6");
  const info = currentInfo(ctx);
  const input = info.hooks.input?.getSnapshot();
  const actx = ctx.sessions.scope(sessionId);
  if (info.sessionId !== sessionId || input === void 0 || actx === void 0) throw new Error("\u5F53\u524D\u4F1A\u8BDD\u8F93\u5165\u6846\u5C1A\u672A\u5C31\u7EEA");
  const record = { path, name: file.name || path.split(/[\\/]/u).pop() || path, size: file.size };
  const ref = encodeReference(record);
  const accepted = actx.bail(actx, "slash/input-insert-reference", {
    reference: { source: SOURCE, ref, label: `\u672C\u5730\u9644\u4EF6\uFF1A${record.name}`, clipboardText: record.path },
    span: {
      start: textarea.selectionStart ?? input.draft.length,
      end: textarea.selectionEnd ?? textarea.selectionStart ?? input.draft.length,
      draftRev: input.draftRev
    }
  });
  if (accepted !== true) throw new Error("\u5F53\u524D\u8F93\u5165\u72B6\u6001\u6682\u65F6\u4E0D\u80FD\u6DFB\u52A0\u9644\u4EF6");
  recordsFor(sessionId).set(ref, record);
}
function installClipboard(ctx) {
  const onPaste = (event) => {
    if (!(event.target instanceof HTMLTextAreaElement)) return;
    const files = Array.from(event.clipboardData?.files ?? []);
    if (files.length === 0) return;
    const bridge = window.__DSH_DESKTOP_FILE_PATH__;
    if (bridge === void 0 || typeof bridge.getPathForFile !== "function") return;
    const resolved = files.map((file) => ({ file, path: bridge.getPathForFile(file).trim() })).filter((item) => item.path !== "");
    if (resolved.length === 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    try {
      for (const item of resolved) addFileReference(ctx, event.target, item.file, item.path);
      renderCards(ctx);
    } catch (error) {
      console.error("[dsh-local-file-attachment] failed:", error);
    }
  };
  document.addEventListener("paste", onPaste, true);
  return () => document.removeEventListener("paste", onPaste, true);
}
function installRenderer(ctx) {
  let offInput = () => {
  };
  const bindCurrentInput = () => {
    offInput();
    const input = currentInfo(ctx).hooks.input;
    offInput = input?.subscribe(() => queueMicrotask(() => renderCards(ctx))) ?? (() => {
    });
    queueMicrotask(() => renderCards(ctx));
  };
  const offCurrent = ctx.sessions.currentProvideInfo.subscribe(bindCurrentInput);
  const observer = new MutationObserver(() => {
    const composer = document.querySelector("[data-composer-card]");
    if (composer instanceof HTMLElement && composer.querySelector(`[${CARD_HOST_ATTRIBUTE}]`) === null) renderCards(ctx);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  bindCurrentInput();
  return () => {
    offInput();
    offCurrent();
    observer.disconnect();
    document.querySelectorAll(`[${CARD_HOST_ATTRIBUTE}]`).forEach((node) => node.remove());
  };
}
var name = "dsh-local-file-reference";
var inject = ["sessions", "inputTriggers"];
function apply(ctx) {
  ctx.effect(() => ctx.inputTriggers.registerSource({
    trigger: "@",
    name: SOURCE,
    candidates: () => Promise.resolve([]),
    onPick: () => "handled",
    codec: {
      clipboardText: (ref) => decodeReference(ref).path,
      serialize: (ref) => Promise.resolve(serializeReference(ref))
    }
  }), "local-file-attachment: reference codec");
  ctx.effect(installStyle, "local-file-attachment: styles");
  ctx.effect(() => installClipboard(ctx), "local-file-attachment: clipboard listener");
  ctx.effect(() => installRenderer(ctx), "local-file-attachment: card renderer");
}
return module.exports; } });
//# sourceMappingURL=client.js.map
