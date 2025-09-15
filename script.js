document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero-slide");
  if (!slides || slides.length === 0) return;

  let current = 0;
  const prevBtn = document.querySelector(".hero-prev");
  const nextBtn = document.querySelector(".hero-next");
  let autoTimer = null;
  const AUTO_DELAY = 6000; // ms

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    current = index;
  }

  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((current - 1 + slides.length) % slides.length);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, AUTO_DELAY);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Attach button handlers (if buttons exist)
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAuto(); // restart autoplay
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAuto();
    });
  }

  // Optional: keyboard support (left/right arrows)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { prevSlide(); startAuto(); }
    if (e.key === "ArrowRight") { nextSlide(); startAuto(); }
  });

  // Init
  showSlide(0);
  startAuto();
});



  /* =========================
     GALLERY fade-in
  ========================== */
  const galleryItems = document.querySelectorAll(".gallery figure");
  galleryItems.forEach((item, index) => {
    item.style.setProperty('--stagger-delay', `${index * 0.15}s`);
  });
  const galleryObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  galleryItems.forEach(item => galleryObserver.observe(item));

  /* =========================
     NAVBAR toggle
  ========================== */
  // Alternative menu-btn (mobile)
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Close menu when any nav-btn is clicked
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('active');
    });
  });

  /* =========================
     Smooth scroll for links
  ========================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      if (navLinks) navLinks.classList.remove("active");
    });
  });

  /* =========================
     Navbar background on scroll
  ========================== */
  const navbar = document.querySelector(".navbar");
  const hero = document.querySelector(".hero");
  window.addEventListener("scroll", () => {
    if (!navbar || !hero) return;
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    if (window.scrollY > heroBottom - 80) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  /* =========================
     Back to top button
  ========================== */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.style.display = window.scrollY > 300 ? "block" : "none";
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================
     Lightbox for gallery
  ========================== */
  const triggerSelector = ".lightbox-trigger";
  const gallerySelector = ".gallery-row";
  let lb = document.getElementById("lightbox");
  if (!lb) {
    lb = document.createElement("div");
    lb.id = "lightbox";
    lb.className = "lightbox";
    lb.innerHTML = `
      <div class="lightbox-inner" role="dialog" aria-modal="true">
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
        <button class="lightbox-next" aria-label="Next">&#10095;</button>
        <img class="lightbox-img" src="" alt="">
        <div class="lightbox-caption"></div>
      </div>`;
    document.body.appendChild(lb);
  }
  const imgEl = lb.querySelector(".lightbox-img");
  const captionEl = lb.querySelector(".lightbox-caption");
  const closeBtn = lb.querySelector(".lightbox-close");
  const nextBtn = lb.querySelector(".lightbox-next");
  const prevBtn = lb.querySelector(".lightbox-prev");
  let currentIndex = -1;
  const getImages = () => Array.from(document.querySelectorAll(triggerSelector));
  function openLightbox(index) {
    const images = getImages();
    if (!images.length || index < 0 || index >= images.length) return;
    const target = images[index];
    const src = target.dataset.full || target.src;
    imgEl.src = src;
    imgEl.alt = target.alt || "";
    captionEl.textContent = target.alt || "";
    currentIndex = index;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lb.classList.remove("open");
    imgEl.src = "";
    currentIndex = -1;
    document.body.style.overflow = "";
  }
  function showNext() {
    const images = getImages();
    currentIndex = (currentIndex + 1) % images.length;
    openLightbox(currentIndex);
  }
  function showPrev() {
    const images = getImages();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox(currentIndex);
  }
  const galleryRoot = document.querySelector(gallerySelector) || document;
  galleryRoot.addEventListener("click", e => {
    const img = e.target.closest(triggerSelector);
    if (!img) return;
    e.preventDefault();
    openLightbox(getImages().indexOf(img));
  });
  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);
  lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  /* =========================
     Section reveal animations
  ========================== */
  const animatedEls = document.querySelectorAll(
    "section, .about-container, .about-text, .about-text p, .about-image, .gallery-row, .location, .footer, #amenities, .booking-item"
  );
  // Stagger for booking items
  const bookingItems = document.querySelectorAll(".booking-item");
  bookingItems.forEach((item, index) => {
    item.style.setProperty('--stagger-delay', `${index * 0.2}s`);
    item.style.setProperty('--slide-dir', index % 2 === 0 ? '-50px' : '50px');
  });
  animatedEls.forEach(el => el.classList.add("hidden"));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        entry.target.classList.remove("hidden");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  animatedEls.forEach(el => revealObserver.observe(el));

  /* =========================
     WhatsApp availability button
  ========================== */
  const availabilityBtn = document.getElementById("checkAvailability");
  if (availabilityBtn) {
    const phoneNumber = "233244485005"; // your WhatsApp number
    availabilityBtn.addEventListener("click", () => {
      const checkin = document.getElementById("checkin").value;
      const checkout = document.getElementById("checkout").value;
      const guests = document.getElementById("guests").value || "Not specified";
      if (!checkin || !checkout) {
        alert("Please select both check-in and check-out dates.");
        return;
      }
      if (new Date(checkout) < new Date(checkin)) {
        alert("Check-out must be the same day or after check-in.");
        return;
      }
      const message = [
        "Hello The Crowne,",
        "I would like to check availability.",
        `Check-In: ${checkin}`,
        `Check-Out: ${checkout}`,
        `Guests: ${guests}`
      ].join("\n");
      const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      const newWindow = window.open(waUrl, "_blank");
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        window.location.href = waUrl;
      }
    });
  };
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loading-screen");

  // helper to show/hide loader with fade (matches your CSS .hide)
  function showLoader() {
    if (!loader) return;
    loader.style.display = "flex";
    // ensure class removed so it is visible (in case it had .hide)
    loader.classList.remove("hide");
  }
  function hideLoader(afterMs = 600) {
    if (!loader) return;
    loader.classList.add("hide");
    setTimeout(() => {
      loader.style.display = "none";
    }, afterMs);
  }

  // Show loader on initial page load (until window.load fires)
  if (loader) showLoader();
  window.addEventListener("load", () => {
    hideLoader(600);
  });

  // Handle clicks on all <a href>
  const links = Array.from(document.querySelectorAll("a[href]"));
  const currentPath = location.pathname.replace(/\/$/, ""); // normalize trailing slash

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href) return;

      // let pure JS handlers / anchors to JS run
      if (href.startsWith("javascript:")) return;
      // let mailto / tel / whatsapp etc go through
      if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("whatsapp:")) return;

      // Resolve the URL relative to current location
      let linkUrl;
      try {
        linkUrl = new URL(href, location.href);
      } catch (err) {
        // malformed URL: let default behavior happen
        return;
      }

      const linkPath = linkUrl.pathname.replace(/\/$/, "");
      const hash = linkUrl.hash; // "" or "#amenities"

      // CASE A: link has a hash and points to the same page (or same filename)
      if (hash && (linkPath === currentPath || linkPath === "" || linkPath === "/")) {
        // same-page anchor (including "about.html#amenities" while already on about.html)
        e.preventDefault();
        showLoader();

        // Short delay so loader is visible, then hide & scroll smoothly
        setTimeout(() => {
          hideLoader(600);

          // If an element with that id exists, smooth scroll to it
          const target = document.querySelector(hash);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
            // also update the URL hash (so back button works)
            history.replaceState(null, "", hash);
          } else {
            // fallback: update location.hash
            location.hash = hash;
          }
        }, 350); // tweak this delay if you want a longer loader flash

        return;
      }

      // CASE B: link points to a different page (may or may not include hash)
      // Trigger loader and navigate
      // But do NOT intercept same-page plain anchors (href="#something") because handled above.
      if (linkPath !== currentPath) {
        // External navigation or different page
        e.preventDefault();
        showLoader();

        // navigate after a small delay to show loader
        setTimeout(() => {
          // use full href to preserve hash and query
          location.href = linkUrl.href;
        }, 300);
        return;
      }

      // CASE C: linkPath === currentPath and no hash (a plain link to same file)
      // Let browser handle it (no loader) — could also show loader if you want
    });
  });
});

// ===== NAVBAR BEHAVIOR =====
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  if (navbar.classList.contains("about-navbar")) {
    // About page → keep navbar solid white
    navbar.classList.add("scrolled");
  } else {
    // Index page → transparent at top, solid after scroll
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".about-text, .about-text p, .about-image, .divider-image img"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          entry.target.classList.remove("show"); // so it can re-animate
        }
      });
    },
    { threshold: 0.2 }
  );

  animatedElements.forEach((el) => observer.observe(el));
});
