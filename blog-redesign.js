(() => {
  const html = document.documentElement;
  const body = document.body;
  const themeButtons = [...document.querySelectorAll(".btn-theme")];
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobNav");
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");

  const applyTheme = (theme) => {
    html.dataset.theme = theme;
    themeButtons.forEach((btn) => {
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
    mobileNav?.classList.remove("open", "is-open");
    hamburger?.classList.remove("is-open");
    hamburger?.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  window.closeMob = closeMobileNav;

  hamburger?.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    hamburger.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("menu-open", isOpen);
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ESC closes the mobile menu and returns focus to the hamburger
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav?.classList.contains("open")) {
      closeMobileNav();
      hamburger?.focus();
    }
  });

  // Scrollspy — highlight the active section in the nav. The blog nav links
  // point to other pages, so this stays inert unless in-page anchors exist,
  // mirroring the home page's Phase 6/8 behavior.
  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"], .mob-nav a[href^="#"]')];
  const spySections = [...new Set(
    navAnchors.map((a) => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean)
  )];
  let spyTick = false;
  const updateSpy = () => {
    if (!spySections.length) return;
    const probe = window.scrollY + 120;
    let current = spySections[0].id;
    for (const s of spySections) {
      if (s.offsetTop <= probe) current = s.id;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = spySections[spySections.length - 1].id;
    }
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
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      closeMobileNav();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    });
  });

  window.addEventListener("scroll", () => {
    nav?.classList.toggle("is-compact", window.scrollY > 40);
    if (progress) {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${total > 0 ? (window.scrollY / total) * 100 : 0}%`;
    }
  }, { passive: true });
})();
