// 共享工具：配置加载、parse5 解析、文本折叠（build/check/serve 公用）
const fs = require("fs");
const path = require("path");
const parse5 = require("parse5");

const ROOT = path.join(__dirname, "..");

function readConfig() {
  return JSON.parse(
    fs.readFileSync(path.join(ROOT, "config", "site.json"), "utf8"),
  );
}

function parseHtml(raw) {
  return parse5.parse(raw, { sourceCodeLocationInfo: true });
}

// 压缩内部空白为单空格（保留 &nbsp; 对应的 \u00A0，避免破坏排版意图），并去除首尾
function collapse(s) {
  return s.replace(/[^\S\u00A0]+/g, " ").trim();
}

module.exports = { ROOT, readConfig, parseHtml, collapse };
