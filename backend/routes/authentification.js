const express = require('express');
const router = express.Router();

const authentificationCtrl = require('../controlleurs/authentification');
const password = require('../middleware/password-check');

router.post('/signup', password, authentificationCtrl.signup);
router.post('/login', authentificationCtrl.login);

module.exports = router;