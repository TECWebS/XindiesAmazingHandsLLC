// ── Nav scroll
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Scroll reveal
const revEls = document.querySelectorAll('.reveal-up, .reveal-left');
const revObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 100);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
revEls.forEach(el => revObs.observe(el));

// ── Service selector (sidebar)
function selectService(el, name) {
  document.querySelectorAll('.bsl-item').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  const sel = document.getElementById('serviceSelect');
  if (sel) sel.value = name;
}

// ── Stripe redirect
function redirectStripe() {
  // Replace with your actual Stripe payment link
  window.open('https://buy.stripe.com/YOUR_STRIPE_PAYMENT_LINK', '_blank');
}

// ── Form handlers
function handleBooking(e) {
  const form = document.getElementById('bookingForm');
  if (form.action.includes('YOUR_GOOGLE_FORM')) {
    e.preventDefault();
    alert('Booking form is ready. Connect your Google Form URL to activate submissions.');
  }
}
function handleInquiry(e) {
  if (e.target.action.includes('YOUR_GOOGLE_INQUIRY')) {
    e.preventDefault();
    alert('Inquiry form is ready. Connect your Google Form URL to activate submissions.');
  }
}
