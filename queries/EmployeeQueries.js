// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const db = require("../db/dbConfig");

const getAllEmployees = async () => {
  return db.any("SELECT * FROM employees ORDER BY id ASC");
};


// Get employee by ID
const getEmployeeById = async (id) => {
  return db.oneOrNone("SELECT * FROM employees WHERE id = $1", [id]);
};

// Create a new employee
const createEmployee = async (first_name, last_name, email, phone, position) => {
  try {
      const newEmployee = await db.one(
          "INSERT INTO employees (first_name, last_name, email, phone, position) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [first_name, last_name, email, phone, position]
      );
      return newEmployee;
  } catch (error) {
      throw new Error(`Error creating new employee: ${error.message}`);
  }
};

// Update an employee by ID
const updateEmployee = async (id, { first_name, last_name, email, phone, position }) => {
  try {
    const updatedEmployee = await db.oneOrNone(
      "UPDATE employees SET first_name = $1, last_name = $2, email = $3, phone = $4, position = $5 WHERE id = $6 RETURNING *",
      [first_name, last_name, email, phone, position, id]
    );
    if (!updatedEmployee) {
      throw new Error(`Employee with ID ${id} not found.`);
    }
    return updatedEmployee;
  } catch (error) {
    throw new Error(`Error updating employee: ${error.message}`);
  }
};

// Delete an employee by ID
const deleteEmployee = async (id) => {
  try {
    const deletedEmployee = await db.one(
      "DELETE FROM employees WHERE id = $1 RETURNING *",
      [id]
    );
    if (!deletedEmployee) {
      throw new Error(`Employee with ID ${id} not found.`);
    }
    return deletedEmployee;
  } catch (error) {
    throw new Error(`Error deleting employee: ${error.message}`);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

