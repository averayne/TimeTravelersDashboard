function navigateTo(page){
    window.location.href = `${page}.html`;
}
document.getElementById('load-event').addEventListener('click', async function() {
    const response = await fetch('https://serpapi.com/search.json?engine=google_events&q=Events+in+Austin&hl=en&gl=us');
    const data = await response.json();
    document.getElementById('event-output').innerText = JSON.stringify(data);
});
document.getElementById('load-weather').addEventListener('click', async () => {
  const apiKey = 'YOUR_OPENWEATHER_API_KEY';
  const city = 'Tulsa';
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`);
  const data = await response.json();
  document.getElementById('weather-output').textContent = `Temp: ${data.main.temp}°F, ${data.weather[0].description}`;
});