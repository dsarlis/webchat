var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
  // res.sendFile(__dirname + '/index.html');
});

router.post('/midi/register', function(req, res, next) {
  res.send(req.body);
  console.log("address: " + req.body.address + " port: " + port);
  // res.sendFile(__dirname + '/index.html');
});

module.exports = router;
