document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelectorAll('.mobile-menu a[href^="#"], .nav-links a[href^="#"]');
  const carouselControls = document.querySelectorAll(".carousel-controls");

  const syncNavbarState = () => {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle("scrolled", scrolled);
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    const icon = menuToggle.querySelector("i");
    if (icon) {
      icon.setAttribute("data-lucide", "menu");
      window.lucide.createIcons();
    }
  };

  syncNavbarState();
  window.addEventListener("scroll", syncNavbarState);

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.setAttribute("data-lucide", isOpen ? "x" : "menu");
        window.lucide.createIcons();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        event.preventDefault();
        document.querySelector(targetId)?.scrollIntoView({ behavior: "smooth" });
        closeMobileMenu();
      }
    });
  });

  const scrollTrack = (track, direction) => {
    if (!track) return;
    const delta = Math.max(track.clientWidth * 0.7, 320);
    track.scrollBy({ left: direction === "next" ? delta : -delta, behavior: "smooth" });
  };

  carouselControls.forEach((control) => {
    const targetId = control.getAttribute("data-target");
    const track = targetId ? document.getElementById(targetId) : null;
    const prevBtn = control.querySelector(".prev");
    const nextBtn = control.querySelector(".next");

    prevBtn?.addEventListener("click", () => scrollTrack(track, "prev"));
    nextBtn?.addEventListener("click", () => scrollTrack(track, "next"));
  });

  // Modal functionality
  const modalTriggers = document.querySelectorAll(".modal-trigger");
  const modals = document.querySelectorAll(".modal");
  const modalCloses = document.querySelectorAll(".modal-close");

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      window.lucide.createIcons();
    }
  };

  const closeModal = (modal) => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      const modalId = trigger.getAttribute("data-modal");
      if (modalId && !e.target.closest("a")) {
        openModal(modalId);
      }
    });
  });

  modalCloses.forEach((close) => {
    close.addEventListener("click", () => {
      const modal = close.closest(".modal");
      if (modal) {
        closeModal(modal);
      }
    });
  });

  modals.forEach((modal) => {
    const overlay = modal.querySelector(".modal-overlay");
    overlay?.addEventListener("click", () => {
      closeModal(modal);
    });
  });

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modals.forEach((modal) => {
        if (modal.classList.contains("active")) {
          closeModal(modal);
        }
      });
    }
  });
});

