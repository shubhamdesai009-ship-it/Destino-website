
// DESTINO Supabase connection
const SUPABASE_URL = "https://mxaragmabvmplinhvxae.supabase.co";

const SUPABASE_KEY = "sb_publishable_kdlKPQ_H1i88A_qD4T5znA_ixRr7jz0";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");

// Admin login
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginMessage.textContent = "Signing in...";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    loginMessage.textContent = error.message;
    return;
  }

  await showDashboard();
});

// Display dashboard
async function showDashboard() {
  const { data: { user }, error } =
    await supabaseClient.auth.getUser();

  if (error || !user) {
    loginSection.hidden = false;
    dashboardSection.hidden = true;
    return;
  }

  loginSection.hidden = true;
  dashboardSection.hidden = false;

  await loadEnquiries();
}

// Load customer enquiries
async function loadEnquiries() {
  const dataMessage = document.getElementById("dataMessage");
  const table = document.getElementById("enquiriesTable");

  dataMessage.textContent = "Loading enquiries...";
  table.replaceChildren();

  const { data, error } = await supabaseClient
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    dataMessage.textContent = "Unable to load enquiries: " + error.message;
    return;
  }

  const enquiries = data || [];

  document.getElementById("totalEnquiries").textContent =
    enquiries.length;

  document.getElementById("newEnquiries").textContent =
    enquiries.filter(item => item.status === "New").length;

  document.getElementById("confirmedEnquiries").textContent =
    enquiries.filter(item => item.status === "Confirmed").length;

  document.getElementById("completedEnquiries").textContent =
    enquiries.filter(item => item.status === "Completed").length;

  if (enquiries.length === 0) {
    dataMessage.textContent = "No customer enquiries found yet.";
    return;
  }

  dataMessage.textContent = `${enquiries.length} customer enquiries found.`;

  enquiries.forEach(item => {
    const row = document.createElement("tr");

    const values = [
      item.customer_name || "-",
      item.phone || "-",
      item.service || "-",
      item.journey_date || "-",
      item.status || "New"
    ];

    values.forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    table.appendChild(row);
  });
}

// Logout
logoutButton.addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Logout failed: " + error.message);
    return;
  }

  dashboardSection.hidden = true;
  loginSection.hidden = false;
  loginForm.reset();
  loginMessage.textContent = "";
});

// Restore existing login session
async function checkExistingSession() {
  const { data: { session } } =
    await supabaseClient.auth.getSession();

  if (session) {
    await showDashboard();
  }
}

checkExistingSession();
