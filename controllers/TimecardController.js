// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const { Router } = require("express");
const {
    getAllTimecards,
    getTimecardById,
    createTimecard,
    updateTimecard,
    deleteTimecard,
    getTimecardsByEmployeeId,
    getTimecardsByEmployeeAndDateRange,
} = require("../queries/TimecardQueries");

// Import middleware functions
const {
  validateIdMiddleware,
  validateTimecardExistsMiddleware,
} = require("../middleware");

const timecardsController = Router();

// GET all timecards
timecardsController.get("/", async (request, response) => {
  try {
    const timecards = await getAllTimecards();
    response.status(200).json({ data: timecards });
  } catch (err) {
    console.error(`Error in GET /timecards: ${err.message}`);
    response.status(500).json({ error: "Internal server error while getting all Timecards. Please contact support." });
  }
});

// Get timecard by ID
timecardsController.get(
  "/:id",
  validateIdMiddleware,
  validateTimecardExistsMiddleware,
  async (request, response) => {
    try {
      const { id } = request.params;
      const timecard = await getTimecardById(id);
      response.status(200).json({ data: timecard });
    } catch (err) {
      console.error(`Error in GET /timecards: ${err.message}`);
      response.status(500).json({ error: "Internal server error while getting Timecard by ID. Please contact support." });
    }
  }
);

// Create new timecard
timecardsController.post("/", async (request, response) => {
  try {
    const { employee_id, work_date } = request.body;

    if (!employee_id || !work_date) {
      return response.status(400).json({
        error: 'Missing required fields',
        fields: { employee_id, work_date }
      });
    }

    const newTimecard = await createTimecard(employee_id, work_date, request.body);

    // Log success message
    console.log(`Successfully created timecard for employee ${employee_id} on ${work_date}`);
    
    response.status(201).json({ data: newTimecard });
  } catch (err) {
    console.error(`Error in POST /timecards: ${err.message}`);
    response.status(500).json({ error: "Internal server error while Creating New Timecard. Please contact support." });
  }
});

// Update timecard
timecardsController.put(
  "/:id",
  validateIdMiddleware,
  validateTimecardExistsMiddleware,
  async (request, response) => {
    try {
      const { id } = request.params;
      const { start_time, lunch_start, lunch_end, end_time, total_time } = request.body;

      // Validate fields to ensure they exist before attempting to update
      const fieldsToUpdate = {};
      if (start_time !== undefined) fieldsToUpdate.start_time = start_time;
      if (lunch_start !== undefined) fieldsToUpdate.lunch_start = lunch_start;
      if (lunch_end !== undefined) fieldsToUpdate.lunch_end = lunch_end;
      if (end_time !== undefined) fieldsToUpdate.end_time = end_time;
      if (total_time !== undefined) fieldsToUpdate.total_time = total_time;

      if (Object.keys(fieldsToUpdate).length === 0) {
        console.log("No valid fields provided for update");
        return response.status(400).json({ error: 'No valid fields provided for update' });
      }

      const updatedTimecard = await updateTimecard(id, fieldsToUpdate);
      console.log(`Successfully updated timecard with ID ${id}`);
      response.status(200).json({ data: updatedTimecard });
    } catch (err) {
      console.log(`Error Updating Timecard: ${ err.message }`)
      response.status(500).json({ error: "Internal server error while fetching timecard. Please contact support." });
    }
  }
);

// Delete timecard
timecardsController.delete(
  "/:id",
  validateIdMiddleware,
  validateTimecardExistsMiddleware,
  async (request, response) => {
    try {
      const { id } = request.params;
      const deletedTimecard = await deleteTimecard(id);

      // Log success message
      console.log(`Successfully deleted timecard with ID ${id}`);

      response.status(200).json({ message: `Timecard ${deletedTimecard.id} deleted successfully`, data: deletedTimecard });
    } catch (err) {
      console.log(`Error Deleting Timecard: ${ err.message }`)
      response.status(500).json({ error: "Internal server error while fetching timecard. Please contact support." });
    }
  }
);

// GET all timecards for a specific employee
timecardsController.get(
  "/employee/:employeeId",
  async (request, response) => {
    try {
      const { employeeId } = request.params;
      const timecards = await getTimecardsByEmployeeId(employeeId);
      response.status(200).json({ data: timecards });
    } catch (err) {
      console.log(`Error getting all timecards for ${employeeId}: ${ err.message }`)
      response.status(500).json({ error: "Internal server error while fetching timecard. Please contact support." });
    }
  }
);

// GET a timecard for a specific employee for a specific date range
timecardsController.get('/employee/:employeeId/range/:startDate/:endDate', async (request, response) => {
  const { employeeId, startDate, endDate } = request.params;
  try {
      const timecard = await getTimecardsByEmployeeAndDateRange(employeeId, startDate, endDate);
      if (timecard) {
          response.status(200).json({ data: timecard });
      } else {
          response.status(404).json({ error: "Timecard not found" });
      }
  } catch (err) {
      console.error(`Error fetching timecard for employee ID ${employeeId} between ${startDate} and ${endDate}: ${err.message}`);
      response.status(500).json({ error: "Internal server error while fetching timecard. Please contact support." });
  }
});


module.exports = timecardsController;

