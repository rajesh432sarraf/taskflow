const express = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateCreateTask,
  validateUpdateTask,
  validateObjectId,
  validateTaskQuery,
} = require('../middleware/validator');

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(protect);

// Task collection & stats endpoints
router.get('/', validateTaskQuery, getTasks);
router.post('/', validateCreateTask, createTask);

// IMPORTANT: /stats must be mounted before /:id to prevent "stats" from being parsed as an ObjectId
router.get('/stats', getTaskStats);

// Individual task endpoints (require valid ObjectId)
router.get('/:id', validateObjectId, getTaskById);
router.put('/:id', validateUpdateTask, updateTask);
router.delete('/:id', validateObjectId, deleteTask);

module.exports = router;

