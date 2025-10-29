const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, upload.single('image'), categoryController.createCategory);
router.put('/:id', authMiddleware, upload.single('image'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/type/:type', categoryController.getCategoriesByType);

module.exports = router;