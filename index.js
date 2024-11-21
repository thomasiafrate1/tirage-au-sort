// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiH8CXgSbue5EfURoB-f87aNVJhJFGd1s",
  authDomain: "tirageausort-afc8d.firebaseapp.com",
  databaseURL: "https://tirageausort-afc8d-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "tirageausort-afc8d",
  storageBucket: "tirageausort-afc8d.firebasestorage.app",
  messagingSenderId: "30882873608",
  appId: "1:30882873608:web:49f71a421f889c98076cbd",
  measurementId: "G-JDMF6903YE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let participants = []; // Liste des participants
let winners = []; // Liste des gagnants

// Ajouter un participant
async function addParticipant(name, phone) {
    console.log("Ajout d'un participant :", name, phone);
    const newParticipantRef = push(ref(db, 'participants'));
    await set(newParticipantRef, { name, phone })
        .then(() => console.log("Participant ajouté à Firebase"))
        .catch((error) => console.error("Erreur lors de l'ajout :", error));
}

// Charger les participants
function loadParticipants() {
    onValue(ref(db, 'participants'), (snapshot) => {
        const data = snapshot.val();
        participants = Object.values(data || {}); // Mise à jour de la variable globale
        console.log("Participants chargés :", participants);
        updateParticipantsList(participants);
    }, (error) => {
        console.error("Erreur lors du chargement des participants :", error);
    });
}

// Ajouter un gagnant
async function addWinner(day, name, phone) {
    console.log("Ajout du gagnant :", day, name, phone);
    const newWinnerRef = push(ref(db, 'winners'));
    await set(newWinnerRef, { day, name, phone })
        .then(() => console.log("Gagnant ajouté à Firebase"))
        .catch((error) => console.error("Erreur lors de l'ajout du gagnant :", error));
}

// Charger les gagnants
function loadWinners() {
    onValue(ref(db, 'winners'), (snapshot) => {
        const data = snapshot.val();
        winners = Object.entries(data || {}).map(([key, value]) => value); // Mise à jour de la variable globale
        console.log("Gagnants chargés :", winners);
        updateWinnersList(winners);
    }, (error) => {
        console.error("Erreur lors du chargement des gagnants :", error);
    });
}

// Mise à jour de l'affichage des participants
function updateParticipantsList(participants) {
    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = '';
    participants.forEach(({ name, phone }) => {
        const li = document.createElement('li');
        li.textContent = `${name} - ${phone}`;
        participantsList.appendChild(li);
    });
}

// Mise à jour de l'affichage des gagnants
function updateWinnersList(winners) {
    const winnersList = document.getElementById('winnersList');
    winnersList.innerHTML = '';
    winners.forEach((winner, index) => {
        const li = document.createElement('li');
        li.textContent = `Jour ${index + 1} : ${winner.name} (${winner.phone})`;
        winnersList.appendChild(li);
    });
}

// Bouton Tirage au sort
document.getElementById('drawButton').addEventListener('click', () => {
    console.log("Bouton Tirage au sort cliqué !");
    if (participants.length > 0) {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        console.log("Gagnant sélectionné :", winner);
        addWinner(winners.length + 1, winner.name, winner.phone);
        document.getElementById('winner').textContent = `Le gagnant est : ${winner.name} (${winner.phone})`;
    } else {
        alert("Aucun participant !");
    }
});

// Bouton Ajouter un participant
document.getElementById('addButton').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();
    if (name && phone) {
        addParticipant(name, phone);
        document.getElementById('nameInput').value = '';
        document.getElementById('phoneInput').value = '';
    } else {
        alert("Veuillez entrer un nom et un numéro !");
    }
});

// Charger les données au démarrage
loadParticipants();
loadWinners();
