// API Configuration
const API_KEY = "API-KEY-GOES-HERE"; // API Ninja Key
const startYear = 1600;
const endYear = 2024;
const defaultYear = 1800;

// DOM Hooks
document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("year-selector");
  const eventBox   = document.getElementById("historical-event"); 

  // Populate year dropdown
  for (let y = startYear; y <= endYear; y++) {
    const opt = document.createElement("option");
    opt.value = String(y);
    opt.textContent = String(y);
    yearSelect.appendChild(opt);
  }

  // Handle selection of year
  yearSelect.addEventListener("change", async () => {
    const year = yearSelect.value;
    if (!year) { eventBox.innerHTML = ""; return; }

    eventBox.textContent = "Loading event…";
    try {
      const ev = await fetchRandomHistoricalEvent(year);
      renderEvent(eventBox, year, ev);
    } catch (e) {
      console.error(e);
      eventBox.innerHTML = `<p>Couldn’t load an event for ${escapeHTML(year)}.</p>`;
    }
  });

  // Set default year to 1800
  yearSelect.value = defaultYear;
  yearSelect.dispatchEvent(new Event("change"));
});

// Functions
async function fetchRandomHistoricalEvent(year) {
  const url = `https://api.api-ninjas.com/v1/historicalevents?year=${encodeURIComponent(year)}`;
  const res = await fetch(url, { headers: { "X-Api-Key": API_KEY } });
  if (!res.ok) throw new Error(`Events API error: ${res.status}`);
  const list = await res.json();
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

function renderEvent(container, year, ev) {
  if (!ev) {
    container.innerHTML = `<p>No recorded events found for ${escapeHTML(year)}.</p>`;
    return;
  }
  const when = [ev.year, ev.month, ev.day].filter(Boolean).join("-") || String(year);
  container.innerHTML = `
    <h4>Historical Event</h4>
    <p><strong>Date:</strong> ${escapeHTML(when)}</p>
    <p><strong>What happened:</strong> ${escapeHTML(ev.event || "Unknown")}</p>
  `;
}

function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}