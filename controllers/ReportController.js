// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const { Router } = require("express");

const { 
  getTotalHoursWorkedByEmployee, 
  getDetailedTimecardsByEmployee, 
  getAbsenteeismReport, 
  getMonthlySummaryReport, 
  getEmployeeSummaryReport 
} = require("../queries/ReportQueries");

// Import middleware functions
const { validateDateRangeMiddleware } = require("../middleware");
  
  const reportsController = Router();


// // Get a simple static report
// reportsController.get('/', async (req, res) => {
//   try {
//     // Static data for testing
//     const reportData = {
//       message: 'Reports endpoint is working',
//       data: [
//         { employeeId: 1, totalHours: 40 },
//         { employeeId: 2, totalHours: 35 }
//       ]
//     };
//     res.status(200).json(reportData);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });



// Get total hours report by date range
reportsController.get(
    "/",
    // validateIdMiddleware, // Validate ID middleware (already imported)
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

  reportsController.get(
    "/:employeeId",
    validateDateRangeMiddleware,
    async (request, response) => {
      const { employeeId } = request.params;
      const { startDate, endDate } = request.query;
      console.log('Received:', { employeeId, startDate, endDate });
      try {
        const reportData = await getTotalHoursWorkedByEmployee(employeeId, startDate, endDate);
        response.status(200).json(reportData);
      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    }
  );
  

  // Get detailed timecards for an employee within a date range
reportsController.get(
  "/detailed/:employeeId",
  validateDateRangeMiddleware,
  async (request, response) => {
      const { employeeId } = request.params;
      const { startDate, endDate } = request.query;
      try {
          const reportData = await getDetailedTimecardsByEmployee(employeeId, startDate, endDate);
          response.status(200).json(reportData);
      } catch (error) {
          response.status(500).json({ error: error.message });
      }
  }
);


// Get absenteeism report within a date range
reportsController.get(
  "/absenteeism",
  validateDateRangeMiddleware,
  async (request, response) => {
      const { startDate, endDate } = request.query;
      try {
          const reportData = await getAbsenteeismReport(startDate, endDate);
          response.status(200).json(reportData);
      } catch (error) {
          response.status(500).json({ error: error.message });
      }
  }
);


// Get monthly summary report
reportsController.get(
  "/monthly-summary",
  async (request, response) => {
      const { month, year } = request.query;
      try {
          const reportData = await getMonthlySummaryReport(month, year);
          response.status(200).json(reportData);
      } catch (error) {
          response.status(500).json({ error: error.message });
      }
  }
);


// Get employee summary report by period
reportsController.get(
  "/employee-summary",
  async (request, response) => {
      const { employeeId, period } = request.query;
      try {
          const reportData = await getEmployeeSummaryReport(employeeId, period);
          response.status(200).json(reportData);
      } catch (error) {
          response.status(500).json({ error: error.message });
      }
  }
);

module.exports = reportsController;
