import express from 'express';
import pool from '../db/db.js';
import { authenticateToken } from '../middleware/auth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/auth/register
router.post('/auth/register', async (req, res) => {
  try {
    // Extract inputs (name, email, password) from the request
    const name = req.body['name'];
    const email = req.body['email'];
    const password = req.body['password'];

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate inputs (password requirements, valid email)

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password should be at least 8 characters.' });
    }
    if (!/\d/.test(password)) {
      return res.status(400).json({ message: 'Password should contain at least one digit.' });
    }
    if (!/[A-Z]/.test(password)) {
      return res
        .status(400)
        .json({ message: 'Password should contain at least one uppercase letter.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }
    // Check if email already exists in the database
    const alreadyUser = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (alreadyUser.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert the new user into the database
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    );
    // Send a success response

    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({ message: 'Successfully registered.', token: token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const email = req.body['email'];
    const password = req.body['password'];

    const alreadyUser = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (alreadyUser.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    } else {
      const isMatch = await bcrypt.compare(password, alreadyUser.rows[0].password);
      if (isMatch) {
        const token = jwt.sign({ userId: alreadyUser.rows[0].id }, process.env.JWT_SECRET, {
          expiresIn: '24h',
        });
        res.status(200).json({ message: 'Successfully logged in.', token: token });
      } else {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});
