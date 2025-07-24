document.addEventListener("DOMContentLoaded", () => {
  const projectGrid = document.getElementById("projectGrid");
  const navToggle = document.getElementById("nav-toggle");
  const navList = document.getElementById("nav-list");
  const darkToggle = document.getElementById("dark-toggle");
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // --- Utility: debounce function to limit rapid firing ---
  function debounce(func, wait = 200) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // --- Utility: Create GitHub SVG icon ---
  function createGitHubIcon() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.style.width = "16px";
    svg.style.height = "16px";
    svg.style.marginLeft = "6px";
    svg.innerHTML = `
      <path fill="currentColor" d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.28 3.438 9.76 8.205 11.34.6.11.82-.26.82-.58 0-.29-.01-1.05-.015-2.06-3.338.73-4.042-1.61-4.042-1.61-.546-1.38-1.333-1.75-1.333-1.75-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.235 1.84 1.235 1.07 1.83 2.805 1.3 3.49.995.11-.775.42-1.3.76-1.6-2.665-.3-5.467-1.335-5.467-5.935 0-1.31.465-2.38 1.235-3.22-.125-.3-.535-1.52.115-3.165 0 0 1.005-.32 3.3 1.23a11.46 11.46 0 013.005-.405c1.02.005 2.045.14 3.005.405 2.29-1.55 3.295-1.23 3.295-1.23.655 1.645.245 2.865.12 3.165.77.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.63-5.475 5.92.43.37.81 1.1.81 2.22 0 1.6-.015 2.89-.015 3.28 0 .32.21.7.825.58C20.565 22.25 24 17.78 24 12.5 24 5.87 18.63.5 12 .5z"/>
    `;
    return svg;
  }

  // --- Create truncated description with "Read more" toggle ---
  function createDescription(description) {
    const maxLength = 120;
    if (description.length <= maxLength) {
      const p = document.createElement("p");
      p.textContent = description;
      return p;
    }

    const p = document.createElement("p");
    p.textContent = description.slice(0, maxLength) + "...";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.textContent = "Read more";
    toggleBtn.style.marginLeft = "8px";
    toggleBtn.style.fontWeight = "600";
    toggleBtn.style.background = "none";
    toggleBtn.style.border = "none";
    toggleBtn.style.color = "var(--accent)";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.userSelect = "none";
    toggleBtn.style.textDecoration = "underline";

    let expanded = false;
    toggleBtn.addEventListener("click", () => {
      if (!expanded) {
        p.textContent = description;
        toggleBtn.textContent = "Show less";
      } else {
        p.textContent = description.slice(0, maxLength) + "...";
        toggleBtn.textContent = "Read more";
      }
      expanded = !expanded;
      p.appendChild(toggleBtn);
    });

    p.appendChild(toggleBtn);
    return p;
  }

  // --- Load projects.json and render project cards asynchronously with animations ---
  async function loadProjects() {
    try {
      const response = await fetch("projects.json");
      if (!response.ok)
        throw new Error(`Failed to load projects.json (${response.status})`);
      const projects = await response.json();

      if (!Array.isArray(projects) || projects.length === 0) {
        projectGrid.innerHTML = "<p>No projects found.</p>";
        return;
      }

      projectGrid.innerHTML = ""; // Clear existing content

      projects.forEach(({ image, title, description, link }) => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.tabIndex = 0; // Make card focusable for keyboard users

        // Create img element with lazy loading
        const img = document.createElement("img");
        img.src = image;
        img.alt = title;
        img.loading = "lazy";

        // Card content container
        const cardContent = document.createElement("div");
        cardContent.className = "card-content";

        // Title
        const h3 = document.createElement("h3");
        h3.textContent = title;

        // Description with toggle
        const desc = createDescription(description);

        // Link with GitHub icon
        const linkEl = document.createElement("a");
        linkEl.href = link;
        linkEl.target = "_blank";
        linkEl.rel = "noopener noreferrer";
        linkEl.setAttribute("aria-label", `View ${title} on GitHub`);
        linkEl.textContent = "View on GitHub";
        linkEl.appendChild(createGitHubIcon());

        cardContent.append(h3, desc, linkEl);
        card.append(img, cardContent);

        projectGrid.appendChild(card);
      });

      // Animate project cards on scroll using IntersectionObserver
      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15,
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      document.querySelectorAll(".project-card").forEach((card) => {
        observer.observe(card);
      });
    } catch (error) {
      projectGrid.innerHTML = `<p style="color: var(--error-color);">Error loading projects: ${error.message}</p>`;
      console.error(error);
    }
  }

  // --- Mobile Navigation Toggle ---
  function toggleNav() {
    const isActive = navList.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", isActive);
  }
  navToggle.addEventListener("click", debounce(toggleNav));

  // Close mobile nav when any link inside nav-list is clicked
  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // --- Dark Mode Toggle with Persistence and System Preference Sync ---
  function setDarkMode(enabled) {
    if (enabled) {
      document.body.classList.add("dark");
      darkToggle.textContent = "☀️";
      darkToggle.setAttribute("aria-pressed", "true");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark");
      darkToggle.textContent = "🌙";
      darkToggle.setAttribute("aria-pressed", "false");
      localStorage.setItem("darkMode", "disabled");
    }
  }

  (function initDarkMode() {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "enabled") {
      setDarkMode(true);
    } else if (savedMode === "disabled") {
      setDarkMode(false);
    } else {
      setDarkMode(prefersDarkScheme.matches);
    }
  })();

  prefersDarkScheme.addEventListener("change", (e) => {
    if (!localStorage.getItem("darkMode")) {
      setDarkMode(e.matches);
    }
  });

  darkToggle.addEventListener("click", () => {
    setDarkMode(!document.body.classList.contains("dark"));
  });

  // --- Contact Form Submission Handler (client-side simulation) ---
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      formMessage.textContent = "Please fill in all fields.";
      formMessage.style.color = "var(--error-color)";
      formMessage.focus();
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formMessage.textContent = "Please enter a valid email address.";
      formMessage.style.color = "var(--error-color)";
      formMessage.focus();
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    formMessage.textContent = "Sending...";
    formMessage.style.color = "var(--accent)";

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      formMessage.textContent = "Thank you! Your message has been sent.";
      formMessage.style.color = "var(--success-color)";
      contactForm.reset();
    } catch {
      formMessage.textContent = "Oops! Something went wrong. Please try again.";
      formMessage.style.color = "var(--error-color)";
    } finally {
      submitBtn.disabled = false;
    }
  });

  // Initialize projects load
  loadProjects();
});
