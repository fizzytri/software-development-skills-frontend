const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const menuLinks = document.querySelectorAll(".menu-nav-link, .menu-nav .btn");
const accordionHeaders = document.querySelectorAll(".accordion-header");

function toggleMenu() {
  const isOpen = menu.classList.toggle("is-active");
  hamburger.classList.toggle("is-active", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
}

function closeMenu() {
  menu.classList.remove("is-active");
  hamburger.classList.remove("is-active");
  hamburger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", toggleMenu);
menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) closeMenu();
});

accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.parentElement;
    const body = item.querySelector(".accordion-body");
    const isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".accordion-item").forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector(".accordion-body").style.maxHeight = null;
      other.querySelector(".accordion-header").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      body.style.maxHeight = body.scrollHeight + "px";
      header.setAttribute("aria-expanded", "true");
    }
  });
});
