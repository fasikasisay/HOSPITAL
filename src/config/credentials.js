const bcrypt = require("bcryptjs");

/**
 * Staff/admin accounts.
 *
 * These were previously hardcoded inside the login page's JavaScript
 * (plain-text, visible to anyone who opened dev tools). They now live
 * server-side only, and passwords are stored as bcrypt hashes rather
 * than plain text.
 *
 * This module is intentionally shaped like a simple "user table" so
 * swapping it for a real database later (Postgres, Mongo, etc.) only
 * means replacing `findUserByUsername` — nothing in the auth
 * controller or middleware needs to change.
 *
 * To change or add accounts, set STAFF_PASSWORD / ADMIN_PASSWORD in
 * your .env file, or edit the seed list below for local development.
 */

const SALT_ROUNDS = 10;

const seedAccounts = [
    {
        username: "admin",
        role: "admin",
        password: process.env.ADMIN_PASSWORD || "admin123",
    },
    {
        username: "staff",
        role: "staff",
        password: process.env.STAFF_PASSWORD || "staff123",
    },
];

const users = seedAccounts.map((account) => ({
    username: account.username,
    role: account.role,
    passwordHash: bcrypt.hashSync(account.password, SALT_ROUNDS),
}));

function findUserByUsername(username) {
    return users.find(
        (user) => user.username.toLowerCase() === String(username).toLowerCase()
    );
}

module.exports = { findUserByUsername };
