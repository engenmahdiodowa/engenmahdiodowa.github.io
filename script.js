// DOM Elements
const navToggle = document.getElementById("nav-toggle");
const navList = document.getElementById("nav-list");
const navLinks = document.querySelectorAll(".nav__link");
const darkToggle = document.getElementById("dark-toggle");
const form = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

// Mobile nav toggle
navToggle?.addEventListener("click", () => {
  navList?.classList.toggle("active");
  // Update aria-expanded for accessibility
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
});

// Close mobile nav on link click
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navList?.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Scroll highlight active nav link
window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY + 120; // adjust for header height
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
  const root = document.documentElement;
  if (dark) {
    root.style.setProperty("--navy", "#0a1e3f");
    root.style.setProperty("--navy-light", "#12315a");
    root.style.setProperty("--white", "#f0f4f8");
    root.style.setProperty("--slate", "#94a3b8");
    root.style.setProperty("--accent", "#3c82f6");
    darkToggle.textContent = "☀️"; // Sun icon for light mode
  } else {
    root.style.setProperty("--navy", "#f0f4f8");
    root.style.setProperty("--navy-light", "#d0e0ff");
    root.style.setProperty("--white", "#0a1e3f");
    root.style.setProperty("--slate", "#5a677d");
    root.style.setProperty("--accent", "#155ddb");
    darkToggle.textContent = "🌙"; // Moon icon for dark mode
  }
  localStorage.setItem("darkMode", dark);
}

function toggleDarkMode() {
  const isDark =
    document.documentElement.style.getPropertyValue("--navy") === "#0a1e3f";
  setDarkMode(!isDark);
}

darkToggle?.addEventListener("click", toggleDarkMode);

// Initialize theme from localStorage or system preference
const savedDarkMode = localStorage.getItem("darkMode");
if (savedDarkMode !== null) {
  setDarkMode(savedDarkMode === "true");
} else {
  setDarkMode(prefersDarkScheme.matches);
}

// Contact form validation and feedback
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  formMessage.textContent = "";
  formMessage.style.color = "";

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    formMessage.textContent = "Please fill all fields.";
    formMessage.style.color = "var(--error-color)";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formMessage.textContent = "Please enter a valid email.";
    formMessage.style.color = "var(--error-color)";
    return;
  }

  // Here you could add actual form submission logic, e.g., AJAX call to your backend

  formMessage.textContent =
    "Thank you for your message! I will get back to you soon.";
  formMessage.style.color = "var(--success-color)";
  form.reset();
});

// Image Lightbox Gallery

const galleryImages = document.querySelectorAll(".personal-photo-card img");
const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox.querySelector(".lightbox__image");
const lightboxCaption = lightbox.querySelector(".lightbox__caption");
const closeBtn = lightbox.querySelector(".lightbox__close");
const prevBtn = lightbox.querySelector(".lightbox__prev");
const nextBtn = lightbox.querySelector(".lightbox__next");

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  updateLightboxImage();
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeBtn.focus();
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updateLightboxImage() {
  const img = galleryImages[currentIndex];
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = img.alt || "";
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  updateLightboxImage();
}

function showPrevImage() {
  currentIndex =
    (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  updateLightboxImage();
}

// Open lightbox on image click
galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => openLightbox(index));
  img.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox(index);
    }
  });
});

// Close lightbox events
closeBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Navigation buttons
nextBtn.addEventListener("click", showNextImage);
prevBtn.addEventListener("click", showPrevImage);

// Keyboard navigation inside lightbox
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  switch (e.key) {
    case "Escape":
      closeLightbox();
      break;
    case "ArrowRight":
      showNextImage();
      break;
    case "ArrowLeft":
      showPrevImage();
      break;
  }
});
