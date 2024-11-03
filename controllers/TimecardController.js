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
    console.log("POST request received for timecards");
    console.log("Request body:", request.body);
    const { employee_id, work_date, status } = request.body;

    if (!employee_id || !work_date) {
      return response.status(400).json({
        error: 'Missing required fields',
        fields: { employee_id, work_date }
      });
    }

    // Optional: Validate 'status' if provided
    const validStatuses = ['active', 'submitted']; 
    if (status && !validStatuses.includes(status.toLowerCase())) {
      return response.status(400).json({
        error: `Invalid status value. Valid statuses are: ${validStatuses.join(', ')}`,
        receivedStatus: status
      });
    }

    const newTimecard = await createTimecard(employee_id, work_date, request.body);

    // Log success message
    console.log(`Successfully created timecard with ID ${newTimecard.id} for employee ${employee_id} on ${work_date}. Timecard ID: ${newTimecard.id}`);
    
    response.status(201).json({ data: newTimecard });
  } catch (err) {
    console.error(`Error in POST /timecards: ${err.message}`);
    response.status(500).json({ error: "Internal server error while creating new timecard. Please contact support." });
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
      const { status, start_time, lunch_start, lunch_end, end_time, total_time } = request.body;

      // Validate fields to ensure they exist before attempting to update
      const fieldsToUpdate = {};
      if (status !== undefined) fieldsToUpdate.status = status;
      if (start_time !== undefined) fieldsToUpdate.start_time = start_time;
      if (lunch_start !== undefined) fieldsToUpdate.lunch_start = lunch_start;
      if (lunch_end !== undefined) fieldsToUpdate.lunch_end = lunch_end;
      if (end_time !== undefined) fieldsToUpdate.end_time = end_time;
      if (total_time !== undefined) fieldsToUpdate.total_time = total_time;
      console.log(fieldsToUpdate)

      if (Object.keys(fieldsToUpdate).length === 0) {
        console.log("No valid fields provided for update");
        return response.status(400).json({ error: 'No valid fields provided for update' });
      }

      const updatedTimecard = await updateTimecard(id, fieldsToUpdate);
      console.log(`Successfully updated timecard with ID ${id}`);
      response.status(200).json({ data: updatedTimecard });
    } catch (err) {
      console.log(`Error Updating Timecard: ${ err.message }`)
      response.status(500).json({ error: "Internal server error while updating timecard. Please contact support." });
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
    const timecards = await getTimecardsByEmployeeAndDateRange(employeeId, startDate, endDate);
    if (timecards.length > 0) { // Check if any timecards are found
        response.status(200).json({ data: timecards });
    } else {
        console.log(`No timecards found for employee ID ${employeeId} between ${startDate} and ${endDate}. Creating new entries...`);
        response.status(200).json({ data: timecards });
    }
  } catch (err) {
      console.error(`Error fetching timecard for employee ID ${employeeId} between ${startDate} and ${endDate}: ${err.message}`);
      response.status(500).json({ error: "Internal server error while fetching timecards. Please contact support." });
  }
});


module.exports = timecardsController;
