const express = require('express');
const router = express.Router();

const authentificationCtrl = require('../controlleurs/authentification');

router.post('/signup', authentificationCtrl.signup);
router.post('/login', authentificationCtrl.login);

module.exports = router;