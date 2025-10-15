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
const reflectBtn = document.getElementById('reflect-btn');
const reflection = document.getElementById('reflection');
const exitReflection = document.getElementById('exit-reflection');
const saveReflection = document.getElementById('save-reflection');
const reflectionText = document.getElementById('reflection-text');
const reflectionSaved = document.getElementById('reflection-saved');

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
});

exitCalm.addEventListener('click', () => {
  calmCorner.classList.add('hidden');
  challengesSection.classList.remove('hidden');
});

// Reflection Log
reflectBtn.addEventListener('click', () => {
  challengesSection.classList.add('hidden');
  reflection.classList.remove('hidden');
  loadReflection();
});

exitReflection.addEventListener('click', () => {
  reflection.classList.add('hidden');
  challengesSection.classList.remove('hidden');
  reflectionSaved.classList.add('hidden');
});

saveReflection.addEventListener('click', () => {
  localStorage.setItem('reflection', reflectionText.value);
  reflectionSaved.classList.remove('hidden');
});

// Show Challenges with LocalStorage Progress
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

// Update LocalStorage Progress
function updateProgress(event) {
  const lis = challengeList.querySelectorAll('li');
  let completed = [];
  lis.forEach((li, idx) => {
    if (li.classList.contains('completed')) completed.push(idx);
  });
  localStorage.setItem(`completed-${event}`, JSON.stringify(completed));
}

// Load Reflection
function loadReflection() {
  reflectionText.value = localStorage.getItem('reflection') || '';
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
