
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
const searchInput = document.getElementById("enquirySearch");
const enquiriesTable = document.getElementById("enquiriesTable");
const dataMessage = document.getElementById("dataMessage");
const exportButton = document.getElementById("exportButton");

const STATUS_OPTIONS = [
  "New",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled"
];

let allEnquiries = [];

// Admin login
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "Signing in...";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
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

// Load enquiries from Supabase
async function loadEnquiries() {
  dataMessage.textContent = "Loading enquiries...";
  enquiriesTable.replaceChildren();

  const { data, error } = await supabaseClient
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    dataMessage.textContent =
      "Unable to load enquiries: " + error.message;
    return;
  }

  allEnquiries = data || [];

  document.getElementById("totalEnquiries").textContent =
    allEnquiries.length;

  document.getElementById("newEnquiries").textContent =
    allEnquiries.filter(item => item.status === "New").length;

  document.getElementById("confirmedEnquiries").textContent =
    allEnquiries.filter(item => item.status === "Confirmed").length;

  document.getElementById("completedEnquiries").textContent =
    allEnquiries.filter(item => item.status === "Completed").length;

  renderEnquiries();
}

// Create WhatsApp contact button
function createWhatsAppButton(item) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "WhatsApp";
  button.className = "whatsapp-button";

  button.addEventListener("click", () => {
    const phone = String(item.phone || "").replace(/\D/g, "");

    let whatsappNumber = phone;

    if (phone.length === 10) {
      whatsappNumber = "91" + phone;
    } else if (phone.length === 12 && phone.startsWith("91")) {
      whatsappNumber = phone;
    } else {
      alert("Invalid Indian mobile number. Please check the customer's phone number.");
      return;
    }

    const customerName = item.customer_name || "Customer";
    const serviceName = item.service || "your journey";

    let message =
      `Hello ${customerName}, thank you for contacting DESTINO. ` +
      `We received your enquiry for ${serviceName}. ` +
      `Our team would be happy to assist you.`;

    if (item.status === "Confirmed" && item.booking_id) {
      message =
        `Hello ${customerName}, your journey with DESTINO is confirmed! ` +
        `Your Booking ID is ${item.booking_id}. ` +
        `Thank you for choosing DESTINO.`;
    }

    const whatsappURL =
      "https://wa.me/" + whatsappNumber +
      "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  });

  return button;
}

// Search and display enquiries
function renderEnquiries() {
  const searchTerm = (searchInput?.value || "")
    .trim()
    .toLowerCase();

  const filteredEnquiries = allEnquiries.filter(item => {
    const searchableText = [
      item.booking_id,
      item.customer_name,
      item.phone,
      item.email,
      item.service
    ].join(" ").toLowerCase();

    return searchableText.includes(searchTerm);
  });

  enquiriesTable.replaceChildren();

  if (allEnquiries.length === 0) {
    dataMessage.textContent = "No customer enquiries found yet.";
    return;
  }

  dataMessage.textContent =
    `Showing ${filteredEnquiries.length} of ${allEnquiries.length} enquiries.`;

  if (filteredEnquiries.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 9;
    cell.textContent = "No matching enquiries found.";
    row.appendChild(cell);
    enquiriesTable.appendChild(row);
    return;
  }

  filteredEnquiries.forEach(item => {
    const row = document.createElement("tr");

    // Booking ID
    const bookingCell = document.createElement("td");
    bookingCell.textContent = item.booking_id || "-";
    row.appendChild(bookingCell);

    const receivedDate = item.created_at
      ? new Date(item.created_at).toLocaleString("en-IN")
      : "-";

    const values = [
      item.customer_name || "-",
      item.phone || "-",
      item.email || "-",
      item.service || "-",
      item.journey_date || "-",
      receivedDate
    ];

    values.forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    // Editable enquiry status
    const statusCell = document.createElement("td");
    const statusSelect = document.createElement("select");

    STATUS_OPTIONS.forEach(status => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      statusSelect.appendChild(option);
    });

    const currentStatus = STATUS_OPTIONS.includes(item.status)
      ? item.status
      : "New";

    statusSelect.value = currentStatus;
    statusSelect.setAttribute(
      "aria-label",
      `Change status for ${item.customer_name || "enquiry"}`
    );

    statusSelect.addEventListener("change", async () => {
      const newStatus = statusSelect.value;

      statusSelect.disabled = true;
      dataMessage.textContent = "Updating enquiry status...";

      const { error } = await supabaseClient
        .from("enquiries")
        .update({ status: newStatus })
        .eq("id", item.id);

      if (error) {
        alert("Could not update status: " + error.message);
        statusSelect.value = currentStatus;
        statusSelect.disabled = false;
        dataMessage.textContent = "Status update failed.";
        return;
      }

      await loadEnquiries();

      dataMessage.textContent =
        "Enquiry status updated successfully.";
    });

    statusCell.appendChild(statusSelect);
    row.appendChild(statusCell);

    // WhatsApp contact
    const whatsappCell = document.createElement("td");
    whatsappCell.appendChild(createWhatsAppButton(item));
    row.appendChild(whatsappCell);

    enquiriesTable.appendChild(row);
  });
}

// Export all enquiries to Excel-compatible CSV
function exportEnquiries() {
  if (!allEnquiries || allEnquiries.length === 0) {
    alert("No customer enquiries available to export.");
    return;
  }

  const headers = [
    "Booking ID",
    "Customer Name",
    "Phone",
    "Email",
    "Service",
    "Journey Date",
    "Pickup Location",
    "Drop Location",
    "Message",
    "Status",
    "Received Date"
  ];

  function escapeCSV(value) {
    let text = String(value ?? "");

    if (/^[\s]*[=+\-@]/.test(text)) {
      text = "'" + text;
    }

    return '"' + text.replace(/"/g, '""') + '"';
  }

  const rows = allEnquiries.map(item => [
    item.booking_id,
    item.customer_name,
    item.phone,
    item.email,
    item.service,
    item.journey_date,
    item.pickup_location,
    item.drop_location,
    item.message,
    item.status,
    item.created_at
      ? new Date(item.created_at).toLocaleString("en-IN")
      : ""
  ]);

  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map(row => row.map(escapeCSV).join(","))
  ].join("\r\n");

  const blob = new Blob(
    ["\uFEFF" + csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download =
    "DESTINO_Booking_Report_" +
    new Date().toISOString().slice(0, 10) + ".csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Excel export button
exportButton?.addEventListener("click", exportEnquiries);

// Search as the admin types
searchInput?.addEventListener("input", renderEnquiries);

// Logout
logoutButton.addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Logout failed: " + error.message);
    return;
  }

  allEnquiries = [];
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
