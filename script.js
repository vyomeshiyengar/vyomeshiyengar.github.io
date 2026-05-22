const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".brand-mark, .rail-link")];
const rail = document.querySelector(".rail");
const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
const mobileNavLabel = document.querySelector(".mobile-nav-label");

const linkTarget = link => {
  const href = link.getAttribute("href") || "";
  return href.includes("#") ? href.slice(href.indexOf("#")) : href;
};

const linkLabel = link => {
  const text = link.textContent.trim().replace(/\s+/g, " ");
  return text || "Menu";
};

const syncRailTheme = activeLink => {
  if (!rail) {
    return;
  }

  rail.classList.remove("theme-home", "theme-offerings", "theme-use-cases", "theme-education", "theme-about");

  if (!activeLink) {
    return;
  }

  if (activeLink.classList.contains("brand-mark")) {
    rail.classList.add("theme-home");
  } else if (activeLink.classList.contains("rail-link-offerings")) {
    rail.classList.add("theme-offerings");
  } else if (activeLink.classList.contains("rail-link-use-cases")) {
    rail.classList.add("theme-use-cases");
  } else if (activeLink.classList.contains("rail-link-education")) {
    rail.classList.add("theme-education");
  } else if (activeLink.classList.contains("rail-link-about")) {
    rail.classList.add("theme-about");
  }
};

if (rail && mobileNavToggle) {
  const closeMenu = () => {
    rail.classList.remove("is-open");
    mobileNavToggle.setAttribute("aria-expanded", "false");
  };

  mobileNavToggle.addEventListener("click", () => {
    const isOpen = rail.classList.toggle("is-open");
    mobileNavToggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", event => {
    if (!rail.contains(event.target)) {
      closeMenu();
    }
  });
}

if (sections.length > 0) {
  let ticking = false;

  const setActive = id => {
    links.forEach(link => {
      link.classList.toggle("is-active", linkTarget(link) === `#${id}`);
    });

    if (mobileNavLabel) {
      const activeLink = links.find(link => link.classList.contains("is-active"));
      mobileNavLabel.textContent = activeLink ? linkLabel(activeLink) : "Menu";
      syncRailTheme(activeLink);
    }
  };

  const getNavTarget = section => section.dataset.nav || section.id;

  const syncActiveSection = () => {
    const anchor = window.scrollY + window.innerHeight * 0.42;
    const active = sections.reduce((current, section) => {
      return section.offsetTop <= anchor ? section : current;
    }, sections[0]);

    setActive(getNavTarget(active));
    ticking = false;
  };

  const requestSync = () => {
    if (!ticking) {
      window.requestAnimationFrame(syncActiveSection);
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestSync, { passive: true });
  window.addEventListener("resize", requestSync);
  window.addEventListener("hashchange", requestSync);
  syncActiveSection();
} else if (mobileNavLabel) {
  const activeLink = links.find(link => link.classList.contains("is-active"));
  mobileNavLabel.textContent = activeLink ? linkLabel(activeLink) : "Menu";
  syncRailTheme(activeLink);
}
