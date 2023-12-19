// main.js

// Import necessary functions from other modules
import * as DB from '../dbOperations.js';
import * as Utils from '../playerUtils.js';

// Load and display initial player data on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadPlayersList();
        const leaguePlayers = await DB.fetchPlayers('league_players');
        Utils.updatePlayerTable(leaguePlayers);
    } catch (error) {
        console.error('Error during initial data load:', error);
    }
});

// Load players list for autocomplete suggestions
let playersList = [];
async function loadPlayersList() {
    playersList = await DB.fetchPlayers('players');
}

// Handle form submission for adding a player
document.getElementById('form-group').addEventListener('submit', async function(e) {
    e.preventDefault();

    const playerData = gatherFormData();

    // Check if the player exists in the respective tables
    const playerExistsInPlayers = await DB.doesPlayerExist(playerData.trainerId, 'players');
    const playerExistsInLeague = await DB.doesPlayerExist(playerData.trainerId, 'league_players');

    if (!playerExistsInPlayers) {
        await DB.addPlayer(playerData, 'players');
    }

    if (!playerExistsInLeague) {
        await DB.addPlayer(playerData, 'league_players');
        Utils.updatePlayerTable(await DB.fetchPlayers('league_players'));
    } else {
        console.error('Player already exists in the league_players table');
    }

    clearForm();
});

// Gather form data into an object
function gatherFormData() {
    return {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        naissance: document.getElementById('naissance').value,
        sexe: document.getElementById('sexe').value,
        email: document.getElementById('email').value,
        ligue: document.getElementById('ligue').value,
        trainerId: document.getElementById('id').value,
    };
}

// Clear form input fields
function clearForm() {
    document.getElementById('nom').value = '';
    document.getElementById('prenom').value = '';
    document.getElementById('naissance').value = '';
    document.getElementById('sexe').value = '';
    document.getElementById('email').value = '';
    document.getElementById('ligue').value = '';
    document.getElementById('id').value = '';

    // Also clear any displayed suggestions or error messages
    document.getElementById('suggestions').style.display = 'none';
    // Reset any error messages or status displays if you have them
}
document.getElementById('clear-button').addEventListener('click', function() {
    clearForm();
});
// Handle input event for autocomplete suggestions
document.getElementById('nom').addEventListener('input', function () {
    const suggestions = Utils.filterSuggestions(this.value, playersList);
    displaySuggestions(suggestions);
});

// Display autocomplete suggestions
function displaySuggestions(suggestions) {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = '';
    suggestions.forEach(player => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = `${player.nom} ${player.prenom}`;
        suggestionItem.addEventListener('click', () => {
            Utils.populatePlayerData(player);
            suggestionsDiv.style.display = 'none';
        });
        suggestionsDiv.appendChild(suggestionItem);
    });
    suggestionsDiv.style.display = suggestions.length > 0 ? 'block' : 'none';
}

// More event listeners and logic can be added as needed
