/* common.js
   Put this file on every page and include it before per-page scripts.
   Handles Low-Stimulation mode persistence and basic shared helpers.
*/

// Low-Stim toggle button behavior (buttons exist on pages that need them)
document.addEventListener('DOMContentLoaded', () => {
  // Attach toggle button if present
  const toggles = document.querySelectorAll('#low-stim-toggle');
  toggles.forEach(t => {
    t.addEventListener('click', () => {
      const isOn = document.body.classList.toggle('low-stim');
      localStorage.setItem('low-stim', isOn ? 'true' : 'false');
      // notify other tabs/pages via storage event
      window.dispatchEvent(new Event('storage'));
    });
  });

  // Apply saved mode on load
  if (localStorage.getItem('low-stim') === 'true') {
    document.body.classList.add('low-stim');
  }

  // Listen for storage changes from other tabs/windows and update
  window.addEventListener('storage', (ev) => {
    if (ev.key === 'low-stim') {
      if (localStorage.getItem('low-stim') === 'true') document.body.classList.add('low-stim');
      else document.body.classList.remove('low-stim');
    }
  });
});
