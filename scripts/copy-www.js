/**
 * Copies web assets from the project root into the www/ directory
 * that Capacitor uses as its webDir.
 *
 * Run:  npm run build
 */

var fs = require("fs");
var path = require("path");

var ROOT = path.resolve(__dirname, "..");
var WWW = path.join(ROOT, "www");

// Files to copy (relative to project root)
var FILES = [
  "index.html",
  "app.js",
  "style.css",
  "manifest.json",
  "privacy.html"
];

// Directories to copy recursively
var DIRS = ["assets"];

// ── helpers ───────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  var entries = fs.readdirSync(src, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var srcPath = path.join(src, entry.name);
    var destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ── main ──────────────────────────────────────────────────

ensureDir(WWW);

FILES.forEach(function (file) {
  var src = path.join(ROOT, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(WWW, file));
    console.log("  copied " + file);
  } else {
    console.warn("  SKIP   " + file + " (not found)");
  }
});

DIRS.forEach(function (dir) {
  var src = path.join(ROOT, dir);
  if (fs.existsSync(src)) {
    copyDir(src, path.join(WWW, dir));
    console.log("  copied " + dir + "/");
  } else {
    console.warn("  SKIP   " + dir + "/ (not found)");
  }
});

console.log("Build complete → www/");
