const btn = document.getElementById("toggleSpotifyBtn");
const iframe = document.getElementById("spotifyPlayer");

let isActive = false;

btn.addEventListener("click", () => {
  isActive = !isActive;
  if (isActive) {
    iframe.style.opacity = "1";
    iframe.style.pointerEvents = "auto";
    btn.textContent = "Pause Soundtrack";
  } else {
    iframe.style.opacity = "0.5";
    iframe.style.pointerEvents = "none";
    btn.textContent = "Play Star Wars Soundtrack";
  }
});