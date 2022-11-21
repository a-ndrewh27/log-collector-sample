const controller = require('../controllers/log.controller');
const router = require('express').Router();

router.get('/logs', controller.readLines);

module.exports = router;
