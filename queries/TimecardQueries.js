// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const db = require("../db/dbConfig");

// Get all timecards
const getAllTimecards = async () => {
    try {
        const timecards = await db.any("SELECT * FROM timecards ORDER BY id ASC");
        console.log("Successfully retrieved all timecards");
        return timecards;
    } catch (error) {
        throw new Error(`Error retrieving all timecards: ${error.message}`);
    }
};

// Get timecard by ID
const getTimecardById = async (id) => {
    try {
        const timecard = await db.oneOrNone("SELECT * FROM timecards WHERE id = $1", [id]);
        if (timecard) {
            console.log(`Successfully retrieved timecard with ID ${id}`);
        } else {
            console.log(`No timecard found with ID ${id}`);
        }
        return timecard;
    } catch (error) {
        throw new Error(`Error retrieving timecard with ID ${id}: ${error.message}`);
    }
};

// Create a new timecard
const createTimecard = async (employee_id, work_date) => {
    try {
        const newTimecard = await db.one(
            "INSERT INTO timecards (employee_id, work_date) VALUES ($1, $2) RETURNING *",
            [employee_id, work_date]
        );
        console.log(`Successfully created new timecard for employee ${employee_id} on ${work_date}`);
        return newTimecard;
    } catch (error) {
        console.error(`Error creating new timecard: ${error.message}`);  // Log the error message
        throw new Error(`Error creating new timecard: ${error.message}`);
    }
};

const updateTimecard = async (id, fieldsToUpdate) => {
    try {
        const setClause = Object.keys(fieldsToUpdate)
            .map((field, index) => `${field} = $${index + 2}`)
            .join(", ");
        const values = [id, ...Object.values(fieldsToUpdate)];
        
        const query = `UPDATE timecards SET ${setClause} WHERE id = $1 RETURNING *`;

        const updatedTimecard = await db.one(query, values);
        console.log(`Successfully updated timecard with ID ${id}`);
        return updatedTimecard;
    } catch (error) {
        console.error(`Error updating timecard with ID ${id}: ${error.message}`); // Log the error message
        throw new Error(`Error updating timecard with ID ${id}: ${error.message}`);
    }
};


// Delete a timecard by ID
const deleteTimecard = async (id) => {
    try {
        const deletedTimecard = await db.one(
            "DELETE FROM timecards WHERE id = $1 RETURNING *",
            [id]
        );
        console.log(`Successfully deleted timecard with ID ${id}`);
        return deletedTimecard;
    } catch (error) {
        throw new Error(`Error deleting timecard with ID ${id}: ${error.message}`);
    }
};

// Get all timecards for a specific employee
const getTimecardsByEmployeeId = async (employeeId) => {
    try {
        const timecards = await db.any("SELECT * FROM timecards WHERE employee_id = $1 ORDER BY work_date ASC", [employeeId]);
        //console.log(`Successfully retrieved timecards for employee with ID ${employeeId}`);
        return timecards;
    } catch (error) {
        throw new Error(`Error fetching timecards for employee with ID ${employeeId}: ${error.message}`);
    }
};

module.exports = {
    getAllTimecards,
    getTimecardById,
    createTimecard,
    updateTimecard,
    deleteTimecard,
    getTimecardsByEmployeeId,
};

