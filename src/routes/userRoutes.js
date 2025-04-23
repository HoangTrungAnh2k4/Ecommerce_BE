const express = require('express');

const router = express.Router();

const userController = require('../controllers/userControllers');

router.get('/test', userController.test);

router.get('/list-equipment/by-type', userController.getListEquipmentByType);
router.get('/list-best-seller', userController.getListBestSeller);
router.get('/equipment-detail/:id', userController.getEquipmentDetail);

router.get('/user-infor', userController.getUserInfor);

router.post('/post-rate', userController.postRate);
router.get('/get-rate/:id', userController.getRate);

router.post('/add-to-cart', userController.addToCart);
router.get('/get-cart', userController.getCart);
router.delete('/delete-item-cart/:id', userController.deleteItemCart);

router.post('/add-new-order', userController.addNewOrder);
router.get('/get-order', userController.getOrder);

router.get('/search', userController.search);

router.put('/update-equipment', userController.updateEquipment);

module.exports = router;
