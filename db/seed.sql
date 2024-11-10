-- Proprietary Software License
-- Copyright (c) 2024 Mark Robertson
-- See LICENSE.txt file for details.

-- Insert employees
INSERT INTO employees (paychex_id, first_name, last_name, email, phone, position, is_admin) VALUES
('501', 'Beth', 'Doe', 'beth.doe@example.com', '732-555-1234', 'Office Manager', true),
('502', 'Jane', 'Smith', 'jane.smith@example.com', '732-555-5678', 'Nurse', false),
('503', 'Bob', 'Johnson', 'bob.johnson@example.com', '908-555-9101', 'Entertainment Director', false);



-- Insert timecards for Beth Doe (Office Manager)
INSERT INTO timecards (employee_id, work_date, facility_start_time, facility_lunch_start, facility_lunch_end, facility_end_time, facility_total_hours, status) VALUES
(1, '2024-10-01', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-02', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-03', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-04', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-07', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-08', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-09', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-10', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-11', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-14', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-15', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-16', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-17', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-18', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-21', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-22', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-23', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-24', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-25', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-28', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-29', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-30', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-10-31', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted'),
(1, '2024-11-01', '09:00', '12:00', '12:30', '17:00', '07:30', 'submitted');



-- Insert timecards for Jane Smith (Driver and Domestic)
INSERT INTO timecards (employee_id, work_date, driving_start_time, driving_lunch_start, driving_lunch_end, driving_end_time, driving_total_hours, facility_start_time, facility_lunch_start, facility_lunch_end, facility_end_time, facility_total_hours, status) VALUES
(2, '2024-10-01', '07:00', '10:00', '10:30', '15:00', '07:00', NULL, NULL, NULL, NULL, NULL, 'submitted'), -- Tue (Driving only)
(2, '2024-10-02', NULL, NULL, NULL, NULL, NULL, '08:00', '12:00', '12:30', '16:00', '08:00', 'submitted'), -- Wed (Facility only)
(2, '2024-10-03', '07:30', '11:00', '11:30', '13:00', '05:30', '13:30', '14:00', '14:30', '17:00', '03:30', 'submitted'), -- Thu (Mixed driving and facility)
(2, '2024-10-04', '07:00', '10:00', '10:30', '15:00', '07:00', NULL, NULL, NULL, NULL, NULL, 'submitted'), -- Fri (Driving only)
(2, '2024-10-07', NULL, NULL, NULL, NULL, NULL, '08:00', '12:00', '12:30', '16:00', '08:00', 'submitted'), -- Mon (Facility only)
(2, '2024-10-08', '07:00', '10:00', '10:30', '14:00', '07:00', NULL, NULL, NULL, NULL, NULL, 'submitted'), -- Tue (Driving only)
(2, '2024-10-09', NULL, NULL, NULL, NULL, NULL, '08:30', '12:00', '12:30', '15:30', '07:00', 'submitted'), -- Wed (Facility only)
(2, '2024-10-10', '08:00', '12:00', '12:30', '16:00', '08:00', NULL, NULL, NULL, NULL, NULL, 'submitted'), -- Thu (Driving only)
(2, '2024-10-11', '07:00', '11:00', '11:30', '13:00', '06:00', '13:30', '14:00', '14:30', '17:00', '03:30', 'submitted'), -- Fri (Mixed)
(2, '2024-10-14', '07:00', '10:00', '10:30', '15:00', '07:00', NULL, NULL, NULL, NULL, NULL, 'submitted'), -- Mon (Driving only)
(2, '2024-10-15', NULL, NULL, NULL, NULL, NULL, '08:00', '12:00', '12:30', '16:00', '08:00', 'submitted'), -- Tue (Facility only)
(2, '2024-10-16', '07:30', '11:00', '11:30', '13:00', '05:30', '13:30', '14:00', '14:30', '17:00', '03:30', 'submitted'), -- Wed (Mixed)
(2, '2024-10-17', '07:00', '10:00', '10:30', '15:00', '07:00', NULL, NULL, NULL, NULL, NULL, 'submitted'), -- Thu (Driving only)
(2, '2024-10-18', NULL, NULL, NULL, NULL, NULL, '08:00', '12:00', '12:30', '16:00', '08:00', 'submitted'), -- Fri (Facility only)
(2, '2024-10-21', '07:00', '10:00', '10:30', '15:00', '07:00', NULL, NULL, NULL, NULL, NULL, 'submitted'), -- Mon (Driving only)
(2, '2024-10-22', '07:00', '10:00', '10:30', '14:00', '07:00', NULL, NULL, NULL, NULL, NULL, 'submitted'), -- Tue (Driving only)
(2, '2024-10-23', '07:30', '11:00', '11:30', '13:00', '05:30', '13:30', '14:00', '14:30', '17:00', '03:30', 'submitted'), -- Wed (Mixed)
(2, '2024-10-24', '08:00', '12:00', '12:30', '16:00', '08:00', NULL, NULL, NULL, NULL, NULL, 'submitted'), -- Thu (Driving only)
(2, '2024-10-25', NULL, NULL, NULL, NULL, NULL, '08:00', '12:00', '12:30', '16:00', '08:00', 'submitted'), -- Fri (Facility only)
(2, '2024-10-28', '07:00', '10:00', '10:30', '15:00', '07:00', NULL, NULL, NULL, NULL, NULL, 'submitted'), -- Mon (Driving only)
(2, '2024-10-29', '07:00', '10:00', '10:30', '14:00', '07:00', NULL, NULL, NULL, NULL, NULL, 'submitted'), -- Tue (Driving only)
(2, '2024-10-30', '07:30', '11:00', '11:30', '13:00', '05:30', '13:30', '14:00', '14:30', '17:00', '03:30', 'submitted'), -- Wed (Mixed)
(2, '2024-10-31', '08:00', '12:00', '12:30', '16:00', '08:00', NULL, NULL, NULL, NULL, NULL, 'submitted'), -- Thu (Driving only)
(2, '2024-11-01', NULL, NULL, NULL, NULL, NULL, '08:00', '12:00', '12:30', '16:00', '08:00', 'submitted'); -- Fri (Facility only)



-- Insert timecards for Bob Johnson (Entertainment Director)
INSERT INTO timecards (employee_id, work_date, facility_start_time, facility_lunch_start, facility_lunch_end, facility_end_time, facility_total_hours, status) VALUES
(3, '2024-10-01', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-02', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-03', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-04', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-07', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-08', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-09', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-10', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-11', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-14', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-15', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-16', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-17', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-18', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-21', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-22', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-23', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-24', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-25', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-28', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-29', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-30', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-10-31', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted'),
(3, '2024-11-01', '09:00', '12:00', '12:30', '18:00', '08:30', 'submitted');
