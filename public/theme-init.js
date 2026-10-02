(function () {
  var d = document.documentElement;
  var t = null;
  try {
    t = localStorage.getItem('theme');
  } catch {
    // Storage can be blocked; fall back to the system preference.
  }
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  d.dataset.theme = t;
  d.classList.add('js');
})();
