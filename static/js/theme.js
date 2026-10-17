(() => {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  const labelText = toggle.querySelector(".theme-toggle-label");
  const symbol = toggle.querySelector(".theme-toggle-symbol");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const isDark = () => root.dataset.theme === "dark" || (!root.dataset.theme && systemTheme.matches);

  function updateToggle() {
    const dark = isDark();
    const label = dark ? "Light mode" : "Dark mode";
    labelText.textContent = label;
    symbol.textContent = dark ? "☀" : "☾";
    toggle.setAttribute("aria-label", `Switch to ${label.toLowerCase()}`);
    if (themeColor) themeColor.content = dark ? "#191b18" : "#f8f7f4";
  }

  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    const nextTheme = isDark() ? "light" : "dark";
    root.dataset.theme = nextTheme;
    try { localStorage.setItem("theme", nextTheme); } catch (_) {}
    updateToggle();
  });
  systemTheme.addEventListener("change", updateToggle);
  updateToggle();
})();
