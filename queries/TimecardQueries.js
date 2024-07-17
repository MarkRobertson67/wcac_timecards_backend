// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const db = require("../db/dbConfig");

// Get all timecards
const getAllTimecards = async () => {
    try {
        return await db.any("SELECT * FROM timecards ORDER BY id ASC");
    } catch (error) {
        throw new Error(`Error retrieving all timecards: ${error.message}`);
    }
};

// Get timecard by ID
const getTimecardById = async (id) => {
    try {
        return await db.oneOrNone("SELECT * FROM timecards WHERE id = $1", [id]);
    } catch (error) {
        throw new Error(`Error retrieving timecard with ID ${id}: ${error.message}`);
    }
};

// Create a new timecard
const createTimecard = async (employee_id, work_date, start_time, lunch_start, lunch_end, end_time, total_time) => {
    try {
        const newTimecard = await db.one(
            "INSERT INTO timecards (employee_id, work_date, start_time, lunch_start, lunch_end, end_time, total_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [employee_id, work_date, start_time, lunch_start, lunch_end, end_time, total_time]
        );
        return newTimecard;
    } catch (error) {
        throw new Error(`Error creating new timecard: ${error.message}`);
    }
};


// Delete a timecard by ID
const deleteTimecard = async (id) => {
    try {
        const deletedTimecard = await db.one(
            "DELETE FROM timecards WHERE id = $1 RETURNING *",
            [id]
        );
        return deletedTimecard;
    } catch (error) {
        throw new Error(`Error deleting timecard with ID ${id}: ${error.message}`);
    }
};

// Get all timecards for a specific employee
const getTimecardsByEmployeeId = async (employeeId) => {
    try {
        return await db.any("SELECT * FROM timecards WHERE employee_id = $1 ORDER BY work_date ASC", [employeeId]);
    } catch (error) {
        throw new Error(`Error fetching timecards for employee with ID ${employeeId}: ${error.message}`);
    }
};


module.exports = {
    getAllTimecards,
    getTimecardById,
    createTimecard,
    deleteTimecard,
    getTimecardsByEmployeeId,
};
