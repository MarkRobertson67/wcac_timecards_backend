// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const { getEmployeeById } = require("../queries/EmployeeQueries");
const { getTimecardById } = require("../queries/TimecardQueries");

const validateIdMiddleware = (request, response, next) => {
  const { id } = request.params;
  if (!Number.isInteger(Number(id)) || Number(id) < 1) {
    return response
      .status(400)
      .json({ error: `id param must be a positive integer; received ${id}` });
  } else {
    request.id = Number(id);
    next();
  }
};

const validateEmployeeExistsMiddleware = async (request, response, next) => {
  const { id } = request;
  const employee = await getEmployeeById(id);
  if (!employee) {
    return response
      .status(404)
      .json({ error: `Cannot find employee with id ${id}` });
  }
  request.employee = employee;
  next();
};

const validateTimecardExistsMiddleware = async (request, response, next) => {
  const { id } = request;
  const timecard = await getTimecardById(id);
  if (!timecard) {
    return response
      .status(404)
      .json({ error: `Cannot find timecard with id ${id}` });
  }
  request.timecard = timecard;
  next();
};

const validateDateRangeMiddleware = (request, response, next) => {
  const { startDate, endDate } = request.query;
  
  // Check if both startDate and endDate are provided and valid dates
  if (!startDate || !endDate || !isValidDate(startDate) || !isValidDate(endDate)) {
    return response
      .status(400)
      .json({ error: "Invalid date range. Both startDate and endDate must be valid dates." });
  }
  
  next();
};

const isValidDate = (dateString) => {
  // Simple date validation example; adjust based on your date format requirements
  return !isNaN(Date.parse(dateString));
};


module.exports = {
  validateIdMiddleware,
  validateEmployeeExistsMiddleware,
  validateTimecardExistsMiddleware,
  validateDateRangeMiddleware,
};
