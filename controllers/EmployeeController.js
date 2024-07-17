// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const { Router } = require("express");
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
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

// POST create new employee
employeesController.post("/", async (request, response) => {
  try {
    const { first_name, last_name, email, phone, position } = request.body;
    const newEmployee = await createEmployee(first_name, last_name, email, phone, position);
    response.status(201).json({ message: "Employee created successfully", data: newEmployee });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

// PUT update employee
employeesController.put(
  "/:id",
  validateIdMiddleware,
  validateEmployeeExistsMiddleware,
  async (request, response) => {
    try {
      const { id } = request.params;
      const { first_name, last_name, email, phone, position } = request.body;
      const updatedEmployee = await updateEmployee(id, { first_name, last_name, email, phone, position });
      response.status(200).json({ message: "Employee updated successfully", data: updatedEmployee });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
);

// DELETE employee
employeesController.delete(
  "/:id",
  validateIdMiddleware,
  validateEmployeeExistsMiddleware,
  async (request, response) => {
    try {
      const { id } = request.params;
      const deletedEmployee = await deleteEmployee(id); // Retrieve deleted employee details
      response.status(200).json({ message: `Employee ${deletedEmployee.id} deleted successfully`, data: deletedEmployee });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  }
);



module.exports = employeesController;
