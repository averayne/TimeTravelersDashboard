document.addEventListener('DOMContentLoaded', () => {
  function rotateHand(element, degrees) {
    if (element) {
      element.style.transform = `rotate(${degrees}deg)`;
    }
  }

  function updateClockHands() {
    const now = new Date();

    const hourDeg = ((now.getHours() % 12) + now.getMinutes() / 60) * 30;
    const minuteDeg = (now.getMinutes() + now.getSeconds() / 60) * 6;
    const secondDeg = now.getSeconds() * 6;

    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');

    rotateHand(hourHand, hourDeg);
    rotateHand(minuteHand, minuteDeg);
    rotateHand(secondHand, secondDeg);
  }

  updateClockHands();
  setInterval(updateClockHands, 1000);

});



async function fetchHistoryEvent() {
  try {
    const response = await fetch('https://history.muffinlabs.com/date');
    const data = await response.json();
    const events = data.data.Events;
    const randomEvent = events[Math.floor(Math.random() * events.length)];

    const historyDiv = document.getElementById('history-event');
    historyDiv.innerHTML = `<strong>${randomEvent.year}:</strong> ${randomEvent.text}`;
  } catch (error) {
    document.getElementById('history-event').textContent = '⚠️ Failed to retrieve event.';
    console.error(error);
  }
}
const weatherDiv = document.getElementById('weather');
const leftClock = document.getElementById('leftClock');

fetch('https://api.open-meteo.com/v1/forecast?latitude=36.15398&longitude=-95.99277&current=temperature_2m,wind_speed_10m,precipitation&temperature_unit=fahrenheit')
  .then(response => response.json())
  .then(data => {
    const temp = data.current.temperature_2m;
    const wind = data.current.wind_speed_10m;
    const rain = data.current.precipitation;

    leftClock.textContent = `🌡️ ${temp} °F | 💨 ${wind} mph | 🌧️ ${rain} in`;
  })
  .catch(error => {
    weatherDiv.textContent = 'Error fetching weather';
    console.error(error);
  });

const centerClock = document.getElementById('centerClock');

const now = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = now.toLocaleDateString('en-US', options);

centerClock.innerHTML = ` ${formattedDate.replace(',', '<br>')}`;