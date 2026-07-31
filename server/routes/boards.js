import express from 'express';
import pool from '../db/db.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/aac/boards (fetch boards with their tiles)
router.get('/boards', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id || null;

    let boardQuery = `SELECT * FROM boards WHERE is_default=TRUE LIMIT 1`;
    let queryParams = [];

    if (userId) {
      boardQuery = `SELECT * FROM boards WHERE user_id = $1 OR is_default=TRUE ORDER BY is_default ASC, id DESC LIMIT 1`;
      queryParams = [userId];
    }

    const boardResult = await pool.query(boardQuery, queryParams);

    if (boardResult.rows.length === 0) {
      return res.status(404).json({ message: 'No board found' });
    }

    const board = boardResult.rows[0];

    const tilesResult = await pool.query(
      `SELECT id, label, icon_name AS "iconName", color, position_index AS "positionIndex"
            FROM tiles
            WHERE board_id=$1
            ORDER BY position_index ASC
            `,
      [board.id]
    );

    res.json({
      id: board.id,
      title: board.title,
      isDefault: board.is_default,
      tiles: tilesResult.rows,
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ message: 'Server error fetching board data' });
  }
});

// POST /api/aac/boards (create a new board with tiles)
router.post('/boards', authenticateToken, async (req, res) => {
  const { title, tiles } = req.body;
  // Validation
  if (!title || !Array.isArray(tiles) || tiles.length === 0) {
    return res.status(400).json({ message: 'Title and non-empty tiles are required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start SQL Transaction

    const userId = req.user.id || null;

    // Create the board
    const boardResult = await client.query(
      `INSERT INTO boards (user_id, title, is_default) VALUES ($1, $2, FALSE) RETURNING id, title`,
      [userId, title]
    );

    const newBoardId = boardResult.rows[0].id;

    // Insert tiles
    for (let i = 0; i < tiles.length; i++) {
      const { label, iconName, color } = tiles[i];

      if (!label || !iconName) {
        throw new Error('Each tile must have a label and iconName');
      }

      await client.query(
        `INSERT INTO tiles (board_id, label, icon_name, color, position_index)
                VALUES ($1, $2, $3, $4, $5)`,
        [newBoardId, label, iconName, color || '#ffffff', i]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Board created successfully',
      boardId: newBoardId,
    });
  } catch (error) {
    await client.query('ROLLBACK'); // Roll back changes if error occurs
    console.error('Error creating board:', error);

    const isValidationError = error.message.includes('must have a label');
    const clientMessage = isValidationError ? error.message : 'Failed to create board';
    res.status(400).json({ message: clientMessage });
  } finally {
    client.release();
  }
});

router.put('/boards/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, tiles } = req.body;
  const userId = req.user.id;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const boardResult = await client.query('SELECT * FROM boards WHERE id=$1 FOR UPDATE', [id]);

    if (boardResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Board not found' });
    }

    const board = boardResult.rows[0];

    if (board.is_default) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Default boards cannot be modified' });
    }

    // ownership check
    if (board.user_id !== userId) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Forbidden: You do not own this board' });
    }

    // make updates
    if (title) {
      await client.query('UPDATE boards SET title=$1 WHERE id=$2', [title, id]);
    }

    if (Array.isArray(tiles)) {
      await client.query('DELETE FROM tiles WHERE board_id=$1', [id]);

      for (let i = 0; i < tiles.length; i++) {
        const { label, iconName, color } = tiles[i];

        if (!label || !iconName) {
          throw new Error('Each tile must have a label and iconName');
        }

        await client.query(
          `INSERT INTO tiles (board_id, label, icon_name, color, position_index)
          VALUES ($1, $2, $3, $4, $5)`,
          [id, label, iconName, color || '#ffffff', i]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Board updated successfully', boardId: board.id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating board:', error);

    const isValidationError = error.message.includes('must have a label');
    const clientMessage = isValidationError ? error.message : 'Failed to update board';

    res.status(400).json({ message: clientMessage });
  } finally {
    client.release();
  }
});

router.delete('/boards/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const boardResult = await client.query('SELECT * FROM boards WHERE id = $1 FOR UPDATE', [id]);

    if (boardResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Board not found' });
    }
    const board = boardResult.rows[0];

    if (board.is_default) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Default starter boards cannot be deleted' });
    }

    if (board.user_id !== userId) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Forbidden: You do not own this board' });
    }

    await client.query('DELETE FROM boards WHERE id=$1', [id]);

    await client.query('COMMIT');
    res.json({ message: 'Board deleted successfully', boardId: board.id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting board:', error);
    res.status(500).json({ message: 'Server error deleting board' });
  } finally {
    client.release();
  }
});
export default router;
