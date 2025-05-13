const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

const userController = require('../controllers/userControllers');

router.get('/test', userController.test);

router.get('/list-equipment/by-type', userController.getListEquipmentByType);
router.get('/list-best-seller', userController.getListBestSeller);
router.get('/equipment-detail/:id', userController.getEquipmentDetail);

router.get('/user-infor', auth, userController.getUserInfor);

router.post('/post-rate', auth, userController.postRate);
router.get('/get-rate/:id', userController.getRate);

router.post('/add-to-cart', auth, userController.addToCart);
router.get('/get-cart', auth, userController.getCart);
router.delete('/delete-item-cart/:id', auth, userController.deleteItemCart);

router.post('/add-new-order', auth, userController.addNewOrder);
router.get('/get-order', auth, userController.getOrder);

router.get('/search', userController.search);

router.put('/update-equipment', userController.updateEquipment);

module.exports = router;
