// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const db = require("../db/dbConfig");

// Get total hours worked by employee within a date range
const getTotalHoursWorkedByEmployee = async (startDate, endDate) => {
    try {
        const query = `
            SELECT 
                e.id AS employee_id, 
                e.first_name, 
                e.last_name, 
                SUM(
                    EXTRACT(EPOCH FROM t.end_time - t.start_time) / 3600
                    - EXTRACT(EPOCH FROM t.lunch_end - t.lunch_start) / 3600
                ) AS total_hours
            FROM employees e
            JOIN timecards t ON e.id = t.employee_id
            WHERE t.work_date BETWEEN $1 AND $2
            GROUP BY e.id, e.first_name, e.last_name
            ORDER BY e.id
        `;
        const result = await db.any(query, [startDate, endDate]);

        // console.log(result); // Log the raw result

        return result.map(employee => {
            const totalHours = parseFloat(employee.total_hours);
            if (isNaN(totalHours)) {
                console.error(`Invalid total_hours value for employee ${employee.employee_id}: ${employee.total_hours}`);
                return {
                    employee_id: employee.employee_id,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    total_hours: "Invalid data"
                };
            }

            const hours = Math.floor(totalHours);
            const minutes = Math.round((totalHours - hours) * 60);

            return {
                employee_id: employee.employee_id,
                first_name: employee.first_name,
                last_name: employee.last_name,
                total_hours: `${hours} hours ${minutes} minutes`
            };
        });
    } catch (error) {
        throw new Error(`Error retrieving total hours worked: ${error.message}`);
    }
};

module.exports = {
    getTotalHoursWorkedByEmployee
};

