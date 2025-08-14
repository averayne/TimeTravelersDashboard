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
