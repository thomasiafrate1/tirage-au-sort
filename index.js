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


// Variables globales
let participants = []; // Liste des participants
let winners = []; // Liste des gagnants
let lot = {}; // Liste des lots par jour

// Ajouter un participant
async function addParticipant(name, phone) {
    console.log("Ajout d'un participant :", name, phone);
    const newParticipantRef = push(ref(db, 'participants'));
    await set(newParticipantRef, { name, phone })
        .then(() => console.log("Participant ajouté à Firebase"))
        .catch((error) => console.error("Erreur lors de l'ajout :", error));
}

// Charger les participants depuis Firebase
function loadParticipants() {
    onValue(ref(db, 'participants'), (snapshot) => {
        participants = Object.values(snapshot.val() || {});
        console.log("Participants chargés :", participants);
        updateParticipantsList(participants);
    }, (error) => {
        console.error("Erreur lors du chargement des participants :", error);
    });
}
// Ajouter un gagnant avec un lot
async function addWinner(day, name, phone, lot) {
    console.log("Ajout du gagnant :", day, name, phone, lot);
    const newWinnerRef = push(ref(db, 'winners'));
    await set(newWinnerRef, { day, name, phone, lot })
        .then(() => console.log("Gagnant ajouté avec succès !"))
        .catch((error) => console.error("Erreur lors de l'ajout du gagnant :", error));
}

// Charger les gagnants depuis Firebase
function loadWinners() {
    onValue(ref(db, 'winners'), (snapshot) => {
        winners = Object.entries(snapshot.val() || {}).map(([key, value]) => value);
        console.log("Gagnants chargés :", winners);
        updateWinnersList(winners);
    }, (error) => {
        console.error("Erreur lors du chargement des gagnants :", error);
    });
}

// Charger les lots depuis Firebase
function loadLot() {
    onValue(ref(db, 'lot'), (snapshot) => {
        lot = snapshot.val() || {};
        console.log("Lots chargés :", lot);
    }, (error) => {
        console.error("Erreur lors du chargement des lots :", error);
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

// Fonction pour générer les noms de jours et les dates
function getDateString(index) {
    const startDate = new Date("2024-12-02"); // Date de début
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + index); // Ajoute les jours
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return currentDate.toLocaleDateString('fr-FR', options); // Ex. : "Lundi 2 décembre"
}


document.getElementById('toggleWinners').addEventListener('click', () => {
    const winnersList = document.getElementById('winnersList');
    // Bascule la classe "active" pour afficher/masquer avec animation
    winnersList.classList.toggle('active');
});



// Mise à jour de l'affichage des gagnants avec lots
function updateWinnersList(winners) {
    const winnersList = document.getElementById('winnersList');
    winnersList.innerHTML = ''; // Efface le contenu précédent
    winners.forEach((winner, index) => {
        const li = document.createElement('li');
        const dateString = getDateString(index); // Calcule la date
        li.innerHTML = `
            <strong>${dateString}</strong> : ${winner.name} (${winner.phone})<br>
            <em>Lot gagné :</em> ${winner.lot || "Non spécifié"}
        `;
        winnersList.appendChild(li);
    });
}


// Bouton Tirage au sort
document.getElementById('drawButton').addEventListener('click', async () => {
    console.log("Bouton Tirage au sort cliqué !");
    if (participants.length > 0) {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        console.log("Gagnant sélectionné :", winner);

        // Récupérer le lot pour le jour actuel
        const day = winners.length + 1; // Numéro du jour basé sur les gagnants existants
        const currentLot = lot[day] || "Lot non défini";

        // Ajouter le gagnant avec le lot à Firebase
        await addWinner(day, winner.name, winner.phone, currentLot);

        // Afficher le gagnant et son lot
        document.getElementById('winner').textContent = `Le gagnant est : ${winner.name} (${winner.phone})`;
        document.getElementById('lot').textContent = `Lot gagné : ${currentLot}`;

        // Supprimer les participants après le tirage
        await clearParticipants();
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

async function clearParticipants() {
    console.log("Suppression de tous les participants...");
    await set(ref(db, 'participants'), null) // Remplace la liste des participants par `null`
        .then(() => {
            console.log("Participants supprimés avec succès !");
            participants = []; // Vide la liste locale
            updateParticipantsList(participants); // Met à jour l'affichage
        })
        .catch((error) => console.error("Erreur lors de la suppression des participants :", error));
}


// Charger les données au démarrage
loadParticipants();
loadWinners();
loadLot();