// DOM Elements
const navToggle = document.getElementById("nav-toggle");
const navList = document.getElementById("nav-list");
const navLinks = document.querySelectorAll(".nav__link");
const darkToggle = document.getElementById("dark-toggle");
const form = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

// Mobile nav toggle
navToggle.addEventListener("click", () => {
  navList.classList.toggle("active");
});

// Close mobile nav on link click
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navList.classList.remove("active");
  });
});

// Scroll highlight active nav link
window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY + 100; // offset for fixed header
  navLinks.forEach((link) => {
    const section = document.querySelector(link.hash);
    if (section) {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    }
  });
});

// Dark mode toggle
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

function setDarkMode(dark) {
  if (dark) {
    document.documentElement.style.setProperty("--navy", "#0a1e3f");
    document.documentElement.style.setProperty("--navy-light", "#12315a");
    document.documentElement.style.setProperty("--white", "#f0f4f8");
    document.documentElement.style.setProperty("--slate", "#94a3b8");
    document.documentElement.style.setProperty("--accent", "#3c82f6");
  } else {
    document.documentElement.style.setProperty("--navy", "#f0f4f8");
    document.documentElement.style.setProperty("--navy-light", "#d0e0ff");
    document.documentElement.style.setProperty("--white", "#0a1e3f");
    document.documentElement.style.setProperty("--slate", "#5a677d");
    document.documentElement.style.setProperty("--accent", "#155ddb");
  }
}

function toggleDarkMode() {
  const isDark =
    document.documentElement.style.getPropertyValue("--navy") === "#0a1e3f";
  setDarkMode(!isDark);
}

darkToggle.addEventListener("click", toggleDarkMode);

// Set initial theme based on system preference
setDarkMode(prefersDarkScheme.matches);

// Contact form validation & mock submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  formMessage.textContent = "";

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    formMessage.textContent = "Please fill all fields.";
    formMessage.style.color = "red";
    return;
  }
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formMessage.textContent = "Please enter a valid email.";
    formMessage.style.color = "red";
    return;
  }

  // Simulate successful submission
  formMessage.textContent =
    "Thank you for your message! I will get back to you soon.";
  formMessage.style.color = "limegreen";
  form.reset();
});
