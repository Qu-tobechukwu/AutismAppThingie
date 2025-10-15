// DOM Elements
const eventButtons = document.querySelectorAll('.event-btn');
const eventSection = document.getElementById('event-selection');
const challengesSection = document.getElementById('challenges');
const eventTitle = document.getElementById('event-title');
const challengeList = document.getElementById('challenge-list');
const backBtn = document.getElementById('back-btn');
const calmBtn = document.getElementById('calm-btn');
const calmCorner = document.getElementById('calm-corner');
const exitCalm = document.getElementById('exit-calm');
const calmCircles = document.getElementById('calm-circles');

const reflectBtn = document.getElementById('reflect-btn');
const reflection = document.getElementById('reflection');
const exitReflection = document.getElementById('exit-reflection');
const saveReflection = document.getElementById('save-reflection');
const reflectionText = document.getElementById('reflection-text');
const reflectionSaved = document.getElementById('reflection-saved');
const reflectionList = document.getElementById('reflection-list');

const lowStimToggle = document.getElementById('low-stim-toggle');

// Load previous Low-Stimulation mode
if (localStorage.getItem('low-stim') === 'true') {
  document.body.classList.add('low-stim');
}

// Toggle Low-Stimulation Mode
lowStimToggle.addEventListener('click', () => {
  document.body.classList.toggle('low-stim');
  localStorage.setItem('low-stim', document.body.classList.contains('low-stim'));
});

// Challenges Data
const challengesData = {
  party: [
    "Compliment someone’s outfit",
    "Introduce yourself to one new person",
    "Find someone who likes the same music as you",
    "Say one sentence about how you're feeling"
  ],
  coffee: [
    "Ask someone what their favorite drink is",
    "Share a fun fact about yourself",
    "Smile at someone who looks alone"
  ],
  networking: [
    "Exchange one professional tip",
    "Ask someone about their work",
    "Connect on LinkedIn or social media"
  ],
  dinner: [
    "Ask someone about their favorite meal",
    "Share a small anecdote",
    "Thank the host for the meal"
  ]
};

// Event Selection
eventButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const event = btn.dataset.event;
    showChallenges(event);
  });
});

// Back Button
backBtn.addEventListener('click', () => {
  challengesSection.classList.add('hidden');
  eventSection.classList.remove('hidden');
});

// Calm Corner
calmBtn.addEventListener('click', () => {
  challengesSection.classList.add('hidden');
  calmCorner.classList.remove('hidden');
  createCalmCircles();
});

exitCalm.addEventListener('click', () => {
  calmCorner.classList.add('hidden');
  challengesSection.classList.remove('hidden');
  calmCircles.innerHTML = '';
});

// Reflection Log
reflectBtn.addEventListener('click', () => {
  challengesSection.classList.add('hidden');
  reflection.classList.remove('hidden');
  loadReflections();
});

exitReflection.addEventListener('click', () => {
  reflection.classList.add('hidden');
  challengesSection.classList.remove('hidden');
  reflectionSaved.classList.add('hidden');
});

saveReflection.addEventListener('click', () => {
  let notes = JSON.parse(localStorage.getItem('reflections')) || [];
  if (reflectionText.value.trim() !== '') {
    notes.push(reflectionText.value.trim());
    localStorage.setItem('reflections', JSON.stringify(notes));
    reflectionText.value = '';
    reflectionSaved.classList.remove('hidden');
    loadReflections();
  }
});

// Show Challenges
function showChallenges(event) {
  eventTitle.textContent = `Challenges for ${capitalize(event)}`;
  challengeList.innerHTML = '';

  let completed = JSON.parse(localStorage.getItem(`completed-${event}`)) || [];

  challengesData[event].forEach((challenge, index) => {
    const li = document.createElement('li');
    li.textContent = challenge;
    if (completed.includes(index)) li.classList.add('completed');

    li.addEventListener('click', () => {
      li.classList.toggle('completed');
      updateProgress(event);
    });

    challengeList.appendChild(li);
  });

  eventSection.classList.add('hidden');
  challengesSection.classList.remove('hidden');
}

// Update Progress
function updateProgress(event) {
  const lis = challengeList.querySelectorAll('li');
  let completed = [];
  lis.forEach((li, idx) => {
    if (li.classList.contains('completed')) completed.push(idx);
  });
  localStorage.setItem(`completed-${event}`, JSON.stringify(completed));
}

// Load Reflections
function loadReflections() {
  reflectionList.innerHTML = '';
  let notes = JSON.parse(localStorage.getItem('reflections')) || [];
  notes.forEach((note) => {
    const li = document.createElement('li');
    li.textContent = note;
    reflectionList.appendChild(li);
  });
}

// Calm Circles Animation
function createCalmCircles() {
  calmCircles.innerHTML = '';
  for (let i = 0; i < 15; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    const size = 20 + Math.random() * 50;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.left = `${Math.random() * 100}%`;
    circle.style.top = `${Math.random() * 100}%`;
    circle.style.animationDuration = `${8 + Math.random() * 6}s`;
    calmCircles.appendChild(circle);
  }
}

// Capitalize Function
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
