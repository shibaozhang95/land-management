var express = require('express');
var router = express.Router();

var db = require('../db');

// For the access-control
router.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  db.login(username, password).then(data => {
    if (data.code != 0) res.json({ code: -1, errMsg: 'Username or password is incorrect'})
    else res.json({ code: 0, data: data.data })
  }).catch(err => {
    res.json({ code: -1, errMsg: err });
  })

})

module.exports = router;
