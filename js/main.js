/* ══════════════════════════════════════════════
   XINDIES AMAZING HANDS LLC — Global JavaScript
   ══════════════════════════════════════════════

   SETUP CHECKLIST:
   1. Replace STRIPE_PAYMENT_LINK below with your real
      Stripe Payment Link URL (from your Stripe dashboard
      → Payment Links → Create a link).
   2. Replace GOOGLE_FORM_ACTION_URL in each HTML file's
      <form action="..."> with your Google Form POST URL.
   ══════════════════════════════════════════════ */

/* ─────────────────────────────────
   STRIPE PAYMENT LINK
   Go to: https://dashboard.stripe.com/payment-links
   Create a link, copy the URL, paste it below.
   ───────────────────────────────── */
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/YOUR_PAYMENT_LINK_HERE';

/* ─────────────────────────────────
   NAV SCROLL EFFECT
   ───────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
})();

/* ─────────────────────────────────
   SCROLL REVEAL
   ───────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), i * 100);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────
   SERVICES — PRICE REVEAL ON CLICK
   Each card has a "View Pricing" button that toggles
   the price panel. Cards are height-equalized.
   ───────────────────────────────── */
(function initPricePanels() {
  document.querySelectorAll('.svc-price-hint').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const panel = this.nextElementSibling;
      const isOpen = panel.classList.contains('visible');

      // Close all other open panels
      document.querySelectorAll('.svc-price-panel.visible').forEach(p => {
        p.classList.remove('visible');
        p.previousElementSibling.classList.remove('open');
        p.previousElementSibling.textContent = 'View Pricing';
      });

      if (!isOpen) {
        panel.classList.add('visible');
        this.classList.add('open');
        this.textContent = 'Hide Pricing';
      }

      // Re-equalize card heights after animation frame
      requestAnimationFrame(equalizeServiceCards);
    });
  });

  // Close price panel when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.svc-price-panel.visible').forEach(p => {
      p.classList.remove('visible');
      p.previousElementSibling.classList.remove('open');
      p.previousElementSibling.textContent = 'View Pricing';
    });
    requestAnimationFrame(equalizeServiceCards);
  });
})();

function equalizeServiceCards() {
  const grid = document.querySelector('.services-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.svc-card');
  // Reset heights first
  cards.forEach(c => c.style.height = 'auto');
  // Find max height
  let max = 0;
  cards.forEach(c => { if (c.offsetHeight > max) max = c.offsetHeight; });
  // Apply to all
  cards.forEach(c => c.style.height = max + 'px');
}

// Equalize on load and resize
window.addEventListener('load', equalizeServiceCards);
window.addEventListener('resize', equalizeServiceCards);

/* ─────────────────────────────────
   BOOKING FORM — SUB-CATEGORY PICKERS
   ───────────────────────────────── */
function handleServiceChange(val) {
  document.querySelectorAll('.sub-picker').forEach(el => el.classList.remove('visible'));
  const map = {
    'Catering':             'sub-catering',
    'Hair':                 'sub-hair',
    'Event Planning':       'sub-event',
    'Wedding Coordination': 'sub-wedding',
  };
  if (map[val]) document.getElementById(map[val]).classList.add('visible');
}

function pickSub(el, hiddenId) {
  el.closest('.sub-options').querySelectorAll('.sub-opt').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById(hiddenId).value = el.dataset.val;
}

/* ─────────────────────────────────
   BOOKING FORM — SIDEBAR SYNC
   ───────────────────────────────── */
function selectService(el, name) {
  document.querySelectorAll('.bsl-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  const sel = document.getElementById('serviceSelect');
  if (sel) {
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === name) { sel.selectedIndex = i; break; }
    }
    handleServiceChange(name);
  }
}

/* ─────────────────────────────────
   STRIPE REDIRECT
   ───────────────────────────────── */
function redirectStripe() {
  if (STRIPE_PAYMENT_LINK.includes('YOUR_PAYMENT_LINK_HERE')) {
    alert('Stripe Payment Link not yet configured.\n\nTo set it up:\n1. Log in to dashboard.stripe.com\n2. Go to Payment Links → Create a link\n3. Copy the URL and replace STRIPE_PAYMENT_LINK in js/main.js');
    return;
  }
  window.open(STRIPE_PAYMENT_LINK, '_blank');
}

/* ─────────────────────────────────
   BOOKING FORM SUBMIT HANDLER
   ───────────────────────────────── */
function handleBooking(e) {
  const form = document.getElementById('bookingForm');
  if (form && form.action.includes('YOUR_GOOGLE_FORM')) {
    e.preventDefault();
    alert('Booking form not yet connected to Google Forms.\n\nSee the SETUP INSTRUCTIONS comment inside book.html to link your Google Form.');
    return;
  }
  // Form submits normally to Google Forms
}

/* ─────────────────────────────────
   INQUIRY FORM SUBMIT HANDLER
   ───────────────────────────────── */
function handleInquiry(e) {
  const form = e.target;
  if (form && form.action.includes('YOUR_GOOGLE_INQUIRY_FORM_URL')) {
    e.preventDefault();
    alert('Contact form not yet connected to Google Forms.\n\nSee the SETUP INSTRUCTIONS comment inside contact.html to link your Google Form.');
    return;
  }
}

/* ─────────────────────────────────
   LEGAL MODAL
   ───────────────────────────────── */
(function initLegalModal() {
  const overlay  = document.getElementById('legalOverlay');
  if (!overlay) return;
  const tabs     = document.querySelectorAll('.lm-tab');
  const panels   = document.querySelectorAll('.lm-panel');
  const closeBtn = document.querySelector('.lm-close');

  function openModal(panelId) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.target === panelId));
    panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + panelId));
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  tabs.forEach(tab => tab.addEventListener('click', () => openModal(tab.dataset.target)));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  document.querySelectorAll('[data-legal]').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); openModal(link.dataset.legal); });
  });
})();
