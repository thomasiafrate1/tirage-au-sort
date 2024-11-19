const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const addButton = document.getElementById('addButton');
const participantsList = document.getElementById('participantsList');
const drawButton = document.getElementById('drawButton');
const clearButton = document.getElementById('clearButton');
const winnerDisplay = document.getElementById('winner');
const winnersHistory = document.getElementById('winnersHistory');

// Liste des participants
let participants = [];
// Liste des gagnants
let winners = [];

// Charger les données depuis le Local Storage au chargement de la page
window.onload = () => {
    const storedParticipants = localStorage.getItem('participants');
    const storedWinners = localStorage.getItem('winners');

    if (storedParticipants) {
        participants = JSON.parse(storedParticipants);
        updateParticipantsList();
    }
    if (storedWinners) {
        winners = JSON.parse(storedWinners);
        updateWinnersHistory();
    }
};

// Mettre à jour la liste des participants
function updateParticipantsList() {
    participantsList.innerHTML = '';
    participants.forEach(({ name, phone }) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${name}</span>
            <span style="color: gray; font-size: 0.9em; margin-left: 10px;">(${phone})</span>
        `;
        participantsList.appendChild(li);
    });
}

// Sauvegarder les participants dans le Local Storage
function saveParticipants() {
    localStorage.setItem('participants', JSON.stringify(participants));
}

// Mettre à jour l'historique des gagnants
function updateWinnersHistory() {
    winnersHistory.innerHTML = '';
    winners.forEach((winner, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Jour ${index + 1} :</strong> ${winner.name} (${winner.phone})`;
        winnersHistory.appendChild(li);
    });
}

// Sauvegarder les gagnants dans le Local Storage
function saveWinners() {
    localStorage.setItem('winners', JSON.stringify(winners));
}

// Ajouter un participant
addButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    if (name && phone) {
        participants.push({ name, phone });
        saveParticipants();
        updateParticipantsList();
        nameInput.value = '';
        phoneInput.value = '';
    } else {
        alert("Veuillez entrer un nom et un numéro de téléphone !");
    }
});

// Effectuer un tirage au sort
drawButton.addEventListener('click', () => {
    if (participants.length > 0) {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        winners.push(winner); // Ajouter le gagnant à l'historique
        saveWinners(); // Sauvegarder l'historique dans le Local Storage
        updateWinnersHistory(); // Mettre à jour l'affichage
        winnerDisplay.textContent = `Le gagnant est : ${winner.name} (${winner.phone})`;
    } else {
        alert("Aucun participant !");
    }
});

// Supprimer tous les participants
clearButton.addEventListener('click', () => {
    if (confirm("Voulez-vous vraiment supprimer tous les participants ?")) {
        participants = [];
        saveParticipants();
        updateParticipantsList();
        winnerDisplay.textContent = '';
    }
});
