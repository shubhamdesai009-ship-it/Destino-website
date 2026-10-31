const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const service = document.getElementById('service');
    if (service) service.value = link.dataset.service;
  });
});

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpppjkev';

document.getElementById('journeyForm')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById('formStatus');
  const submitButton = form.querySelector('button[type="submit"]');

  const formData = new FormData(form);
  formData.set('_subject', `New Destino enquiry — ${formData.get('service')}`);
  if (formData.get('email')) formData.set('_replyto', formData.get('email'));

  submitButton.disabled = true;
  status.textContent = 'Sending your enquiry…';

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Form submission failed');
    form.reset();
    status.textContent = 'Thank you! Your enquiry has been sent. We will contact you soon.';
  } catch (error) {
    status.textContent = 'Sorry, your enquiry could not be sent. Please email shubham.desai009@gmail.com directly.';
  } finally {
    submitButton.disabled = false;
  }
});
