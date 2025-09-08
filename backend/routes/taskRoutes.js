import express from 'express';
import {
createTask,
getTasks,
getTaskById,
updateTask,
deleteTask
} from '../controllers/taskController.js';


const router = express.Router();


router.post('/', createTask); // Create
router.get('/', getTasks); // Read all
router.get('/:id', getTaskById); // Read one
router.put('/:id', updateTask); // Update
router.delete('/:id', deleteTask); // Delete


export default router;