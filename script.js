document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const timeElement = document.querySelector('[data-testid="test-user-time"]');
  const toggleBtn = document.getElementById("theme-toggle");

  function updateTime() {
    const now = Date.now();
    timeElement.textContent = now;
  }

  updateTime();
  setInterval(updateTime, 1000); 

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    root.classList.add("light");
    toggleBtn.textContent = "🌙";
  } else {
    toggleBtn.textContent = "☀️";
  }

  toggleBtn.addEventListener("click", () => {
    root.classList.add("theme-transition");
    const isLight = root.classList.toggle("light");
    toggleBtn.textContent = isLight ? "🌙" : "☀️";
    localStorage.setItem("theme", isLight ? "light" : "dark");
    setTimeout(() => root.classList.remove("theme-transition"), 500);
  });
});
