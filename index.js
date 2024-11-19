const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const addButton = document.getElementById('addButton');
const participantsList = document.getElementById('participantsList');
const drawButton = document.getElementById('drawButton');
const clearButton = document.getElementById('clearButton');
const winnerDisplay = document.getElementById('winner');

// Liste des participants (chaque participant est un objet {name, phone})
let participants = [];

// Charger les participants depuis le Local Storage au chargement de la page
window.onload = () => {
    const storedParticipants = localStorage.getItem('participants');
    if (storedParticipants) {
        participants = JSON.parse(storedParticipants);
        updateParticipantsList();
    }
};

// Mettre à jour la liste des participants dans l'interface
function updateParticipantsList() {
    participantsList.innerHTML = ''; // Vide la liste actuelle
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

// Ajouter un participant
addButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    if (name && phone) {
        participants.push({ name, phone }); // Ajouter un objet {name, phone}
        saveParticipants(); // Sauvegarder dans Local Storage
        updateParticipantsList(); // Mettre à jour l'affichage
        nameInput.value = ''; // Réinitialiser le champ de nom
        phoneInput.value = ''; // Réinitialiser le champ de téléphone
    } else {
        alert("Veuillez entrer un nom et un numéro de téléphone !");
    }
});

// Effectuer un tirage au sort
drawButton.addEventListener('click', () => {
    if (participants.length > 0) {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        winnerDisplay.textContent = `Le gagnant est : ${winner.name} (${winner.phone})`;
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
