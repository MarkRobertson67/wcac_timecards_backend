// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const { Router } = require("express");
const {
  getAllTimecards,
  getTimecardById,
  createTimecard,
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
  },
);

// Create new timecard
timecardsController.post(
  "/",
  async (request, response) => {
    try {
      const { employeeId, work_date, start_time, lunch_start, lunch_end, end_time, total_time } = request.body;
      const newTimecard = await createTimecard(employeeId, work_date, start_time, lunch_start, lunch_end, end_time, total_time);
      response.status(201).json({ data: newTimecard });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },
);

module.exports = timecardsController;
