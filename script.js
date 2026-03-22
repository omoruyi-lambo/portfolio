const EMAILJS_PUBLIC_KEY = "126HmNOuNvjOW_3A5";
const EMAILJS_SERVICE_ID = "service_btpu2s5";
const EMAILJS_TEMPLATE_ID = "template_q9uk1mx";
const CONTACT_EMAIL = "isaiahomoruyi4@gmail.com";
const WHATSAPP_NUMBER = "2349157632360";

if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

const body = document.body;
const navToggle = document.getElementById("navToggle");
const navPanel = document.getElementById("navPanel");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");
const themeToggle = document.getElementById("themeToggle");
const themeToggleText = document.querySelector(".theme-toggle-text");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const revealItems = document.querySelectorAll("[data-reveal]");
const disabledLinks = document.querySelectorAll("[data-disabled-link]");

const setTheme = (theme) => {
    body.dataset.theme = theme;

    if (themeToggleText) {
        themeToggleText.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
    }
};

const storedTheme = window.localStorage.getItem("lambo-code-theme");
setTheme(storedTheme || "dark");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        window.localStorage.setItem("lambo-code-theme", nextTheme);
    });
}

const closeMenu = () => {
    if (!navPanel || !navToggle) {
        return;
    }

    navPanel.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
};

if (navToggle && navPanel) {
    navToggle.addEventListener("click", () => {
        const isOpen = navPanel.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        body.classList.toggle("menu-open", isOpen);
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
        const targetSelector = this.getAttribute("href");
        const target = document.querySelector(targetSelector);

        if (!target) {
            return;
        }

        event.preventDefault();
        closeMenu();
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 160) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        const linkTarget = link.getAttribute("href").slice(1);
        link.classList.toggle("active", linkTarget === currentSection);
    });
});

disabledLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
    });
}, {
    threshold: 0.14,
    rootMargin: "0px 0px -50px 0px"
});

revealItems.forEach((item) => {
    revealObserver.observe(item);
});

const setFormMessage = (message, color) => {
    if (!formMessage) {
        return;
    }

    formMessage.textContent = message;
    formMessage.style.color = color;
};

const buildWhatsappMessage = ({ userName, userEmail, userPhone, subject, message }) => [
    "Hello Lambo Code,",
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

        setFormMessage("Sending your brief to email and preparing WhatsApp...", "#f1cb55");

        if (typeof emailjs === "undefined") {
            setFormMessage("WhatsApp is ready, but email delivery is not configured in this browser right now.", "#f1cb55");

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Send Brief";
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

            const successMessage = whatsappWindow
                ? "Your brief has been sent to email and WhatsApp has been opened for fast follow-up."
                : "Your brief has been sent to email. If WhatsApp did not open, use the WhatsApp link on the page.";

            setFormMessage(successMessage, "#22c55e");
            contactForm.reset();
        } catch (error) {
            console.error("EmailJS send failed:", error);
            setFormMessage("WhatsApp was opened, but the email could not be sent automatically. Please use the email or WhatsApp contact links below.", "#f87171");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Send Brief";
            }
        }
    });
}
