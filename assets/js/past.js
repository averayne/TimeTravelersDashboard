// API Configuration
const API_KEY = "PUT-API-KEY-HERE"; // API Ninja Key

// Set Variables
const startYear = 1600;
const endYear = 2024;
const defaultYear = 1800;

// DOM Hooks
document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("year-selector");
  const eventBox = document.getElementById("historical-event");
  const figureBox = document.getElementById("historical-figure");
  const quoteBox = document.getElementById("historical-quote");

  // Populate year dropdown
  for (let y = startYear; y <= endYear; y++) {
    const opt = document.createElement("option");
    opt.value = String(y);
    opt.textContent = String(y);
    yearSelect.appendChild(opt);
  }

  // Make page update based on year chosen
  yearSelect.addEventListener("change", async () => {
    const year = yearSelect.value;
    if (!year) {
      figureBox.innerHTML = "";
      eventBox.innerHTML = "";
      quoteBox.innerHTML = "";
      return;
    }

    figureBox.textContent = "Loading person…";
    eventBox.textContent = "Loading event…";
    quoteBox.textContent = "Loading quote…";

    const [personRes, eventRes, quoteRes] = await Promise.allSettled([
      showPersonByYear(year),
      fetchRandomHistoricalEvent(year),
      fetchHistoryQuote(),
    ]);

    // Error catch for historical figure
    if (personRes.status === "fulfilled") {
      renderFigure(figureBox, year, personRes.value);
    } else {
      console.error("Person fetch failed:", personRes.reason);
      figureBox.innerHTML = `<p>Couldn’t load a person for ${escapeHTML(
        year
      )}.</p>`;
    }

    // Error catch for historical even
    if (eventRes.status === "fulfilled") {
      renderEvent(eventBox, year, eventRes.value);
    } else {
      console.error("Event fetch failed:", eventRes.reason);
      eventBox.innerHTML = `<p>Couldn’t load an event for ${escapeHTML(
        year
      )}.</p>`;
    }

    // Error catch for random quote
    if (quoteRes.status === "fulfilled") {
      renderQuote(quoteBox, quoteRes.value);
    } else {
      console.error("Quote fetch failed:", quoteRes.reason);
      quoteBox.innerHTML = `<p>Couldn't load a quote.</p>`;
    }
  });

  // Set default year to 1800
  yearSelect.value = defaultYear;
  yearSelect.dispatchEvent(new Event("change"));
});

// Fetch Wikipedia API
let latestReq = 0;

async function showPersonByYear(year) {
  const q = `incategory:"${year} births"`;
  const url = `https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q=${encodeURIComponent(
    q
  )}&limit=1`;

  const r = await fetch(url, {
    headers: {
      "Api-User-Agent": "YearLookupExample/1.0 (jessicaeitr@gmail.com)",
    }, // Email required for API pull
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);

  const page = (await r.json()).pages?.[0];
  if (!page) return null;

  return {
    title: page.title,
    description: page.description || "",
    year: Number(year),
    pageURL: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
  };
}

// Fetch API Ninja Event
async function fetchRandomHistoricalEvent(year) {
  const url = `https://api.api-ninjas.com/v1/historicalevents?year=${encodeURIComponent(
    year
  )}`;
  const res = await fetch(url, { headers: { "X-Api-Key": API_KEY } });
  if (res.status === 401 || res.status === 403)
    throw new Error("Invalid or missing API Ninjas key.");
  if (!res.ok) throw new Error(`Events API error: ${res.status}`);

  const list = await res.json();
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

// Fetch API Ninja Quote
async function fetchHistoryQuote() {
  const url = "https://api.api-ninjas.com/v1/quotes"; // random quote, no category
  const res = await fetch(url, { headers: { "X-Api-Key": API_KEY } });

  if (!res.ok) {
    throw new Error(`Quotes API error: ${res.status}`);
  }

  const arr = await res.json();
  return Array.isArray(arr) && arr.length > 0 ? arr[0] : null; // { quote, author, category? }
}

// Render Functions
function renderFigure(container, year, person) {
  if (!person) {
    container.innerHTML = `<p>No historical figure found for ${escapeHTML(
      year
    )}.</p>`;
    return;
  }
  container.innerHTML = `
    <h3>${escapeHTML(person.title)}</h3>
    <img src="/assets/Images/placeholder-person.png"
         alt="${escapeAttr(person.title)}"
         style="max-width:200px; display:block; margin:0.5rem 0;">
    <p><strong>About:</strong> ${escapeHTML(
      person.description || "No short bio available"
    )}</p>
    <p><strong>Born:</strong> ${escapeHTML(String(person.year))}</p>
  `;
}

function renderEvent(container, year, ev) {
  if (!ev) {
    container.innerHTML = `<p>No recorded events found for ${escapeHTML(
      year
    )}.</p>`;
    return;
  }
  const when =
    [ev.year, ev.month, ev.day].filter(Boolean).join("-") || String(year);
  container.innerHTML = `
    <h4>Historical Event</h4>
    <p><strong>Date:</strong> ${escapeHTML(when)}</p>
    <p><strong>What happened:</strong> ${escapeHTML(ev.event || "Unknown")}</p>
  `;
}

function renderQuote(container, quote) {
  if (!quote) {
    container.innerHTML = `<h4>Quote</h4><p>No quote available right now.</p>`;
    return;
  }
  container.innerHTML = `
    <h4>Quote</h4>
    <blockquote style="margin:.5rem 0; font-style:italic;">“${escapeHTML(quote.quote)}”</blockquote>
    <p>— ${escapeHTML(quote.author || "Unknown")}</p>
  `;
}

// Utility Functions
function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}
