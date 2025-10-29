const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');

router.post('/', adminAuth, upload.array('images', 5), productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.delete('/:id', adminAuth, productController.deleteProduct);
router.put('/:id', upload.array('images', 5), productController.updateProduct);
router.post('/jewelry', adminAuth, upload.array('images', 5), productController.createJewelry);
router.post('/pot', adminAuth, upload.array('images', 5), productController.createPotItem);
router.post('/fashion', adminAuth, upload.array('images', 5), productController.createFashionProduct);
router.post('/gift', adminAuth, upload.array('images', 5), productController.createGiftItem);

module.exports = router;