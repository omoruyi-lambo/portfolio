(() => {
  const html = document.documentElement;
  const body = document.body;
  const themeButtons = [...document.querySelectorAll(".btn-theme")];
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobNav");
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");
  const contactForm = document.getElementById("contactForm");
  const mobOverlay = document.getElementById("mobOverlay");
  const mobClose = document.getElementById("mobClose");

  const applyTheme = (theme) => {
    html.dataset.theme = theme;
    themeButtons.forEach((btn) => {
      const textSpan = btn.querySelector("span");
      if (textSpan) {
        textSpan.textContent = theme === "dark" ? " Light Mode" : " Dark Mode";
      }
      btn.innerHTML = theme === "dark"
        ? '<i class="fa-solid fa-sun"></i> Light'
        : '<i class="fa-solid fa-moon"></i> Dark';
    });
    localStorage.setItem("lambo-code-theme", theme);
  };

  applyTheme(localStorage.getItem("lambo-code-theme") || "dark");
  themeButtons.forEach((btn) => btn.addEventListener("click", () => {
    const nextTheme = html.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  }));

  const closeMobileNav = () => {
    mobileNav?.classList.remove("open");
    mobOverlay?.classList.remove("open");
    hamburger?.classList.remove("is-open");
    hamburger?.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  window.closeMob = closeMobileNav;

  hamburger?.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    mobOverlay?.classList.toggle("open", isOpen);
    hamburger.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("menu-open", isOpen);
  });

  mobOverlay?.addEventListener("click", closeMobileNav);
  mobClose?.addEventListener("click", closeMobileNav);


  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Brand loader — the CSS animation auto-hides it; this is a safety net
  // so it can never trap the visitor, plus an instant skip for reduced motion.
  const loader = document.getElementById("loader");
  if (loader) {
    if (prefersReducedMotion) {
      loader.classList.add("done");
    } else {
      setTimeout(() => loader.classList.add("done"), 2000);
    }
  }

  // ESC closes the mobile menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav?.classList.contains("open")) {
      closeMobileNav();
      hamburger?.focus();
    }
  });

  // Scrollspy — highlight the active section in the nav.
  // Sections follow normal DOM order (no CSS `order` or JS reordering), so the
  // spy list is derived from the actual page sequence: every section that has a
  // nav anchor, collected in document order.
  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"], .mob-nav a[href^="#"]')];
  const navHrefs = new Set(navAnchors.map((a) => a.getAttribute("href")));
  const spySections = [...document.querySelectorAll("section[id]")]
    .filter((s) => navHrefs.has("#" + s.id));
  let spyTick = false;
  const updateSpy = () => {
    if (!spySections.length) return;
    const probe = window.scrollY + 120;
    let current = spySections[0].id;
    for (const s of spySections) {
      if (s.offsetTop <= probe) current = s.id;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = "contact";
    navAnchors.forEach((a) => {
      const isActive = a.getAttribute("href") === "#" + current;
      a.classList.toggle("active", isActive);
      if (isActive) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  };
  window.addEventListener("scroll", () => {
    if (!spyTick) {
      spyTick = true;
      requestAnimationFrame(() => {
        updateSpy();
        spyTick = false;
      });
    }
  }, { passive: true });
  updateSpy();

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      closeMobileNav();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    });
  });

  // Close mobile menu when clicking any link in mobile nav
  mobileNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileNav();
    });
  });

  window.addEventListener("scroll", () => {
    nav?.classList.toggle("is-compact", window.scrollY > 60);
    if (progress && document.documentElement) {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${total > 0 ? (window.scrollY / total) * 100 : 0}%`;
    }
  }, { passive: true });

  window.toggleFaq = (question) => {
    const item = question.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    const wasOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((faq) => {
        faq.classList.remove("open");
        faq.querySelector('.faq-answer').style.maxHeight = null;
        const q = faq.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
    });

    if (!wasOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.setAttribute('aria-expanded', 'true');
    }
  };

  contactForm?.addEventListener("submit", (e) => {
    const value = (id) => document.getElementById(id)?.value.trim() || "N/A";
    const message = [
      "Hello Lambo Code,",
      `Name: ${value("fName")}`,
      `Email: ${value("fEmail")}`,
      `Phone: ${value("fPhone")}`,
      `Project: ${value("fType")}`,
      `Details: ${value("fDetails")}`
    ].join("\n");

    const whatsappUrl = `https://wa.me/2349157632360?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });

})();