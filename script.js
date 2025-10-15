const eventButtons = document.querySelectorAll('.event-btn');
const eventSection = document.getElementById('event-selection');
const challengesSection = document.getElementById('challenges');
const eventTitle = document.getElementById('event-title');
const challengeList = document.getElementById('challenge-list');
const backBtn = document.getElementById('back-btn');

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

eventButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const event = btn.dataset.event;
    showChallenges(event);
  });
});

backBtn.addEventListener('click', () => {
  challengesSection.classList.add('hidden');
  eventSection.classList.remove('hidden');
});

function showChallenges(event) {
  eventTitle.textContent = `Challenges for ${capitalize(event)}`;
  challengeList.innerHTML = '';
  challengesData[event].forEach(challenge => {
    const li = document.createElement('li');
    li.textContent = challenge;
    li.addEventListener('click', () => {
      li.style.textDecoration = 'line-through';
    });
    challengeList.appendChild(li);
  });
  eventSection.classList.add('hidden');
  challengesSection.classList.remove('hidden');
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
