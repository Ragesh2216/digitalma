/* =========================================================
   main.js — Shared JavaScript for Bio Tech Website
   ========================================================= */

'use strict';

// ── Preloader ──────────────────────────────────────────
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 1200);
  }
});

// ── Navbar: scroll class & active links ───────────────
const navbar = document.querySelector('.navbar');

function updateNavbar() {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// Set active nav link based on current page
(function setActiveLink() {
  const links = document.querySelectorAll('.navbar-links a, .navbar-mobile a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── Mobile Nav Toggle ─────────────────────────────────
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');

if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    mobileToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      mobileToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!mobileToggle.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      mobileToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ── Scroll Reveal ─────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Scroll To Top ─────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Accordion / FAQ ───────────────────────────────────
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-item.open').forEach(openItem => {
      openItem.classList.remove('open');
    });
    if (!isOpen) item.classList.add('open');
  });
});

// ── Counter Animation ─────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 2000;
  const step = 16;
  let current = 0;
  const increment = target / (duration / step);

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = prefix + (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Filter Buttons ────────────────────────────────────
document.querySelectorAll('.filter-btn-group').forEach(group => {
  group.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      const container = group.closest('.filterable-section');
      if (!container) return;
      container.querySelectorAll('[data-category]').forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
          item.classList.add('reveal', 'visible');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});

// ── Tab Buttons ───────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.tab-group');
    const panel = btn.getAttribute('data-tab');
    if (group) {
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-panel') === panel);
    });
  });
});

// ── Form Validation ───────────────────────────────────
document.querySelectorAll('form[data-validate]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const error = field.closest('.form-group')?.querySelector('.form-error');
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#ef4444';
        if (error) error.style.display = 'block';
      } else {
        field.style.borderColor = '';
        if (error) error.style.display = 'none';
      }
    });

    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.style.borderColor = '#ef4444';
      valid = false;
    }

    // Password length
    const passField = form.querySelector('input[type="password"]');
    if (passField && passField.value && passField.value.length < 6) {
      passField.style.borderColor = '#ef4444';
      valid = false;
    }

    if (valid) {
      const successMsg = form.querySelector('.form-success');
      if (successMsg) {
        successMsg.style.display = 'block';
        form.reset();
        setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
      }
    }
  });

  // Real-time clear error on input
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
});

// ── Smooth Internal Links ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
