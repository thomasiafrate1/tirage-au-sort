const nameInput = document.getElementById('nameInput');
const addButton = document.getElementById('addButton');
const participantsList = document.getElementById('participantsList');
const drawButton = document.getElementById('drawButton');
const winnerDisplay = document.getElementById('winner');

const participants = [];

addButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
        participants.push(name);
        const li = document.createElement('li');
        li.textContent = name;
        participantsList.appendChild(li);
        nameInput.value = '';
    } else {
        alert("Veuillez entrer un nom !");
    }
});

drawButton.addEventListener('click', () => {
    if (participants.length > 0) {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        winnerDisplay.textContent = `Le gagnant est : ${winner}`;
    } else {
        alert("Aucun participant !");
    }
});
