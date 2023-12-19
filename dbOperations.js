// dbOperations.js

// Import the initialized Supabase client
import supabase from "./supabaseConfig.js";

/**
 * Checks if a player with the given ID exists in a specified table.
 * @param {string} playerId - The ID of the player to check.
 * @param {string} tableName - The name of the table to check in.
 * @returns {Promise<boolean>} - True if the player exists, false otherwise.
 */
export async function doesPlayerExist(playerId, tableName) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('id')
            .eq('trainerId', playerId);

        if (error) throw error;

        return data.length > 0;
    } catch (error) {
        console.error(`Error checking player existence in ${tableName}:`, error);
        return false;
    }
}

/**
 * Adds a new player to a specified table.
 * @param {Object} playerData - The data of the player to add.
 * @param {string} tableName - The name of the table to add to.
 * @returns {Promise<Object>} - The added player data, or null if an error occurred.
 */
export async function addPlayer(playerData, tableName) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .insert([playerData]);

        if (error) throw error;

        console.log(`Added player to ${tableName}:`, data);
        return data;
    } catch (error) {
        console.error(`Error inserting data into ${tableName}:`, error);
        return null;
    }
}

/**
 * Fetches players from a specified table.
 * @param {string} tableName - The name of the table to fetch from.
 * @returns {Promise<Array>} - An array of player data, or an empty array if an error occurred.
 */
export async function fetchPlayers(tableName) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*');

        if (error) throw error;

        return data;
    } catch (error) {
        console.error(`Error fetching data from ${tableName}:`, error);
        return [];
    }
}

/**
 * Deletes a player from a specified table.
 * @param {string} playerId - The ID of the player to delete.
 * @param {string} tableName - The name of the table to delete from.
 */
export async function deletePlayer(playerId, tableName) {
    const { error } = await supabase
        .from(tableName)
        .delete()
        .match({ id: playerId });

    if (error) {
        throw error;
    }
}

