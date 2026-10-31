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

document.getElementById('journeyForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Destion enquiry — ${data.get('service')}`);
  const body = encodeURIComponent(
`Hello Destion,

I would like to enquire about a journey.

Name: ${data.get('name')}
Phone: ${data.get('phone')}
Email: ${data.get('email') || 'Not provided'}
Service: ${data.get('service')}

Requirement:
${data.get('message') || 'I would like to discuss the details.'}

Please contact me to discuss availability and next steps.`
  );
  // Replace this placeholder with the verified business inbox before publishing.
  const businessEmail = 'YOUR_EMAIL_ADDRESS';
  const status = document.getElementById('formStatus');
  if (businessEmail === 'YOUR_EMAIL_ADDRESS') {
    status.textContent = 'Before publishing, replace YOUR_EMAIL_ADDRESS in script.js with your business email. Your enquiry details are ready to be sent.';
    return;
  }
  window.location.href = `mailto:${businessEmail}?subject=${subject}&body=${body}`;
});
