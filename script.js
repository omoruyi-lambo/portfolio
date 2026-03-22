const EMAILJS_PUBLIC_KEY = "126HmNOuNvjOW_3A5";
const EMAILJS_SERVICE_ID = "service_btpu2s5";
const EMAILJS_TEMPLATE_ID = "template_q9uk1mx";
const CONTACT_EMAIL = "isaiahomoruyi4@gmail.com";
const WHATSAPP_NUMBER = "2349157632360";

if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const tabButtons = document.querySelectorAll(".tab-btn");
const skillCategories = document.querySelectorAll(".skill-category");
const themeToggle = document.getElementById("themeToggle");
const themeToggleText = document.querySelector(".theme-toggle-text");

const setTheme = (theme) => {
    document.body.dataset.theme = theme;

    if (themeToggleText) {
        themeToggleText.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
    }
};

const storedTheme = window.localStorage.getItem("portfolio-theme");
const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDarkTheme ? "dark" : "light");

setTheme(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        window.localStorage.setItem("portfolio-theme", nextTheme);
    });
}

window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href").slice(1) === currentSection);
    });
});

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
        });
    });
}

const setFormMessage = (message, color) => {
    if (!formMessage) {
        return;
    }

    formMessage.textContent = message;
    formMessage.style.color = color;
};

const buildWhatsappMessage = ({ userName, userEmail, userPhone, subject, message }) => [
    "Hello Isaiah,",
    `My name is ${userName}.`,
    `Email: ${userEmail}`,
    `Phone: ${userPhone}`,
    `Project type: ${subject}`,
    `Project details: ${message}`
].join("\n");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const userName = document.getElementById("user_name").value.trim();
        const userEmail = document.getElementById("user_email").value.trim();
        const userPhone = document.getElementById("user_phone").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        const whatsappMessage = buildWhatsappMessage({
            userName,
            userEmail,
            userPhone,
            subject,
            message
        });

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
        const whatsappWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        setFormMessage("Sending your details to email and preparing WhatsApp...", "#60a5fa");

        if (typeof emailjs === "undefined") {
            setFormMessage("WhatsApp is ready, but email delivery is not configured in this browser right now.", "#fbbf24");

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Send Project Brief";
            }

            return;
        }

        const emailBody = [
            `Name: ${userName}`,
            `Email: ${userEmail}`,
            `Phone: ${userPhone}`,
            `Project type: ${subject}`,
            "",
            "Project details:",
            message
        ].join("\n");

        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                to_email: CONTACT_EMAIL,
                from_email: userEmail,
                from_name: userName,
                reply_to: userEmail,
                subject: `New website inquiry: ${subject}`,
                message: emailBody
            });

            const popupMessage = whatsappWindow
                ? "Your message was sent to email and WhatsApp has been opened for fast follow-up."
                : "Your message was sent to email. If WhatsApp did not open, use the WhatsApp link on the page.";

            setFormMessage(popupMessage, "#10b981");
            contactForm.reset();
        } catch (error) {
            console.error("EmailJS send failed:", error);
            setFormMessage("WhatsApp was opened, but the email could not be sent automatically. Please use the email or WhatsApp contact links below.", "#f87171");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Send Project Brief";
            }
        }
    });
}

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const tabValue = button.getAttribute("data-tab");

        tabButtons.forEach((item) => item.classList.remove("active"));
        skillCategories.forEach((category) => category.classList.remove("active"));

        button.classList.add("active");

        if (tabValue === "all") {
            skillCategories.forEach((category) => category.classList.add("active"));
            return;
        }

        skillCategories.forEach((category) => {
            if (category.getAttribute("data-category") === tabValue) {
                category.classList.add("active");
            }
        });
    });
});

if (tabButtons.length > 0) {
    tabButtons[0].classList.add("active");
}

skillCategories.forEach((category) => {
    if (category.getAttribute("data-category") === "frontend") {
        category.classList.add("active");
    }
});

const skillsSection = document.querySelector(".skills");

if (skillsSection) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const progressBars = entry.target.querySelectorAll(".skill-progress");
            progressBars.forEach((bar) => {
                const width = bar.style.width;
                bar.style.width = "0";
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });

            skillObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.1
    });

    skillObserver.observe(skillsSection);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
        event.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll(".project-card, .service-item, .testimonial-card, .stat-box, .desc-item, .skill-category").forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
});

document.querySelectorAll(".section-label, h2, .skills-header, .testimonials-header, .contact-header").forEach((element) => {
    element.style.opacity = "0";
    element.style.animation = "fadeInDown 0.8s ease forwards";
    observer.observe(element);
});

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${index * 0.08}s`;
            entry.target.classList.add("animate-on-scroll");
        }
    });
}, {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px"
});

document.querySelectorAll(".project-card, .service-item, .testimonial-card, .stat-box").forEach((element) => {
    scrollObserver.observe(element);
});
