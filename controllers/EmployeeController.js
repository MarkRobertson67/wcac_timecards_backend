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

const { isEmail, normalizeEmail } = require('validator');

const employeesController = Router();

// Validate and normalize email
const validateAndNormalizeEmail = (request, response, next) => {
  let { email } = request.body;
  if (email) {
    if (!isEmail(email)) {
      return response.status(400).json({ error: "Invalid email format." });
    }
    // Normalize the email if it's valid
    request.body.email = normalizeEmail(email, { all_lowercase: true });
  }
  next();
};

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
employeesController.post("/", validateAndNormalizeEmail, async (request, response) => {
  try {
    const { firebase_uid, first_name, last_name, email, phone, position } = request.body;

    // Call the createEmployee function with all required fields
    const newEmployee = await createEmployee(firebase_uid, first_name, last_name, email, phone, position);
    response.status(201).json({ message: "Employee created successfully", data: newEmployee });
  } catch (err) {
    console.error("Error creating employee:", err.message);
    response.status(500).json({ error: err.message });
  }
});


// PUT update employee
employeesController.put(
  "/:id",
  validateIdMiddleware,
  validateEmployeeExistsMiddleware,
  validateAndNormalizeEmail,
  async (request, response) => {
    try {
      const { id } = request.params;
      const { first_name, last_name, email, phone, position, paychex_id, is_admin } = request.body;
      const updatedEmployee = await updateEmployee(id, { first_name, last_name, email, phone, position, paychex_id, is_admin });
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
