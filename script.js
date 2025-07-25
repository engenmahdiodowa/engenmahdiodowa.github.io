// script.js
document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const navToggle = document.getElementById("nav-toggle");
    const navList = document.getElementById("nav-list");
    const darkToggle = document.getElementById("dark-toggle");
    const projectGrid = document.getElementById("projectGrid");
    const printBtn = document.getElementById("print-btn");
    const contactForm = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");
    const body = document.body;
    const darkModeKey = "portfolio-dark-mode";
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Utility: Debounce function
    function debounce(func, wait = 200) {
        let timeout;
        return function() {
            const context = this,
                args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // NAVIGATION TOGGLE (mobile)
    function toggleNav() {
        if (!navList || !navToggle) return;
        const isActive = navList.classList.toggle("show");
        navToggle.setAttribute("aria-expanded", isActive.toString());
    }
    if (navToggle) navToggle.addEventListener("click", debounce(toggleNav));

    // Close nav on link click (mobile)
    if (navList) {
        const navLinks = navList.querySelectorAll("a");
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                navList.classList.remove("show");
                if (navToggle) navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // DARK MODE FUNCTIONS
    function setDarkMode(enabled) {
        if (!darkToggle) return;
        if (enabled) {
            body.classList.add("dark");
            darkToggle.textContent = "☀️";
            darkToggle.setAttribute("aria-pressed", "true");
        } else {
            body.classList.remove("dark");
            darkToggle.textContent = "🌙";
            darkToggle.setAttribute("aria-pressed", "false");
        }
        localStorage.setItem(darkModeKey, enabled.toString());
    }

    function initDarkMode() {
        const savedMode = localStorage.getItem(darkModeKey);
        if (savedMode === "true") {
            setDarkMode(true);
        } else if (savedMode === "false") {
            setDarkMode(false);
        } else {
            setDarkMode(prefersDarkScheme.matches);
        }
    }
    initDarkMode();

    prefersDarkScheme.addEventListener("change", (e) => {
        if (localStorage.getItem(darkModeKey) === null) {
            setDarkMode(e.matches);
        }
    });

    if (darkToggle) {
        darkToggle.addEventListener("click", () => {
            setDarkMode(!body.classList.contains("dark"));
        });
    }

    // PROJECTS DATA - Replace or fetch your real data here
    const projects = [{
            title: "Construction Estimator Tool",
            description: "A desktop app built with C# for BOQ and cost estimation with automation features.",
            image: "assets/images/Dev1.jpg",
            link: "https://github.com/engenmahdiodowa/construction-estimator",
        },
        {
            title: "Accounting Automation",
            description: "Excel VBA macros and QuickBooks integration to automate accounting workflows.",
            image: "assets/images/Dev2.jpg",
            link: "https://github.com/engenmahdiodowa/accounting-automation",
        },
        {
            title: "Personal Portfolio Website",
            description: "Modern responsive portfolio built with HTML, CSS, JS, including dark mode toggle.",
            image: "assets/images/dev3.jpg",
            link: "https://engenmahdiodowa.github.io",
        },
    ];

    function createProjectCard(proj) {
        const card = document.createElement("article");
        card.className = "about__card";
        card.tabIndex = 0;
        card.setAttribute("role", "listitem");

        const img = document.createElement("img");
        img.src = proj.image;
        img.alt = proj.title;
        img.loading = "lazy";

        const h3 = document.createElement("h3");
        h3.textContent = proj.title;

        const desc = document.createElement("p");
        desc.textContent = proj.description;

        const link = document.createElement("a");
        link.href = proj.link || "#";
        link.textContent = "View Project →";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(desc);
        card.appendChild(link);

        return card;
    }

    function loadProjects() {
        if (!projectGrid) return;
        projectGrid.innerHTML = "";

        projects.forEach((proj) => {
            const card = createProjectCard(proj);
            projectGrid.appendChild(card);
        });
    }
    loadProjects();

    // PRINT BUTTON
    if (printBtn) {
        printBtn.addEventListener("click", () => {
            window.print();
        });
    }

    // CONTACT FORM HANDLING (using EmailJS)
    if (contactForm && formMessage) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            formMessage.textContent = "";
            formMessage.style.color = "";

            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const message = contactForm.message.value.trim();

            if (!name || !email || !message) {
                formMessage.style.color = "red";
                formMessage.textContent = "Please fill in all fields.";
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                formMessage.style.color = "red";
                formMessage.textContent = "Please enter a valid email address.";
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            formMessage.style.color = "var(--accent)";
            formMessage.textContent = "Sending...";

            // Make sure to initialize EmailJS before this script runs and replace your service/template IDs
            emailjs
                .send("service_3c74x3m", "template_oeoo0vf", {
                    from_name: name,
                    from_email: email,
                    message: message,
                })
                .then(() => {
                    formMessage.style.color = "green";
                    formMessage.textContent = "Thank you! Your message has been sent.";
                    contactForm.reset();
                    if (submitBtn) submitBtn.disabled = false;
                })
                .catch((error) => {
                    formMessage.style.color = "red";
                    formMessage.textContent =
                        "Oops! Something went wrong. Please try again.";
                    if (submitBtn) submitBtn.disabled = false;
                    console.error("EmailJS error:", error);
                });
        });
    }

    // NAV LINK ACTIVE STATE & Accessibility
    const navLinks = document.querySelectorAll(".nav__link");
    navLinks.forEach((link) => {
        link.addEventListener("click", function() {
            navLinks.forEach((l) => l.classList.remove("active"));
            this.classList.add("active");

            if (navList && navList.classList.contains("show")) {
                navList.classList.remove("show");
                if (navToggle) navToggle.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Feather icons replacement
    if (window.feather) {
        feather.replace();
    }
});
