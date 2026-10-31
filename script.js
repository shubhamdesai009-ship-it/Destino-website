// DESTINO website interactions and Formspree enquiry submission.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open') ?? false;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const service = document.getElementById('service');
    if (service) service.value = link.dataset.service;
  });
});

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpppjkev';
const journeyForm = document.getElementById('journeyForm');
journeyForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById('formStatus');
  const submitButton = form.querySelector('button[type="submit"]');
  if (!status || !submitButton) return;

  const formData = new FormData(form);
  formData.set('_subject', `New DESTINO website enquiry — ${formData.get('service') || 'General enquiry'}`);
  const customerEmail = String(formData.get('email') || '').trim();
  if (customerEmail) formData.set('_replyto', customerEmail);

  submitButton.disabled = true;
  status.textContent = 'Sending your enquiry…';
  status.setAttribute('aria-live', 'polite');

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });
    let result = {};
    try { result = await response.json(); } catch (_) { /* response may not contain JSON */ }
    if (!response.ok) {
      const detail = Array.isArray(result.errors) ? result.errors.map(item => item.message).join(' ') : '';
      throw new Error(detail || `Formspree returned ${response.status}.`);
    }
    form.reset();
    status.textContent = 'Thank you! Your enquiry has been sent successfully. The DESTINO team will contact you soon.';
    status.style.color = '#54752c';
  } catch (error) {
    status.textContent = 'We could not send your enquiry just now. Please try again or email shubham.desai009@gmail.com.';
    status.style.color = '#a33b32';
    console.error('DESTINO Formspree submission error:', error);
  } finally {
    submitButton.disabled = false;
  }
});
