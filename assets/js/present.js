function navigateTo(page){
    window.location.href = `${page}.html`;
}
document.getElementById('load-event').addEventListener('click', async function() {
  const apiKey = '477a8a80b9c0de8d8126138c48e6631c'; 
  const response = await fetch(`https://gnews.io/api/v4/top-headlines?lang=en&country=us&max=1&apikey=${apiKey}`);
  const data = await response.json();
  console.log(data);
  if (data.articles && data.articles.length > 0) {
    const article = data.articles[0];
    const title = article.title || "No title";
    const author = article.source && article.source.name ? `Source: ${article.source.name}` : "Source unknown";
    const desc = article.description || "No description available.";
    document.getElementById('event-output').innerText = `${title}\n${author}\n${desc}`;
  } else {
    document.getElementById('event-output').innerText = "No events found.";
  }
});
document.getElementById('load-weather').addEventListener('click', async () => {
  const city = 'Tulsa';
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=36.15398&longitude=-95.99277&current=temperature_2m,wind_speed_10m,precipitation&temperature_unit=fahrenheit`);
  const data = await response.json();
  document.getElementById('weather-output').textContent = `Temp: ${data.current.temperature_2m}°F, Wind Speed: ${data.current.wind_speed_10m} mph, Precipitation: ${data.current.precipitation} mm`;
});

const apiKey = '1cea292dc1a646578fc8d2eb962f75d1';
const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;

document.getElementById('load-currency').addEventListener('click', async () => {
  try {
    const apiKey = '1cea292dc1a646578fc8d2eb962f75d1';
    const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${apiKey}`);
    const data = await response.json();
    if (data.rates) {
      const cadToUsd = 1 / data.rates.CAD;
      const cadToMxn = data.rates.MXN / data.rates.CAD;
      const cadToEur = data.rates.EUR / data.rates.CAD;
      document.getElementById('currency-output').textContent =
        `CAD to MXN: ${cadToMxn.toFixed(4)}\nCAD to USD: ${cadToUsd.toFixed(4)}\nCAD to EUR: ${cadToEur.toFixed(4)}`;
    } else if (data.error) {
      document.getElementById('currency-output').textContent = 'Error: ' + data.error;
    } else {
      document.getElementById('currency-output').textContent = 'Currency data not available.';
    }
  } catch (error) {
    console.error('Error fetching currency data:', error);
    document.getElementById('currency-output').textContent = 'Failed to load exchange rates.';
  }
});

function displayRates(rates) {
  const output = document.getElementById('currency-output');
  output.innerHTML = '<h3>Exchange Rates (Base: USD)</h3>';

  const list = document.createElement('ul');
  for (const [currency, value] of Object.entries(rates)) {
    const item = document.createElement('li');
    item.textContent = `${currency}: ${value.toFixed(2)}`;
    list.appendChild(item);
  }

  output.appendChild(list);
}
document.getElementById('event-output').innerHTML = `
  <h3>${title}</h3>
  <p><em>${author}</em></p>
  <p>${desc}</p>
`;