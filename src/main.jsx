import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

function showError(label, err) {
  const root = document.getElementById("root");
  const el = document.createElement("pre");
  el.style.cssText = "padding:24px;white-space:pre-wrap;font-family:monospace;background:#fff8f0;color:#7a2e00";
  el.textContent = label + ":\n" + (err && (err.stack || err.message) || String(err));
  if (root) { root.innerHTML = ""; root.appendChild(el); }
  else document.body.appendChild(el);
}

try {
  createRoot(document.getElementById("root")).render(
    <StrictMode><App /></StrictMode>
  );
} catch (err) {
  showError("App error", err);
}

window.addEventListener("error", (e) => showError("Load error", e.error || e.message));
window.addEventListener("unhandledrejection", (e) => showError("Async error", e.reason));
