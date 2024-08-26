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
        console.log(`Error retrieving all timecards: ${error.message}`)
        throw new Error(`Error retrieving all timecards. Please contact support.`);
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
            console.log(`Error retrieving timecard with ID ${id}: ${error.message}`)
        throw new Error(`Error retrieving timecard with ID ${id}. Please contact support.`);
    }
};

// // Create a new timecard
// const createTimecard = async (employee_id, work_date) => {
//     try {
//         const newTimecard = await db.one(
//             "INSERT INTO timecards (employee_id, work_date) VALUES ($1, $2) RETURNING *",
//             [employee_id, work_date]
//         );
//         console.log(`Successfully created new timecard for employee ${employee_id} on ${work_date}`);
//         return newTimecard;
//     } catch (error) {
//         console.error(`Error creating new timecard: ${error.message}`);  // Log the error message
//         throw new Error(`Error creating new timecard: ${error.message}`);
//     }
// };

// Create a new timecard with potential partial data
const createTimecard = async (employee_id, work_date, data) => {
    try {
        const keys = ['start_time', 'lunch_start', 'lunch_end', 'end_time', 'total_time'];
        const fields = keys.filter(key => key in data);
        const values = fields.map(field => data[field]);
        
        const fieldsSQL = fields.join(', ');
        const valuesPlaceholders = fields.map((_, index) => `$${index + 3}`).join(', ');

        const newTimecard = await db.one(
            `INSERT INTO timecards (employee_id, work_date, ${fieldsSQL})
             VALUES ($1, $2, ${valuesPlaceholders}) RETURNING *`,
            [employee_id, work_date, ...values]
        );

        console.log(`Successfully created new timecard for employee ${employee_id} on ${work_date}`);
        return newTimecard;
    } catch (error) {
        console.error(`Error creating new timecard: ${error.message}`);
        throw new Error(`Error creating new timecard. Please contact support.`);
    }
};

//Updating TimeCard
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
        console.error(`Error updating timecard with ID ${id} during status update: ${error.message}`); // Log the error message
        throw new Error(`Error updating timecard with ID ${id}. Please contact support.`);
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
        console.log(`Error deleting timecard with ID ${id}: ${error.message}`)
        throw new Error(`Error deleting timecard with ID ${id}. Please contact support.`);
    }
};

// Get all timecards for a specific employee
const getTimecardsByEmployeeId = async (employeeId) => {
    try {
        const timecards = await db.any("SELECT * FROM timecards WHERE employee_id = $1 ORDER BY work_date ASC", [employeeId]);
        //console.log(`Successfully retrieved timecards for employee with ID ${employeeId}`);
        return timecards;
    } catch (error) {
        console.log(`Error fetching timecards for employee with ID ${employeeId}: ${error.message}`)
        throw new Error(`Error fetching timecards for employee with ID ${employeeId}. Please contact support.`);
    }
};

// Get timecards for a specific employee between start and end dates
const getTimecardsByEmployeeAndDateRange = async (employeeId, startDate, endDate) => {
    try {
        const query = `
            SELECT * 
            FROM timecards 
            WHERE employee_id = $1 AND work_date BETWEEN $2 AND $3
            ORDER BY work_date ASC;
        `;
        const timecards = await db.any(query, [employeeId, startDate, endDate]);
        if (timecards.length > 0) {
            console.log(`Successfully retrieved ${timecards.length} timecards for employee ID ${employeeId} between ${startDate} and ${endDate}`);
            return timecards;
        } else {
            console.log(`No timecards found for employee ID ${employeeId} between ${startDate} and ${endDate}`);
            return []; // Return an empty array if no timecards are found
        }
    } catch (error) {
        console.error(`Error retrieving timecards for employee ID ${employeeId} between ${startDate} and ${endDate}: ${error.message}`);
        throw new Error(`Error retrieving timecards for employee ID ${employeeId} between ${startDate} and ${endDate}. Please contact support.`);
    }
};


module.exports = {
    getAllTimecards,
    getTimecardById,
    createTimecard,
    updateTimecard,
    deleteTimecard,
    getTimecardsByEmployeeId,
    getTimecardsByEmployeeAndDateRange,
};

