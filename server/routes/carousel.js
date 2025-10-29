const express = require('express');
const router = express.Router();
const carouselController = require('../controllers/carouselController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.single('image'), carouselController.createCarousel);
router.put('/:id', authMiddleware, upload.single('image'), carouselController.updateCarousel);
router.delete('/:id', authMiddleware, carouselController.deleteCarousel);
router.get('/', carouselController.getActiveCarousels);
router.get('/all', authMiddleware, carouselController.getAllCarousels);
router.put('/order/:id', authMiddleware, carouselController.updateCarouselOrder);

module.exports = router;