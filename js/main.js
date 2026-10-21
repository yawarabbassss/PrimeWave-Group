/**
 * PRIMEWAVE GROUP
 * Core Engine & Interactive Animations (English Edition)
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initHeroScrolly();
  initInteractiveServices();
  initServiceFilters();
  initResultFilters();
  initPricingFilters();
  initAnimatedCounters();
  initLightbox();
  initBookingFlow();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL SPY
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy active indicator
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      drawer.classList.remove('open');
    }
  });

  closeLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   3. HERO SCROLLYTELLING ENGINE
   ========================================================================== */
function initHeroScrolly() {
  const scrollTrack = document.querySelector('.hero-scroll-track');
  const slides = document.querySelectorAll('.hero-slide');
  const cards = document.querySelectorAll('.floating-story-card');
  const heroMainBanner = document.querySelector('.hero-main-banner');
  const scrubDots = document.querySelectorAll('.scrub-dot');

  if (!scrollTrack || slides.length === 0) return;

  const totalSteps = 6;
  let currentStep = 0;
  let isAutoScrolling = false;

  function updateScrollyState(step) {
    if (step < 0) step = 0;
    if (step >= totalSteps) step = totalSteps - 1;
    currentStep = step;

    // Update Background Slides
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === step);
    });

    // Update Story Floating Cards
    cards.forEach((card, index) => {
      card.classList.toggle('active', index === step - 1);
    });

    // Update Orbital Ecosystem Showcase (Active on Step 1, second hero scene)
    const orbitShowcase = document.querySelector('.hero-orbit-showcase');
    if (orbitShowcase) {
      orbitShowcase.classList.toggle('active', step === 1);
    }

    // Main Banner is visible only on first step
    if (heroMainBanner) {
      if (step === 0) {
        heroMainBanner.style.opacity = '1';
        heroMainBanner.style.transform = 'translateY(0)';
        heroMainBanner.style.pointerEvents = 'auto';
      } else {
        heroMainBanner.style.opacity = '0';
        heroMainBanner.style.transform = 'translateY(-20px)';
        heroMainBanner.style.pointerEvents = 'none';
      }
    }

    // Update Dots
    scrubDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === step);
    });
  }

  // Scroll listener for hero container
  window.addEventListener('scroll', () => {
    if (isAutoScrolling) return;

    const rect = scrollTrack.getBoundingClientRect();
    const trackHeight = scrollTrack.offsetHeight - window.innerHeight;

    if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
      const progress = Math.min(Math.max(-rect.top / trackHeight, 0), 1);
      const step = Math.min(Math.floor(progress * totalSteps), totalSteps - 1);
      if (step !== currentStep) {
        updateScrollyState(step);
      }
    } else if (rect.top > 0) {
      updateScrollyState(0);
    }
  }, { passive: true });

  // Click on scrub dots to jump to specific step
  scrubDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetStep = parseInt(dot.getAttribute('data-step'), 10);
      const trackTop = scrollTrack.offsetTop;
      const trackHeight = scrollTrack.offsetHeight - window.innerHeight;
      const targetScroll = trackTop + (targetStep / (totalSteps - 1)) * trackHeight;

      isAutoScrolling = true;
      updateScrollyState(targetStep);

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });

      setTimeout(() => {
        isAutoScrolling = false;
      }, 700);
    });
  });

  // Clicking on a floating story card advances to the next scene (unless clicking an anchor or button)
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) {
        return; // Allow direct navigation to external sites & buttons
      }
      const nextStep = (currentStep + 1) % totalSteps;
      const targetDot = scrubDots[nextStep];
      if (targetDot) targetDot.click();
    });
  });

  // Initial state
  updateScrollyState(0);
}

/* ==========================================================================
   4. INTERACTIVE SERVICES HOVER & POPUP ENGINE
   ========================================================================== */
function initInteractiveServices() {
  const rowItems = document.querySelectorAll('.service-row-item');
  const previewCard = document.querySelector('.service-preview-card');
  const previewImg = document.getElementById('previewCardImg');
  const previewBadge = document.getElementById('previewCardBadge');
  const previewTitle = document.getElementById('previewCardTitle');
  const previewMetric = document.getElementById('previewCardMetric');
  const previewDesc = document.getElementById('previewCardDesc');
  const previewLink = document.getElementById('previewCardLink');
  const filterBtns = document.querySelectorAll('.interactive-service-filter-btn');

  if (!rowItems.length || !previewCard) return;

  function activateServiceRow(row) {
    rowItems.forEach(r => r.classList.remove('active'));
    row.classList.add('active');

    const title = row.getAttribute('data-title');
    const tag = row.getAttribute('data-tag');
    const metric = row.getAttribute('data-metric');
    const desc = row.getAttribute('data-desc');
    const img = row.getAttribute('data-img');
    const link = row.getAttribute('data-link') || 'services.html';

    if (previewImg) {
      previewImg.style.opacity = '0.3';
      previewImg.style.transform = 'scale(0.97)';
      setTimeout(() => {
        previewImg.src = img;
        previewImg.alt = title;
        previewImg.style.opacity = '1';
        previewImg.style.transform = 'scale(1)';
      }, 140);
    }
    if (previewBadge) previewBadge.textContent = tag;
    if (previewTitle) previewTitle.textContent = title;
    if (previewMetric) previewMetric.textContent = metric;
    if (previewDesc) previewDesc.textContent = desc;
    if (previewLink) previewLink.href = link;
  }

  // Hover and click events for desktop and touch
  rowItems.forEach(row => {
    row.addEventListener('mouseenter', () => activateServiceRow(row));
    row.addEventListener('click', () => activateServiceRow(row));
  });

  // Filter tabs (All Services, Dispatch, Co-hosting, Bookkeeping)
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        let firstMatch = null;

        rowItems.forEach(row => {
          const category = row.getAttribute('data-category');
          if (filter === 'all' || category === filter || (category && category.includes(filter))) {
            row.style.display = 'flex';
            if (!firstMatch) firstMatch = row;
          } else {
            row.style.display = 'none';
          }
        });

        if (firstMatch) {
          activateServiceRow(firstMatch);
        }
      });
    });
  }
}

/* ==========================================================================
   5. SERVICES FILTERING
   ========================================================================== */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.treatment-filter-btn');
  const cards = document.querySelectorAll('.treatment-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   5. RESULTS SHOWCASE FILTERING
   ========================================================================== */
function initResultFilters() {
  const filterBtns = document.querySelectorAll('.result-filter-btn');
  const cards = document.querySelectorAll('.result-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   6. PRICING TABLE FILTERING
   ========================================================================== */
function initPricingFilters() {
  const filterBtns = document.querySelectorAll('.pricing-filter-btn');
  const rows = document.querySelectorAll('.price-row');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      rows.forEach(row => {
        const cat = row.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          row.style.display = 'grid';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. ANIMATED STAT COUNTERS
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-val');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = (easeProgress * target);

            if (isDecimal) {
              counter.textContent = current.toFixed(1);
            } else {
              counter.textContent = Math.floor(current).toLocaleString('en-US');
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              if (isDecimal) {
                counter.textContent = target.toFixed(1);
              } else {
                counter.textContent = target.toLocaleString('en-US') + (counter.getAttribute('data-suffix') || '');
              }
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.about-stats-row');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   8. IMAGE LIGHTBOX MODAL
   ========================================================================== */
function initLightbox() {
  const modal = document.querySelector('.lightbox-modal');
  const modalImg = document.querySelector('.lightbox-img');
  const modalCaption = document.querySelector('.lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close-btn');

  if (!modal) return;

  const clickableElements = document.querySelectorAll('[data-lightbox-src]');

  clickableElements.forEach(el => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-lightbox-src');
      const caption = el.getAttribute('data-lightbox-caption') || '';
      modalImg.src = src;
      modalCaption.textContent = caption;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   9. INTERACTIVE BOOKING FLOW
   ========================================================================== */
function initBookingFlow() {
  const bookingForm = document.getElementById('bookingForm');
  const serviceSelect = document.getElementById('serviceSelect');
  const successBox = document.querySelector('.booking-success-message');
  const summaryText = document.getElementById('successSummary');

  // Prepopulate service on click
  const quickBookBtns = document.querySelectorAll('[data-book-service]');
  quickBookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-book-service');
      if (serviceSelect && serviceName) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.includes(serviceName) || serviceSelect.options[i].value === serviceName) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
      const bookingSection = document.getElementById('reservation');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName').value;
    const service = serviceSelect.options[serviceSelect.selectedIndex].text;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;

    bookingForm.style.display = 'none';
    if (summaryText) {
      summaryText.innerHTML = `Thank you <strong>${name}</strong>! Your session with Primewave Group for <strong>${service}</strong> has been confirmed for <strong>${date}</strong> at <strong>${time}</strong>. A confirmation email and calendar invitation have been sent to your address.`;
    }
    if (successBox) {
      successBox.classList.add('show');
    }
  });
}
