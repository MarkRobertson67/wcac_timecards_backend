// Proprietary Software License
// Copyright (c) 2024 Mark Robertson
// See LICENSE.txt file for details.

const pgp = require("pg-promise")();

require('dotenv').config();

const cn = process.env.DATABASE_URL

const db = pgp(cn);

module.exports = db;