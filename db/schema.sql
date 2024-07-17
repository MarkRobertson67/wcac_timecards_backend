-- Proprietary Software License
-- Copyright (c) 2024 Mark Robertson
-- See LICENSE.txt file for details.

--  Drop tables if they exist
DROP TABLE IF EXISTS timecards;
DROP TABLE IF EXISTS employees;

-- Create employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(50)
);

-- Create times_worked table
CREATE TABLE timecards (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    start_time TIME,
    lunch_start TIME,
    lunch_end TIME,
    end_time TIME,
    total_time INTERVAL,
    CONSTRAINT unique_employee_date UNIQUE (employee_id, work_date) -- So can't add duplicate times for same day
);

-- Create indexes to speed up the database access
CREATE INDEX idx_employee_id ON timecards(employee_id);
CREATE INDEX idx_work_date ON timecards(work_date);
