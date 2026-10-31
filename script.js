
// ==========================================
// DESTINO WEBSITE — MAIN INTERACTIONS
// ==========================================

// Supabase configuration — existing project
const SUPABASE_URL = 'https://mxaragmabvmplinhvxae.supabase.co';
const SUPABASE_KEY = 'sb_publishable_kdlKPQ_H1i88A_qD4T5znA_ixRr7jz0';

// Initialise Supabase safely
let supabaseClient = null;

if (window.supabase?.createClient) {
  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );
} else {
  console.error('DESTINO: Supabase library could not be loaded.');
}


// ==========================================
// MOBILE NAVIGATION
// ==========================================

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function closeNavigation() {
  nav?.classList.remove('open');

  if (menuButton) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }
}

menuButton?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open') ?? false;

  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute(
    'aria-label',
    isOpen ? 'Close navigation' : 'Open navigation'
  );
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNavigation);
});

// Close navigation using Escape
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeNavigation();
  }
});


// ==========================================
// AUTOMATIC FOOTER YEAR
// ==========================================

const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}


// ==========================================
// SERVICE PRESELECTION
// ==========================================

document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const serviceSelect = document.getElementById('service');

    if (serviceSelect) {
      serviceSelect.value = link.dataset.service;
    }
  });
});


// ==========================================
// CUSTOMER ENQUIRY — SUPABASE
// ==========================================

const journeyForm = document.getElementById('journeyForm');

journeyForm?.addEventListener('submit', async event => {
  event.preventDefault();

  const form = event.currentTarget;
  const status = document.getElementById('formStatus');
  const submitButton = form.querySelector('button[type="submit"]');

  if (!status || !submitButton) return;

  // Prevent duplicate submissions
  if (submitButton.disabled) return;

  // Check Supabase connection
  if (!supabaseClient) {
    status.textContent =
      'Our enquiry service is temporarily unavailable. Please contact us on WhatsApp.';
    status.style.color = '#a33b32';
    return;
  }

  const formData = new FormData(form);

  // Existing database field mapping — DO NOT CHANGE
  const enquiry = {
    customer_name: String(formData.get('name') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    email: String(formData.get('email') || '').trim() || null,
    service: String(formData.get('service') || '').trim(),
    message: String(formData.get('message') || '').trim() || null,
    status: 'New'
  };

  // Required field validation
  if (
    !enquiry.customer_name ||
    !enquiry.phone ||
    !enquiry.service
  ) {
    status.textContent =
      'Please complete your name, phone number and service.';
    status.style.color = '#a33b32';
    return;
  }

  submitButton.disabled = true;
  submitButton.setAttribute('aria-busy', 'true');
  status.textContent = 'Sending your enquiry...';
  status.style.color = '';

  try {
    // Insert enquiry into the existing Supabase table
    const { error } = await supabaseClient
      .from('enquiries')
      .insert([enquiry]);

    if (error) {
      throw error;
    }

    // Successful submission
    form.reset();

    status.textContent =
      'Thank you! Your enquiry has been received. The DESTINO team will contact you soon.';

    status.style.color = '#54752c';

  } catch (error) {
    console.error('DESTINO enquiry submission error:', error);

    status.textContent =
      'We could not send your enquiry. Please try again or contact DESTINO on WhatsApp.';

    status.style.color = '#a33b32';

  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
  }
});


// ==========================================
// DESTINO — SCROLL-DRIVEN 3D MOTION
// ==========================================

(() => {
  const initDestinoMotion = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    // Add decorative depth orbs
    document.querySelectorAll(
      ".hero, .dark-section, .partner-section"
    ).forEach(section => {
      if (!section.querySelector(".scroll-orb")) {
        const orb = document.createElement("div");
        orb.className = "scroll-orb";
        orb.setAttribute("aria-hidden", "true");
        section.appendChild(orb);
      }
    });

    // Elements that reveal as visitors scroll
    const revealElements = document.querySelectorAll(
      ".service-card, .step, .difference-art, " +
      ".difference-copy, .contact-form, " +
      ".partner-list > div, .section-heading, .contact-copy"
    );

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "destino-reveal",
                "is-visible"
              );
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      revealElements.forEach(element => {
        element.classList.add("destino-reveal");
        revealObserver.observe(element);
      });
    }

    // Scroll-driven 3D depth
    const hero = document.querySelector(".hero-visual");
    const art = document.querySelector(".difference-art");
    const cards = [...document.querySelectorAll(".service-card")];
    const steps = [...document.querySelectorAll(".step")];
    const form = document.querySelector(".contact-form");
    const partnerRows = [
      ...document.querySelectorAll(".partner-list > div")
    ];
    const orbs = [...document.querySelectorAll(".scroll-orb")];

    let ticking = false;

    const updateMotion = () => {
      const height = window.innerHeight;

      const progressFor = element => {
        const rect = element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;

        return Math.max(
          -1,
          Math.min(1, (center - height / 2) / (height / 2))
        );
      };

      if (hero) {
        const p = progressFor(hero);
        hero.style.setProperty("--hero-depth", `${-p * 18}px`);
        hero.style.setProperty("--hero-tilt", `${p * 2.5}deg`);
      }

      if (art) {
        const p = progressFor(art);
        art.style.setProperty("--art-depth", `${-p * 16}px`);
        art.style.setProperty("--art-rotate", `${p * 3}deg`);
        art.style.setProperty("--art-tilt", `${-p * 2}deg`);
      }

      cards.forEach((card, index) => {
        const p = progressFor(card);
        const stagger = index % 2 === 0 ? 1 : -1;

        card.style.setProperty(
          "--scroll-lift",
          `${-p * 12}px`
        );

        card.style.setProperty(
          "--scroll-tilt",
          `${p * stagger * 1.3}deg`
        );
      });

      steps.forEach((step, index) => {
        const p = progressFor(step);

        step.style.setProperty(
          "--step-depth",
          `${-p * (7 + index * 2)}px`
        );
      });

      if (form) {
        const p = progressFor(form);
        form.style.setProperty("--form-depth", `${-p * 13}px`);
        form.style.setProperty("--form-tilt", `${p * 1.2}deg`);
      }

      partnerRows.forEach(row => {
        const p = progressFor(row);

        row.style.setProperty(
          "--partner-depth",
          `${-p * 8}px`
        );
      });

      orbs.forEach((orb, index) => {
        const section = orb.parentElement;
        const p = progressFor(section);
        const direction = index % 2 === 0 ? 1 : -1;

        orb.style.setProperty(
          "--orb-y",
          `${p * direction * 55}px`
        );
      });

      ticking = false;
    };

    const requestMotionUpdate = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateMotion);
      }
    };

    window.addEventListener(
      "scroll",
      requestMotionUpdate,
      { passive: true }
    );

    window.addEventListener("resize", requestMotionUpdate);

    updateMotion();
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initDestinoMotion,
      { once: true }
    );
  } else {
    initDestinoMotion();
  }
})();


// ==========================================
// DESTINO — CINEMATIC SECTION TRANSITIONS
// ==========================================

(() => {
  const startCinematicTransitions = () => {
    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const selectors = [
      ".hero",
      ".trust-strip",
      ".section",
      ".dark-section",
      ".partner-section",
      ".footer"
    ];

    const panels = [
      ...document.querySelectorAll(selectors.join(","))
    ];

    if (
      !panels.length ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    panels.forEach(panel => {
      panel.classList.add(
        "cinematic-panel",
        "cinema-before"
      );

      if (!panel.querySelector(":scope > .cinema-light")) {
        const light = document.createElement("div");

        light.className = "cinema-light";
        light.setAttribute("aria-hidden", "true");

        panel.appendChild(light);
      }
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const panel = entry.target;

          panel.classList.remove("cinema-before");
          panel.classList.add(
            "cinema-visible",
            "cinema-sweep"
          );

          window.setTimeout(() => {
            panel.classList.remove("cinema-sweep");
          }, 1400);

          observer.unobserve(panel);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    panels.forEach(panel => observer.observe(panel));
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      startCinematicTransitions,
      { once: true }
    );
  } else {
    startCinematicTransitions();
  }
})();
