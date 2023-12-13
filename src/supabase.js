import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://cnrdhnfpkohxdxrybign.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNucmRobmZwa29oeGR4cnliaWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI0MDY3OTcsImV4cCI6MjAxNzk4Mjc5N30.f3DTvL-u7CqV_uJHM_ecbXNJm6z3Uo0T--KvpTDTV1k'; // This should be your anon/public key, not the service role key or password

const supabase = createClient(supabaseUrl, supabaseKey);
// Example function to add a player
async function addPlayer(playerData) {
    const { data, error } = await supabase
        .from('players')
        .insert([playerData]);

    if (error) {
        console.error('Error inserting data', error);
        return;
    }

    console.log('Added player', data);
    const players = await fetchPlayers();
    updatePlayerTable(players);
}

// Add event listener to your form
document.getElementById('form-group').addEventListener('submit', function(e) {
    e.preventDefault();

    const playerData = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        naissance: document.getElementById('naissance').value,
        sexe: document.getElementById('sexe').value,
        email: document.getElementById('email').value,
        ligue: document.getElementById('ligue').value,
        trainerId: document.getElementById('id').value,
        
        
    };

    addPlayer(playerData);
});
console.log(supabase)
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
function updatePlayerTable(players) {
    const tableBody = document.querySelector('#liste-des-joueurs');
    console.log(tableBody); 
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
            deletePlayer(playerId, this); // Pass 'this' correctly as the button element
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
async function deletePlayer(playerId, buttonElement) {
    const { error } = await supabase
        .from('players')
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
    const players = await fetchPlayers();
    updatePlayerTable(players);
});