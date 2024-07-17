// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const { Router } = require("express");

const { getTotalHoursWorkedByEmployee } = require("../queries/ReportQueries");
const { validateIdMiddleware } = require("../middleware");
const { validateDateRangeMiddleware } = require("../middleware");

// Import middleware functions
const {
    validateIdMiddleware,
  } = require("../middleware");
  
  const reportsController = Router();

// Get total hours report by date range
reportsController.get(
    "/",
    validateIdMiddleware, // Validate ID middleware (already imported)
    validateDateRangeMiddleware, // New date range validation middleware
    async (request, response) => {
      const { startDate, endDate } = request.query;
      try {
        const reportData = await getTotalHoursWorkedByEmployee(startDate, endDate);
        response.status(200).json(reportData);
      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    }
  );


module.exports = reportsController;
