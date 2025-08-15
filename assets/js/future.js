const btn = document.getElementById("toggleSpotifyBtn");
const iframe = document.getElementById("spotifyPlayer");


document.addEventListener('DOMContentLoaded', () => {
  const btn   = document.getElementById('toggleSpotifyBtn');
  const shell = document.getElementById('spotifyShell');

  // start hidden
  shell.classList.remove('is-visible');

  btn.addEventListener('click', () => {
    const nowVisible = shell.classList.toggle('is-visible');
    btn.textContent = nowVisible ? 'Hide Star Wars Soundtrack' : 'Play Star Wars Soundtrack';
    btn.setAttribute('aria-pressed', nowVisible ? 'true' : 'false');
  });
});
