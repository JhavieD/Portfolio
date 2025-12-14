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
      closeLightbox();
    }
  });

  // Lightbox functionality
  const lightbox = document.getElementById("image-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxOverlay = document.querySelector(".lightbox-overlay");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");

  let currentImageIndex = 0;
  let imageArray = [];

  // Build array of images from the active modal
  const buildImageArray = (modal) => {
    if (!modal) return;
    const clickableImages = modal.querySelectorAll(".clickable-image img");
    imageArray = Array.from(clickableImages).map((img) => ({
      src: img.getAttribute("data-fullsize") || img.src,
      alt: img.getAttribute("alt") || "Image",
    }));
  };

  const updateNavigationButtons = () => {
    if (lightboxPrev && lightboxNext) {
      lightboxPrev.disabled = currentImageIndex === 0;
      lightboxNext.disabled = currentImageIndex === imageArray.length - 1;
    }
  };

  const openLightbox = (imageIndex, modal) => {
    if (lightbox && lightboxImage && imageArray.length > 0) {
      currentImageIndex = imageIndex;
      const image = imageArray[currentImageIndex];
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
      updateNavigationButtons();
      window.lucide.createIcons();
    }
  };

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  const showNextImage = () => {
    if (currentImageIndex < imageArray.length - 1) {
      currentImageIndex++;
      const image = imageArray[currentImageIndex];
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      updateNavigationButtons();
    }
  };

  const showPrevImage = () => {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      const image = imageArray[currentImageIndex];
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      updateNavigationButtons();
    }
  };

  // Set up click handlers for all clickable images in all modals
  modals.forEach((modal) => {
    const clickableImages = modal.querySelectorAll(".clickable-image img");
    clickableImages.forEach((img, index) => {
      img.addEventListener("click", (e) => {
        e.stopPropagation();
        // Build image array from the current modal
        buildImageArray(modal);
        openLightbox(index, modal);
      });
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxOverlay?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrevImage();
  });
  lightboxNext?.addEventListener("click", (e) => {
    e.stopPropagation();
    showNextImage();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (lightbox && lightbox.classList.contains("active")) {
      if (e.key === "ArrowLeft") {
        showPrevImage();
      } else if (e.key === "ArrowRight") {
        showNextImage();
      }
    }
  });

  // Direct lightbox opening from photo grid
  const directLightboxTriggers = document.querySelectorAll(".direct-lightbox");
  directLightboxTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const modalId = trigger.getAttribute("data-modal");
      const imageIndex = parseInt(trigger.getAttribute("data-image-index"), 10);
      const modal = document.getElementById(modalId);
      
      if (modal && !isNaN(imageIndex)) {
        // Build image array from the modal
        buildImageArray(modal);
        // Open lightbox directly at the specified image index
        openLightbox(imageIndex, modal);
      }
    });
  });
});

