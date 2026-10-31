
// DESTINO website interactions and Supabase enquiry submission.

const SUPABASE_URL = 'https://mxaragmabvmplinhvxae.supabase.co';
const SUPABASE_KEY = 'sb_publishable_kdlKPQ_H1i88A_qD4T5znA_ixRr7jz0';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// Mobile navigation
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuButton?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open') ?? false;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

// Current year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Service preselection
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const service = document.getElementById('service');
    if (service) service.value = link.dataset.service;
  });
});

// Supabase customer enquiry submission
const journeyForm = document.getElementById('journeyForm');

journeyForm?.addEventListener('submit', async event => {
  event.preventDefault();

  const form = event.currentTarget;
  const status = document.getElementById('formStatus');
  const submitButton = form.querySelector('button[type="submit"]');

  if (!status || !submitButton) return;

  const formData = new FormData(form);

  const enquiry = {
    customer_name: String(formData.get('name') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    email: String(formData.get('email') || '').trim() || null,
    service: String(formData.get('service') || '').trim(),
    message: String(formData.get('message') || '').trim() || null,
    status: 'New'
  };

  if (!enquiry.customer_name || !enquiry.phone || !enquiry.service) {
    status.textContent = 'Please complete your name, phone number and service.';
    status.style.color = '#a33b32';
    return;
  }

  submitButton.disabled = true;
  status.textContent = 'Sending your enquiry...';
  status.style.color = '';

  try {
    const { error } = await supabaseClient
      .from('enquiries')
      .insert([enquiry]);

    if (error) throw error;

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
  }
});
