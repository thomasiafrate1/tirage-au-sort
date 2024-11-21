// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

// Ajouter un participant
async function addParticipant(name, phone) {
    console.log("Ajout d'un participant :", name, phone); // Log pour vérifier l'entrée
    const newParticipantRef = push(ref(db, 'participants'));
    await set(newParticipantRef, { name, phone })
        .then(() => console.log("Participant ajouté à Firebase"))
        .catch((error) => console.error("Erreur lors de l'ajout :", error));
}


// Charger les participants
function loadParticipants() {
    onValue(ref(db, 'participants'), (snapshot) => {
        const data = snapshot.val();
        console.log("Données récupérées depuis Firebase :", data); // Log pour vérifier la réponse
        const participants = Object.values(data || {});
        updateParticipantsList(participants);
    }, (error) => {
        console.error("Erreur lors du chargement des participants :", error);
    });
}

async function addWinner(day, name, phone) {
    console.log("Ajout du gagnant :", day, name, phone); // Log pour confirmer
    const newWinnerRef = push(ref(db, 'winners'));
    await set(newWinnerRef, { day, name, phone })
        .then(() => console.log("Gagnant ajouté à Firebase"))
        .catch((error) => console.error("Erreur lors de l'ajout du gagnant :", error));
}

function loadWinners() {
    onValue(ref(db, 'winners'), (snapshot) => {
        const data = snapshot.val();
        console.log("Gagnants récupérés :", data); // Log pour vérifier
        const winners = Object.entries(data || {}).map(([key, value]) => value);
        updateWinnersList(winners);
    }, (error) => {
        console.error("Erreur lors du chargement des gagnants :", error);
    });
}

// Mettre à jour l'affichage des participants
function updateParticipantsList(participants) {
    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = '';
    participants.forEach(({ name, phone }) => {
        const li = document.createElement('li');
        li.textContent = `${name} - ${phone}`;
        participantsList.appendChild(li);
    });
}

// Gestion des événements
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
