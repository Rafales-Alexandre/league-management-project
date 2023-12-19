// playerUtils.js
import * as DB from './dbOperations.js';  // Adjust the path if necessary

/**
 * Updates the HTML table with player data.
 * @param {Array} players - An array of player objects to display in the table.
 */
export function updatePlayerTable(players) {
    const tableBody = document.querySelector('#liste-des-joueurs');
    tableBody.innerHTML = ''; 

    players.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.nom}</td>
            <td>${player.prenom}</td>
            <td>${player.trainerId}</td>
            <td>${player.pts ?? ''}</td>
            <td>${player.presence ?? ''}</td>
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

    attachButtonListeners();
}

/**
 * Attaches event listeners to delete and modify buttons in the player table.
 */
function attachButtonListeners() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const playerId = this.getAttribute('data-id');
            await deletePlayer(playerId);
        });
    });

    const modifyButtons = document.querySelectorAll('.modify-btn');
    modifyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Implement modify functionality here
        });
    });
}
/**
 * Deletes a player from the database and updates the table.
 * @param {string} playerId - The ID of the player to delete.
 */
async function deletePlayer(playerId) {
    try {
        await DB.deletePlayer(playerId, 'league_players'); // Assuming 'league_players' is your table name
        const updatedPlayers = await DB.fetchPlayers('league_players');
        updatePlayerTable(updatedPlayers);
    } catch (error) {
        console.error('Error deleting player:', error);
    }
}
/**
 * Filters players based on a given input string.
 * @param {string} input - The input string to filter the players by.
 * @param {Array} playersList - The list of players to filter.
 * @returns {Array} - An array of players that match the input string.
 */
export function filterSuggestions(input, playersList) {
    return playersList.filter(player => {
        const fullName = `${player.nom} ${player.prenom}`;
        return fullName.toLowerCase().includes(input.toLowerCase());
    });
}

/**
 * Populates the input fields with the selected player's data.
 * @param {Object} player - The player object whose data is to be populated.
 */
export function populatePlayerData(player) {
    document.getElementById('nom').value = player.nom;
    document.getElementById('prenom').value = player.prenom;
    document.getElementById('naissance').value = player.naissance || '';
    document.getElementById('sexe').value = player.sexe;
    document.getElementById('email').value = player.email;
    document.getElementById('ligue').value = player.ligue;
    document.getElementById('id').value = player.trainerId;
}

// You can add more utility functions as needed.

