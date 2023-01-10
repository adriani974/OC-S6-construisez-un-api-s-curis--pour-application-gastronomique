const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const saucesCtrl = require('../controlleurs/sauces');

router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, saucesCtrl.updateSauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
//router.post('/:id/like', auth, multer, saucesCtrl.addLikeSauce);

module.exports = router;