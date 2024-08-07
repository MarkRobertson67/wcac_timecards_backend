
# License

This project is licensed under the Proprietary Software License. See the [LICENSE.txt](./LICENSE.txt) file for details.

For licensing inquiries, please contact Mark Robertson at [markrobertson67@gmail.com](mailto:markrobertson67@gmail.com).

# wcac_Timecard Application Backend

## Brief Project Description

The backend part of this project involves building a REST API for a Timecard Application using Node.js and Express. This API will support functionalities for managing employee time entries and related data. The API will interact with a PostgreSQL database hosted on Neon.tech for data storage and retrieval. Key functionalities include creating and managing employee records, logging daily work hours, calculating total work hours, and handling timecard submissions.

The API will follow RESTful principles, accepting and returning JSON payloads for all operations. It will implement robust validation and error handling practices, ensuring data integrity and security. Each endpoint will serve specific purposes, such as recording work hours, retrieving employee data, and handling timecard submissions securely.

The goal is to create a scalable and efficient backend solution that integrates seamlessly with a React frontend to provide a comprehensive Timecard Application for managing employee work hours effectively.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Set Up Environment Variables](#set-up-environment-variables)
  - [Database Configuration](#database-configuration)
  - [Initialize the Database](#initialize-the-database)
  - [Start the Server](#start-the-server)
- [API Endpoints](#api-endpoints)

## Prerequisites

Ensure you have the following prerequisites installed on your machine:

- **Node.js and npm:** Download and install from [nodejs.org](https://nodejs.org).
- **PostgreSQL Database:** Set up a PostgreSQL database using Neon.tech. Obtain your database connection URL.
- **Neon.tech Database:** Sign up and create a database at [Neon.tech](https://www.neon.tech) to obtain your database connection URL.

## Getting Started

### Clone the Repository

Clone the repository to your local machine:

## Install Dependencies

Navigate into the project directory and install the required dependencies using npm.

npm install

## Set Up Environment Variables

Create a .env file in the root directory of your project to store environment variables.

Example .env file:

PORT=2020
DB_URL=<insert_your_neon_tech_db_url_here>

Replace <insert_your_neon_tech_db_url_here> with your Neon.tech database connection URL obtained during the signup process.


## Database Configuration

Ensure that your Neon.tech PostgreSQL database is running and accessible.


# Initialize the Database

Use the following command to set up the database schema and seed data:

npm run db:setup

This command executes the db:setup script defined in your package.json, which runs the schema and seed SQL files on your Neon.tech PostgreSQL database using the DB_URL environment variable.


## Start the Server
Start the backend server by running the following command:

npm start

The server should now be running locally on the specified port (e.g., `http://localhost:2020`).


## API Endpoints

Use the following API endpoints to interact with the application:

GET /employees: Retrieve a list of all employees.
POST /employees: Create a new employee record.
GET /timecards/:employeeId: Retrieve timecard entries for a specific employee.
POST /timecards/:employeeId: Add a new timecard entry for a specific employee.
PUT /timecards/:timecardId: Update an existing timecard entry.


Example Request:

`http://localhost:2020/employeess`


Example Response:

```json
{
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "position": "Bus Driver"
    },
    {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phone": "+1987654321",
      "position": "Nurse"
    }
  ]
}

```

Example Request:

`http://localhost:2020/timecards/1`

Example Response:

```json
{
  "data": [
    {
      "id": 1,
      "employeeId": 1,
      "workDate": "2024-07-15",
      "startTime": "07:15",
      "lunchStart": "10:45",
      "lunchEnd": "14:15",
      "endTime": "17:00",
      "totalTime": "07:15"
    },
    {
      "id": 2,
      "employeeId": 1,
      "workDate": "2024-07-16",
      "startTime": "07:17",
      "lunchStart": "10:43",
      "lunchEnd": "14:13",
      "endTime": "17:02",
      "totalTime": "07:15"
    }
  ]
}
```
