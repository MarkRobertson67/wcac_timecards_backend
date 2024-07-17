// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const db = require("../db/dbConfig");

// Get total hours worked by each employee for a given period
const getTotalHoursWorkedByEmployee = async (startDate, endDate) => {
    try {
        return await db.any(
            `SELECT 
                e.id AS employee_id, 
                e.first_name, 
                e.last_name, 
                SUM(EXTRACT(EPOCH FROM total_time) / 3600) AS total_hours 
             FROM 
                timecards t
             JOIN 
                employees e ON t.employee_id = e.id
             WHERE 
                work_date BETWEEN $1 AND $2
             GROUP BY 
                e.id, e.first_name, e.last_name
             ORDER BY 
                e.last_name ASC, e.first_name ASC`,
            [startDate, endDate]
        );
    } catch (error) {
        throw new Error(`Error retrieving total hours worked by employees: ${error.message}`);
    }
};

module.exports = {
    getTotalHoursWorkedByEmployee,
};
