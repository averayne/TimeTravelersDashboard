// API Configuration
const API_KEY = "5pFrgnVpEVGJUUh7ScPbag==SjpLKQWO2VotbQmk"; // API Ninjas key

// Set Variables
const startYear = 1600;
const endYear = 2024;
const defaultYear = 1800;

// DOM Setup
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

  // Update page on year change
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
      fetchHistoryQuote(), // random quote, no category
    ]);

    // Error catch historical figure
    if (personRes.status === "fulfilled") {
      renderFigure(figureBox, year, personRes.value);
    } else {
      console.error("Person fetch failed:", personRes.reason);
      figureBox.innerHTML = `<p>Couldn’t load a person for ${escapeHTML(
        year
      )}.</p>`;
    }

    // Error catch historical event
    if (eventRes.status === "fulfilled") {
      renderEvent(eventBox, year, eventRes.value);
    } else {
      console.error("Event fetch failed:", eventRes.reason);
      eventBox.innerHTML = `<p>Couldn’t load an event for ${escapeHTML(
        year
      )}.</p>`;
    }

    // Error catch random quote
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

// Fetch historical person from Wikipedia
async function showPersonByYear(year) {
  // Create list of pages with birth year
  const listURL =
    `https://en.wikipedia.org/w/api.php` +
    `?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(
      year
    )}_births` +
    `&cmtype=page&cmlimit=50&format=json&origin=*`;

  const listRes = await fetch(listURL);
  if (!listRes.ok) throw new Error(`Wiki list HTTP ${listRes.status}`);

  const members = (await listRes.json()).query?.categorymembers;
  if (!Array.isArray(members) || members.length === 0) return null;

  // Pick a random one
  const pick = members[Math.floor(Math.random() * members.length)];
  const title = pick.title;

  // Fetch summary
  const sumURL = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}`;
  const sumRes = await fetch(sumURL, {
    headers: { Accept: "application/json" },
  });
  if (!sumRes.ok) throw new Error(`Wiki summary HTTP ${sumRes.status}`);

  const sum = await sumRes.json();

  return {
    title,
    description: sum.description || sum.extract || "",
    year: Number(year),
    pageURL:
      (sum.content_urls && sum.content_urls.desktop?.page) ||
      `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
  };
}

// Fetch event from API Ninja
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

// Fetch random quote from API Ninja
async function fetchHistoryQuote() {
  const url = "https://api.api-ninjas.com/v1/quotes"; // random quote
  const res = await fetch(url, { headers: { "X-Api-Key": API_KEY } });
  if (!res.ok) throw new Error(`Quotes API error: ${res.status}`);

  const arr = await res.json();
  return Array.isArray(arr) && arr.length > 0 ? arr[0] : null; // { quote, author, category? }
}

// Render all divs
function renderFigure(container, year, person) {
  if (!person) {
    container.innerHTML = `<p>No historical figure found for ${escapeHTML(
      year
    )}.</p>`;
    return;
  }
  container.innerHTML = `
    <h3>${escapeHTML(person.title)}</h3>
    <img src="assets/images/placeholder-person.png"
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
    <blockquote style="margin:.5rem 0; font-style:italic;">“${escapeHTML(
      quote.quote
    )}”</blockquote>
    <p>— ${escapeHTML(quote.author || "Unknown")}</p>
  `;
}

// Utility functions
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