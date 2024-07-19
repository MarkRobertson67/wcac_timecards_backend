// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const db = require("../db/dbConfig");


// Get total hours worked by employee within a date range
const getTotalHoursWorkedByEmployee = async (employee_id, startDate, endDate) => {
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
            WHERE e.id = $1 AND t.work_date BETWEEN $2 AND $3
            GROUP BY e.id, e.first_name, e.last_name
            ORDER BY e.id
        `;
        const result = await db.any(query, [employee_id, startDate, endDate]);

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
                EXTRACT(EPOCH FROM (t.end_time - t.start_time)) / 3600 - 
                EXTRACT(EPOCH FROM (t.lunch_end - t.lunch_start)) / 3600 AS total_hours
            FROM timecards t
            WHERE t.employee_id = $1 AND t.work_date BETWEEN $2 AND $3
            ORDER BY t.work_date
        `;
        const result = await db.any(query, [employeeId, startDate, endDate]);

        return result.map(entry => {
            const totalHours = parseFloat(entry.total_hours);
            const hours = Math.floor(totalHours);
            const minutes = Math.round((totalHours - hours) * 60);

            return {
                timecard_id: entry.timecard_id,
                work_date: entry.work_date,
                start_time: entry.start_time,
                end_time: entry.end_time,
                lunch_start: entry.lunch_start,
                lunch_end: entry.lunch_end,
                total_hours: `${hours} hours ${minutes} minutes`
            };
        });
    } catch (error) {
        throw new Error(`Error retrieving timecards: ${error.message}`);
    }
};

// Get absenteeism report for employees within a date range
const getAbsenteeismReport = async (startDate, endDate) => {
    try {
        const query = `
            SELECT 
                e.id AS employee_id, 
                e.first_name, 
                e.last_name,
                COUNT(*) AS days_absent
            FROM employees e
            LEFT JOIN timecards t ON e.id = t.employee_id AND t.work_date BETWEEN $1 AND $2
            WHERE t.id IS NULL
            GROUP BY e.id, e.first_name, e.last_name
            ORDER BY e.id
        `;
        const result = await db.any(query, [startDate, endDate]);

        return result.map(employee => ({
            employee_id: employee.employee_id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            days_absent: employee.days_absent
        }));
    } catch (error) {
        throw new Error(`Error retrieving absenteeism report: ${error.message}`);
    }
};


// Get monthly summary report for all employees
const getMonthlySummaryReport = async (month, year) => {
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
            WHERE EXTRACT(MONTH FROM t.work_date) = $1 AND EXTRACT(YEAR FROM t.work_date) = $2
            GROUP BY e.id, e.first_name, e.last_name
            ORDER BY e.id
        `;
        const result = await db.any(query, [month, year]);

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
        throw new Error(`Error retrieving monthly summary report: ${error.message}`);
    }
};


// Get employee summary report for different time periods
const getEmployeeSummaryReport = async (employeeId, period) => {
    try {
        let query;
        let params;

        if (period === 'weekly') {
            query = `
                SELECT 
                    e.id AS employee_id,
                    e.first_name,
                    e.last_name,
                    DATE_TRUNC('week', t.work_date) AS week,
                    SUM(
                        EXTRACT(EPOCH FROM t.end_time - t.start_time) / 3600
                        - EXTRACT(EPOCH FROM t.lunch_end - t.lunch_start) / 3600
                    ) AS total_hours
                FROM employees e
                JOIN timecards t ON e.id = t.employee_id
                WHERE e.id = $1
                GROUP BY e.id, e.first_name, e.last_name, week
                ORDER BY week
            `;
            params = [employeeId];
        } else if (period === 'monthly') {
            query = `
                SELECT 
                    e.id AS employee_id,
                    e.first_name,
                    e.last_name,
                    DATE_TRUNC('month', t.work_date) AS month,
                    SUM(
                        EXTRACT(EPOCH FROM t.end_time - t.start_time) / 3600
                        - EXTRACT(EPOCH FROM t.lunch_end - t.lunch_start) / 3600
                    ) AS total_hours
                FROM employees e
                JOIN timecards t ON e.id = t.employee_id
                WHERE e.id = $1
                GROUP BY e.id, e.first_name, e.last_name, month
                ORDER BY month
            `;
            params = [employeeId];
        } else if (period === 'yearly') {
            query = `
                SELECT 
                    e.id AS employee_id,
                    e.first_name,
                    e.last_name,
                    DATE_TRUNC('year', t.work_date) AS year,
                    SUM(
                        EXTRACT(EPOCH FROM t.end_time - t.start_time) / 3600
                        - EXTRACT(EPOCH FROM t.lunch_end - t.lunch_start) / 3600
                    ) AS total_hours
                FROM employees e
                JOIN timecards t ON e.id = t.employee_id
                WHERE e.id = $1
                GROUP BY e.id, e.first_name, e.last_name, year
                ORDER BY year
            `;
            params = [employeeId];
        } else {
            throw new Error('Invalid period specified. Valid options are "weekly", "monthly", "yearly".');
        }

        const result = await db.any(query, params);

        return result.map(entry => {
            const totalHours = parseFloat(entry.total_hours);
            const hours = Math.floor(totalHours);
            const minutes = Math.round((totalHours - hours) * 60);

            return {
                employee_id: entry.employee_id,
                first_name: entry.first_name,
                last_name: entry.last_name,
                period: entry.week || entry.month || entry.year,
                total_hours: `${hours} hours ${minutes} minutes`
            };
        });
    } catch (error) {
        throw new Error(`Error retrieving employee summary report: ${error.message}`);
    }
};

module.exports = {
    getTotalHoursWorkedByEmployee,
    getDetailedTimecardsByEmployee,
    getAbsenteeismReport,
    getMonthlySummaryReport,
    getEmployeeSummaryReport
};



