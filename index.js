const nameInput = document.getElementById('nameInput');
const addButton = document.getElementById('addButton');
const participantsList = document.getElementById('participantsList');
const drawButton = document.getElementById('drawButton');
const clearButton = document.getElementById('clearButton');
const winnerDisplay = document.getElementById('winner');

// Liste des participants (chargée depuis le Local Storage au départ)
let participants = [];

// Charger les participants depuis le Local Storage au chargement de la page
window.onload = () => {
    const storedParticipants = localStorage.getItem('participants');
    if (storedParticipants) {
        participants = JSON.parse(storedParticipants);
        updateParticipantsList();
    }
};

// Fonction pour mettre à jour la liste des participants dans l'interface
function updateParticipantsList() {
    participantsList.innerHTML = ''; // Vide la liste affichée
    participants.forEach((name, index) => {
        const li = document.createElement('li');
        li.textContent = name;
        participantsList.appendChild(li);
    });
}

// Fonction pour sauvegarder la liste des participants dans le Local Storage
function saveParticipants() {
    localStorage.setItem('participants', JSON.stringify(participants));
}

// Ajouter un participant
addButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
        participants.push(name); // Ajouter le nom à la liste
        saveParticipants(); // Sauvegarder dans Local Storage
        updateParticipantsList(); // Mettre à jour l'affichage
        nameInput.value = ''; // Réinitialiser le champ
    } else {
        alert("Veuillez entrer un nom !");
    }
});

// Effectuer un tirage au sort
drawButton.addEventListener('click', () => {
    if (participants.length > 0) {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        winnerDisplay.textContent = `Le gagnant est : ${winner}`;
    } else {
        alert("Aucun participant !");
    }
});

// Supprimer tous les participants
clearButton.addEventListener('click', () => {
    if (confirm("Voulez-vous vraiment supprimer tous les participants ?")) {
        participants = []; // Réinitialiser la liste
        saveParticipants(); // Mettre à jour le Local Storage
        updateParticipantsList(); // Mettre à jour l'affichage
        winnerDisplay.textContent = ''; // Effacer le gagnant affiché
    }
});
