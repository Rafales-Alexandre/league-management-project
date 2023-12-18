import autoComplete from "@tarekraafat/autocomplete.js";
import supabase from "../supabaseConfig.js"
// Function to check if a player with the same ID exists
async function doesPlayerExist(playerId) {
    const { data, error } = await supabase
        .from('players')
        .select('id')
        .eq('trainerId', playerId);

    if (error) {
        console.error('Error checking player existence', error);
        return false;
    }

    return data.length > 0; // Returns true if a player with the same ID exists
}

async function addPlayer(playerData) {
    const playerId = playerData.trainerId;
    console.log(playerId)

    // Check if the player already exists
    const playerExists = await doesPlayerExist(playerId);

    if (playerExists) {
        console.error('Player with the same ID already exists');
        return;
    }

    const { data, error } = await supabase
        .from('players')
        .insert([playerData]);

    if (error) {
        console.error('Error inserting data', error);
        return;
    }

    console.log('Added player', data);
    const players = await fetchLeaguePlayer();
    updatePlayerTable(players);
}

async function addLeaguePlayer(playerData) {
    const playerId = playerData.trainerId;

    // Check if the player already exists
    const playerExists = await doesPlayerExist(playerId);

    if (playerExists) {
        console.error('Player with the same ID already exists');
        return;
    }

    const { data, error } = await supabase
        .from('league_players')
        .insert([playerData]);

    if (error) {
        console.error('Error inserting data', error);
        return;
    }

    console.log('Added player', data);
    const players = await fetchLeaguePlayer();
    updatePlayerTable(players);
}

document.getElementById('form-group').addEventListener('submit', async function(e) {
    e.preventDefault();

    const playerId = document.getElementById('id').value;

    // Check if the player already exists
    const playerExists = await doesPlayerExist(playerId);

    if (playerExists) {
        console.error('Player with the same ID already exists');
        return;
    }

    const playerData = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        naissance: document.getElementById('naissance').value,
        sexe: document.getElementById('sexe').value,
        email: document.getElementById('email').value,
        ligue: document.getElementById('ligue').value,
        trainerId: playerId,
    };

    addPlayer(playerData);
    addLeaguePlayer(playerData);
});

async function fetchPlayers() {
    const { data, error } = await supabase
        .from('players')
        .select('*'); 

    if (error) {
        console.error('Error fetching data', error);
        return;
    }

    return data;
}

async function fetchLeaguePlayer(){
    const { data, error } = await supabase
        .from('league_players')
        .select('*'); 

    if (error) {
        console.error('Error fetching data', error);
        return;
    }

    return data;
}

let playersList = [];

// Function to load the list of existing players
async function loadPlayersList() {
    const { data, error } = await supabase
    .from('players')
    .select('nom', 'prenom','trainerId');
    
    if (error) {
        console.error('Error loading players list', error);
        return;
    }
    
    // Store the list of players in the playersList variable
    playersList = data;
    console.log(playersList)
}

// Function to filter suggestions based on user input
function filterSuggestions(input) {
    return playersList.filter(player => {
        const fullName = `${player.nom} ${player.prenom}`;
        return fullName.toLowerCase().includes(input.toLowerCase());
    });
}

// Listen to the input event on the "nom" field
document.getElementById('nom').addEventListener('input', function () {
    const input = this.value;

    // Get matching suggestions
    const suggestions = filterSuggestions(input);

    // Display the suggestions in a dropdown list or a dialog box
    // You can use a suggestion library like autoComplete.js for this
    // Example: https://tarekraafat.github.io/autoComplete.js/
    // Alternatively, you can simply display them below the input field in a div.

    // Example of displaying suggestions in a div
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = '';

    suggestions.forEach(player => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = `${player.nom} ${player.prenom}`;
        suggestionsDiv.appendChild(suggestionItem);
    });
});

function updatePlayerTable(players) {
    const tableBody = document.querySelector('#liste-des-joueurs');
    tableBody.innerHTML = ''; 

    players.forEach(player => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${player.nom}</td>
            <td>${player.prenom}</td>
            <td>${player.trainerId}</td>
            <td>${player.pts}</td>
            <td>${player.presence}</td>
            <td>${player.naissance}</td>
            <td>${player.sexe}</td>
            <td>${player.email}</td>
            <td>${player.ligue}</td>
            <td>
                <button class="delete-btn" data-id="${player.id}">Delete</button>
                <button class="modify-btn" data-id="${player.id}">Modify</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Attach event listeners to the buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const playerId = this.getAttribute('data-id');
            deleteLeaguePlayer(playerId, this); // Pass 'this' correctly as the button element
        });
    });

    const modifyButtons = document.querySelectorAll('.modify-btn');
    modifyButtons.forEach(button => {
        button.addEventListener('click', function() {
            modifyPlayer(this.getAttribute('data-id'));
        });
    });
}

// Define deletePlayer and modifyPlayer functions
async function deleteLeaguePlayer(playerId, buttonElement) {
    const { error } = await supabase
        .from('league_players')
        .delete()
        .match({ id: playerId });

    if (error) {
        console.error('Error deleting player', error);
        return;
    }

    // Find the closest table row to the button and remove it
    const row = buttonElement.closest('tr');
    if (row) {
        row.remove();
    } else {
        console.error('Could not find the table row to remove');
    }
}

function modifyPlayer(playerId) {
    // Logic to modify the player
    console.log('Modify player with ID:', playerId);
    // Here, you would typically populate a form with the player's data for editing.
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadPlayersList();

    const leaguePlayers = await fetchLeaguePlayer();
    const players = await fetchPlayers();
    console.log(leaguePlayers)
    console.log(players)
    updatePlayerTable(leaguePlayers);
});
