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
    response.status(500).json({ error: err.message });
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
      response.status(500).json({ error: err.message });
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

    const newTimecard = await createTimecard(employee_id, work_date);

    // Log success message
    console.log(`Successfully created timecard for employee ${employee_id} on ${work_date}`);
    
    response.status(201).json({ data: newTimecard });
  } catch (err) {
    console.error(`Error in POST /timecards: ${err.message}`);
    response.status(500).json({ error: err.message });
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

      // Only include fields that are present in the request body
      const fieldsToUpdate = {};
      if (start_time !== undefined) fieldsToUpdate.start_time = start_time;
      if (lunch_start !== undefined) fieldsToUpdate.lunch_start = lunch_start;
      if (lunch_end !== undefined) fieldsToUpdate.lunch_end = lunch_end;
      if (end_time !== undefined) fieldsToUpdate.end_time = end_time;
      if (total_time !== undefined) fieldsToUpdate.total_time = total_time;

      if (Object.keys(fieldsToUpdate).length === 0) {
        return response.status(400).json({ error: 'No fields to update' });
      }

      const updatedTimecard = await updateTimecard(id, fieldsToUpdate);

      // Log success message
      console.log(`Successfully updated timecard with ID ${id}`);

      response.status(200).json({ data: updatedTimecard });
    } catch (err) {
      response.status(500).json({ error: err.message });
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
      response.status(500).json({ error: err.message });
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
      response.status(500).json({ error: err.message });
    }
  }
);

module.exports = timecardsController;

