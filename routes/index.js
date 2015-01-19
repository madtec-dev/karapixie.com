var express = require('express');
var router = express.Router();
var paints = require('../data/paints');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/paints', function(req, res) {
  res.json(paints);
});

module.exports = router;
