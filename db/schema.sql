-- Proprietary Software License
-- Copyright (c) 2024 Mark Robertson
-- See LICENSE.txt file for details.

--  Drop tables if they exist
DROP TABLE IF EXISTS timecards;
DROP TABLE IF EXISTS employees;


-- Create the enum type for role
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
        CREATE TYPE role_enum AS ENUM ('Employee', 'Admin');
    END IF;
END $$;


-- Create employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(50),
    role role_enum NOT NULL DEFAULT 'Employee'  -- Limit role values
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
    status VARCHAR(20) DEFAULT 'active', -- ('active', 'submitted')
    CONSTRAINT unique_employee_work_date UNIQUE (employee_id, work_date) -- Unique constraint
);


-- Create indexes to speed up the database access
CREATE INDEX idx_employee_id ON timecards(employee_id);
CREATE INDEX idx_work_date ON timecards(work_date);
CREATE INDEX idx_employee_work_date ON timecards(employee_id, work_date);
CREATE INDEX idx_status ON timecards(status);
CREATE INDEX idx_role ON employees(role);

