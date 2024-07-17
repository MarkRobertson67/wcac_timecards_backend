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



module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
};