
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
