// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const db = require("../db/dbConfig");

// Get total hours worked by employee within a date range
const getTotalHoursWorkedByEmployeeByDateRange = async (employee_id, startDate, endDate) => {
    try {

        // If the employee_id is "ALL", delegate to the function handling all employees
        if (employee_id === 'ALL') {
            return getTotalHoursWorkedByAllEmployeesByDateRange(startDate, endDate);
        }

        const query = `
            SELECT 
                e.id AS employee_id, 
                e.first_name, 
                e.last_name, 
                SUM(EXTRACT(HOUR FROM t.total_time)) AS total_hours, 
                SUM(EXTRACT(MINUTE FROM t.total_time)) AS total_minutes
            FROM employees e
            JOIN timecards t ON e.id = t.employee_id
            WHERE e.id = $1 AND t.work_date BETWEEN $2 AND $3
            GROUP BY e.id, e.first_name, e.last_name
            ORDER BY e.id
        `;
        console.log(`Running query: ${query}`);
        console.log(`With params: employee_id = ${employee_id}, startDate = ${startDate}, endDate = ${endDate}`);

        const result = await db.any(query, [employee_id, startDate, endDate]);

        return result.map(employee => {
            const totalHours = parseInt(employee.total_hours, 10) || 0;
            const totalMinutes = parseInt(employee.total_minutes, 10) || 0;

            // Adjust minutes into hours
            const hours = totalHours + Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            return {
                employee_id: employee.employee_id,
                first_name: employee.first_name,
                last_name: employee.last_name,
                total_hours: { hours, minutes }
            };
        });
    } catch (error) {
        throw new Error(`Error retrieving total hours worked: ${error.message}`);
    }
};


// Get timecards for all employees between start and end dates
const getTotalHoursWorkedByAllEmployeesByDateRange = async (startDate, endDate) => {
    try {
        const query = `
        SELECT t.employee_id, e.first_name, e.last_name, 
               SUM(EXTRACT(HOUR FROM t.total_time)) AS total_hours, 
               SUM(EXTRACT(MINUTE FROM t.total_time)) AS total_minutes
        FROM timecards t
        JOIN employees e ON t.employee_id = e.id
        WHERE t.work_date BETWEEN $1 AND $2
        GROUP BY t.employee_id, e.first_name, e.last_name
        ORDER BY t.employee_id;
    `;
        const timecards = await db.any(query, [startDate, endDate]);

        return timecards.map(entry => {
            const totalHours = parseInt(entry.total_hours, 10) || 0;
            const totalMinutes = parseInt(entry.total_minutes, 10) || 0;

            // Adjust minutes into hours
            const hours = totalHours + Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            return {
                employee_id: entry.employee_id,
                first_name: entry.first_name,
                last_name: entry.last_name,
                total_hours: { hours, minutes }
            };
        });
    } catch (error) {
        console.error(`Error retrieving timecards for all employees between ${startDate} and ${endDate}: ${error.message}`);
        throw new Error('Error retrieving timecards for all employees. Please contact support.');
    }
};


// Get detailed timecard entries for an employee within a date range
const getDetailedTimecardsByEmployee = async (employeeId, startDate, endDate) => {
    try {
        const query = `
            SELECT 
                t.id AS timecard_id,
                t.work_date,
                t.start_time,
                t.end_time,
                t.lunch_start,
                t.lunch_end,
                EXTRACT(HOUR FROM t.total_time) AS total_hours, 
                EXTRACT(MINUTE FROM t.total_time) AS total_minutes
            FROM timecards t
            WHERE t.employee_id = $1 AND t.work_date BETWEEN $2 AND $3
            ORDER BY t.work_date
        `;
        const result = await db.any(query, [employeeId, startDate, endDate]);

        return result.map(entry => {
            const totalHours = parseInt(entry.total_hours, 10) || 0;
            const totalMinutes = parseInt(entry.total_minutes, 10) || 0;

            // Adjust minutes into hours
            const hours = totalHours + Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            return {
                timecard_id: entry.timecard_id,
                work_date: entry.work_date,
                start_time: entry.start_time,
                end_time: entry.end_time,
                lunch_start: entry.lunch_start,
                lunch_end: entry.lunch_end,
                total_hours: { hours, minutes }
            };
        });
    } catch (error) {
        throw new Error(`Error retrieving timecards: ${error.message}`);
    }
};



const getEmployeeSummaryById = async (employeeId, period, startDate, endDate) => {
    try {
        let query;
        let params;

        // If the employeeId is "ALL", delegate the request to the getEmployeeSummaryForAll function
        if (employeeId === 'ALL') {
            return getEmployeeSummaryForAll(period, startDate, endDate);
        }

        console.log(`Fetching employee summary for: ${employeeId}, Period: ${period}, Start: ${startDate}, End: ${endDate}`);

        const isAllEmployees = employeeId === 'ALL';

        if (period === 'weekly') {
            query = `
                SELECT 
                    e.id AS employee_id,
                    e.first_name,
                    e.last_name,
                    DATE_TRUNC('week', t.work_date) AS summary_period,
                    COUNT(t.id) AS days_worked,
                    SUM(EXTRACT(HOUR FROM t.total_time)) AS total_hours,
                    SUM(EXTRACT(MINUTE FROM t.total_time)) AS total_minutes,
                    5 - COUNT(t.id) AS absentee_days
                FROM employees e
                JOIN timecards t ON e.id = t.employee_id
                ${!isAllEmployees ? 'WHERE e.id = $1' : ''}
                AND t.work_date BETWEEN $2 AND $3
                GROUP BY e.id, e.first_name, e.last_name, summary_period
                ORDER BY summary_period;
            `;

            params = isAllEmployees ? [startDate, endDate] : [employeeId, startDate, endDate];

        } else if (period === 'monthly') {
            query = `
                SELECT 
                    e.id AS employee_id,
                    e.first_name,
                    e.last_name,
                    DATE_TRUNC('month', t.work_date) AS summary_period,
                    COUNT(t.id) AS days_worked,
                    SUM(EXTRACT(HOUR FROM t.total_time)) AS total_hours,
                    SUM(EXTRACT(MINUTE FROM t.total_time)) AS total_minutes,
                    20 - COUNT(t.id) AS absentee_days
                FROM employees e
                JOIN timecards t ON e.id = t.employee_id
                ${!isAllEmployees ? 'WHERE e.id = $1' : ''}
                AND t.work_date BETWEEN $2 AND $3
                GROUP BY e.id, e.first_name, e.last_name, summary_period
                ORDER BY summary_period;
            `;
            params = isAllEmployees ? [startDate, endDate] : [employeeId, startDate, endDate];

        } else if (period === 'yearly') {
            query = `
                SELECT 
                    e.id AS employee_id,
                    e.first_name,
                    e.last_name,
                    DATE_TRUNC('year', t.work_date) AS summary_period,
                    COUNT(t.id) AS days_worked,
                    SUM(EXTRACT(HOUR FROM t.total_time)) AS total_hours,
                    SUM(EXTRACT(MINUTE FROM t.total_time)) AS total_minutes,
                    240 - COUNT(t.id) AS absentee_days
                FROM employees e
                JOIN timecards t ON e.id = t.employee_id
                ${!isAllEmployees ? 'WHERE e.id = $1' : ''}
                AND t.work_date BETWEEN $2 AND $3
                GROUP BY e.id, e.first_name, e.last_name, summary_period
                ORDER BY summary_period;
            `;
            params = isAllEmployees ? [startDate, endDate] : [employeeId, startDate, endDate];

        } else {
            throw new Error("Invalid period specified");
        }

        const result = await db.any(query, params);
        console.log(result);

        // Adjust to return hours and minutes instead of decimal values
        return result.map(entry => {
            const totalHours = parseInt(entry.total_hours, 10) || 0;
            const totalMinutes = parseInt(entry.total_minutes, 10) || 0;

            // Adjust minutes into hours
            const adjustedHours = totalHours + Math.floor(totalMinutes / 60);
            const remainingMinutes = totalMinutes % 60;

            return {
                employee_id: entry.employee_id,
                first_name: entry.first_name,
                last_name: entry.last_name,
                summary_period: entry.summary_period,
                days_worked: entry.days_worked,
                absentee_days: entry.absentee_days,
                total_hours: {
                    hours: adjustedHours,
                    minutes: remainingMinutes
                }
            };
        });
    } catch (error) {
        console.error(`Error in getEmployeeSummaryReport: ${error.message}`);
        throw new Error(`Error retrieving employee summary report: ${error.message}`);
    }
};

const getEmployeeSummaryForAll = async (period, startDate, endDate) => {
    try {
        let query;
        let params;

        console.log(`Fetching employee summary for ALL employees, Period: ${period}, Start: ${startDate}, End: ${endDate}`);

        if (period === 'weekly') {
            query = `
                SELECT 
                    e.id AS employee_id,
                    e.first_name,
                    e.last_name,
                    DATE_TRUNC('week', t.work_date) AS summary_period,
                    COUNT(t.id) AS days_worked,
                    SUM(EXTRACT(HOUR FROM t.total_time)) AS total_hours,
                    SUM(EXTRACT(MINUTE FROM t.total_time)) AS total_minutes,
                    5 - COUNT(t.id) AS absentee_days
                FROM employees e
                JOIN timecards t ON e.id = t.employee_id
                AND t.work_date BETWEEN $1 AND $2
                GROUP BY e.id, e.first_name, e.last_name, summary_period
                ORDER BY summary_period;
            `;
            params = [startDate, endDate];
        } else if (period === 'monthly') {
            query = `
                SELECT 
                    e.id AS employee_id,
                    e.first_name,
                    e.last_name,
                    DATE_TRUNC('month', t.work_date) AS summary_period,
                    COUNT(t.id) AS days_worked,
                    SUM(EXTRACT(HOUR FROM t.total_time)) AS total_hours,
                    SUM(EXTRACT(MINUTE FROM t.total_time)) AS total_minutes,
                    20 - COUNT(t.id) AS absentee_days
                FROM employees e
                JOIN timecards t ON e.id = t.employee_id
                AND t.work_date BETWEEN $1 AND $2
                GROUP BY e.id, e.first_name, e.last_name, summary_period
                ORDER BY summary_period;
            `;
            params = [startDate, endDate];
        } else if (period === 'yearly') {
            query = `
                SELECT 
                    e.id AS employee_id,
                    e.first_name,
                    e.last_name,
                    DATE_TRUNC('year', t.work_date) AS summary_period,
                    COUNT(t.id) AS days_worked,
                    SUM(EXTRACT(HOUR FROM t.total_time)) AS total_hours,
                    SUM(EXTRACT(MINUTE FROM t.total_time)) AS total_minutes,
                    240 - COUNT(t.id) AS absentee_days
                FROM employees e
                JOIN timecards t ON e.id = t.employee_id
                AND t.work_date BETWEEN $1 AND $2
                GROUP BY e.id, e.first_name, e.last_name, summary_period
                ORDER BY summary_period;
            `;
            params = [startDate, endDate];
        } else {
            throw new Error("Invalid period specified");
        }

        const result = await db.any(query, params);
        console.log(result);

        return result.map(entry => {
            const totalHours = parseInt(entry.total_hours, 10) || 0;
            const totalMinutes = parseInt(entry.total_minutes, 10) || 0;

            const adjustedHours = totalHours + Math.floor(totalMinutes / 60);
            const remainingMinutes = totalMinutes % 60;

            return {
                employee_id: entry.employee_id,
                first_name: entry.first_name,
                last_name: entry.last_name,
                summary_period: entry.summary_period,
                days_worked: entry.days_worked,
                absentee_days: entry.absentee_days,
                total_hours: {
                    hours: adjustedHours,
                    minutes: remainingMinutes
                }
            };
        });
    } catch (error) {
        console.error(`Error in getEmployeeSummaryForAll: ${error.message}`);
        throw new Error(`Error retrieving employee summary report for all employees: ${error.message}`);
    }
};

module.exports = {
    getTotalHoursWorkedByEmployeeByDateRange,
    getTotalHoursWorkedByAllEmployeesByDateRange,
    getDetailedTimecardsByEmployee,
    getEmployeeSummaryById,
    getEmployeeSummaryForAll
};
