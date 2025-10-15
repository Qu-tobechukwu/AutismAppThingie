/* common.js — now with low-stim & voice hints */

document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('#low-stim-toggle');
  toggles.forEach(t => {
    t.addEventListener('click', () => {
      const isOn = document.body.classList.toggle('low-stim');
      localStorage.setItem('low-stim', isOn ? 'true' : 'false');
      window.dispatchEvent(new Event('storage'));
      speak(isOn ? "Low stimulation mode activated." : "Low stimulation mode off.");
    });
  });

  // Apply saved low-stim mode
  if (localStorage.getItem('low-stim') === 'true') {
    document.body.classList.add('low-stim');
  }

  window.addEventListener('storage', (ev) => {
    if (ev.key === 'low-stim') {
      if (localStorage.getItem('low-stim') === 'true') document.body.classList.add('low-stim');
      else document.body.classList.remove('low-stim');
    }
  });
});

/* === Accessible Voice Feedback === */
function speak(text) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1;
    utter.volume = 0.6;
    synth.speak(utter);
  } catch(e) {
    console.warn("Speech not supported:", e);
  }
}

/* Helper functions to call on events elsewhere */
window.voiceHint = {
  challengeDone: () => speak("Nice job. Challenge completed."),
  reflectionSaved: () => speak("Reflection saved successfully."),
  calmAffirm: () => speak("Take a slow breath. You are safe."),
};
