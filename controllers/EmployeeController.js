// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const { Router } = require("express");
const {
  getAllEmployees,
  getEmployeeById,
} = require("../queries/EmployeeQueries");

// Import middleware functions
const {
  validateIdMiddleware,
  validateEmployeeExistsMiddleware
} = require("../middleware");

const employeesController = Router();

// GET all employees
employeesController.get("/", async (request, response) => {
  try {
    const employees = await getAllEmployees();
    response.status(200).json({ data: employees });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

// Get employee by ID
employeesController.get(
  "/:id",
  validateIdMiddleware,
  validateEmployeeExistsMiddleware,
  async (request, response) => {
    try {
      const { id } = request.params;
      const employee = await getEmployeeById(id);
      response.status(200).json({ data: employee });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },
);

module.exports = employeesController;
