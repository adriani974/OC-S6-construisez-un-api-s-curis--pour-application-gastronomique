const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controlleurs/sauces');

router.get('/', saucesCtrl.getAllSauces);
router.post('/', saucesCtrl.createSauce);
router.get('/:id', saucesCtrl.getOneSauce);
router.put('/:id', saucesCtrl.updateSauce);
router.delete('/:id', saucesCtrl.deleteSauce);

module.exports = router;