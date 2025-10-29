const express = require('express');
const router = express.Router();
const {
    getAllEditorials,
    getAllEditorialsAdmin,
    getEditorialById,
    createEditorial,
    updateEditorial,
    deleteEditorial,
    toggleEditorialStatus
} = require('../controllers/editorialController');
const { protect } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getAllEditorials);

// Protected admin routes
router.use(protect, adminAuth);

// Admin routes
router.get('/admin', getAllEditorialsAdmin);
router.get('/:id', getEditorialById);
router.post('/', upload.single('image'), createEditorial);
router.put('/:id', upload.single('image'), updateEditorial);
router.delete('/:id', deleteEditorial);
router.patch('/:id/toggle', toggleEditorialStatus);

module.exports = router;