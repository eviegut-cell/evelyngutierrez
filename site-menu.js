const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector("#siteMenu");

if (menuToggle && siteMenu) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open menu" : "Close menu");
    siteMenu.hidden = isExpanded;
  });

  document.addEventListener("click", (event) => {
    if (!siteMenu.hidden && !siteMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      siteMenu.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !siteMenu.hidden) {
      siteMenu.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      menuToggle.focus();
    }
  });
}
