var express = require('express');
var router = express.Router();
var db = require('../db');
var async = require('async');

const request = require('request')

const Validation = require('../requestValidation');

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/autocomplete_address', (req, res, next) => {
  let query = req.body.keyword;

  let url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDwMOqLDdlk6MEStmLZEdk1KVHjnS_Xcls';
  url = url + '&components=country:au';
  // url = url + 'postal_code'
  url = url + '&types=address';
  url = url + '&input=' + encodeURI(query);

  request(url, { json: true }, (err, res2, body) => {
    res.json({
      code: 0,
      data: body
    })
  })
})

router.post('/autocomplete_region', (req, res, next) => {
  let query = req.body.keyword;

  let url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDwMOqLDdlk6MEStmLZEdk1KVHjnS_Xcls';
  url = url + '&components=country:au';
  // url = url + 'postal_code'
  url = url + '&types=(cities)';
  url = url + '&input=' + encodeURI(query);

  request(url, { json: true }, (err, res2, body) => {
    if (body.status == 'OK') {
      let predictions = body.predictions;

      async.each(predictions, (pre, callback) => {
        let place_id = pre.place_id;
        console.log(place_id)
        let url = 'https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyDwMOqLDdlk6MEStmLZEdk1KVHjnS_Xcls'
        url = url + '&placeid=' + encodeURI(place_id);

        request(url, { json: true }, (err, res3, body2) => {
          pre.geometry = body2.result.geometry.location;
          callback()
        })
      }, () => {
        console.log(predictions)
        res.json({
          code: 0,
          data: predictions
        })
      })
    }
    else {
      res.json({
        code: 0,
        data: []
      })
    }
  })
})

router.post('/geocoding', (req, res, next) => {
  let query = req.body.keyword;

  let url = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDwMOqLDdlk6MEStmLZEdk1KVHjnS_Xcls'
  url = url + '&address=' + encodeURI(query);

  request(url, { json: true }, (err, res2, body) => {
    res.json({
      code: 0,
      data: body
    })
  })
})

router.post('/create_user', (req, res, next) => {
  let validationResult = Validation('create_user', req.body);

  console.log(validationResult);

  if (validationResult.code != 0) {
    res.json({
      code: -1,
      errMsg: validationResult.errMsg
    })
    return ;
  }

  db.checkUserByUsername(req.body.username).then(data => {
    if (data.code != 0) {
      res.json({
        code: -2,
        errMsg: data.errMsg
      })
    }
    else if (data.code == 0) {
      db.createUser(req.body)
      .then(data2 => {
        res.json({
          code: 0,
          data: data2[0]
        })
      })
    }
    else {
      res.json({
        code: -1,
        errMsg: 'Unknown error!'
      })
    }
  })
  .catch(err => {
    res.json({
      code: -1,
      errMsg: err
    })
  })
  
})

router.post('/delete_administrator', (req, res, next) => {
  console.log(req.body._id)
  db.deleteOneUser(req.body._id)
  .then(data => {
    if (data.deletedCount > 0) {
      res.json({ code: 0 })
    }
    else {
      res.json({
        code: -1,
        errMsg: 'No such a user'
      })
    }
  })
  .catch(err => {
    res.json({
      code: -1,
      errMsg: err
    })
  })
})

router.post('/edit_property', (req, res, next) => {
  db.editProperty(req.body)
  .then(data => {
    if (data.nModified == 1) {
      res.json({
        code: 0
      })
    }
    else {
      res.json({
        code: -1,
        errMsg: 'Something wrong when request for editing property'
      })
    }
  })
})

router.post('/edit_administrator', (req, res, next) => {
  db.editUser(req.body)
  .then(data => {
    if (data.nModified == 1) {
      res.json({
        code: 0
      })
    }
    else {
      res.json({
        code: -1,
        errMsg: 'Something wrong when request for editing User'
      })
    }
  })
})

router.get('/get_administrator_list', (req, res, next) => {
  db.getUsersByType(0)
  .then(data => {
    console.log(data);
    res.json({
      code: 0,
      data: data
    })
  })
  .catch(err => {
    res.json({
      code: -1,
      errMsg: err
    })
  })
})

router.get('/get_normal_user_list', (req, res, next) => {
  db.getUsersByType(1)
  .then(data => {
    console.log(data);
    res.json({
      code: 0,
      data: data
    })
  })
  .catch(err => {
    res.json({
      code: -1,
      errMsg: err
    })
  })
})

router.get('/get_all_user', (req, res, next) => {
  db.getAllUsers()
  .then(data => {
    console.log(data);
    res.json({
      code: 0,
      data: data
    })
  })
  .catch(err => {
    res.json({
      code: -1,
      errMsg: err
    })
  })
})

router.post('/create_native_title', (req, res, next) => {
  db.createNativeTitle(req.body)
  .then(data => {
    res.json({
      code: 0,
      data: data[0]
    })
  })
  .catch(err => {
    res.json({
      code: -1,
      errMsg: err
    })
  })
})

router.post('/delete_native_title', (req, res, next) => {
  db.deleteOneById('native_title', req.body._id)
  .then(data => {
    if (data.deletedCount > 0) {
      res.json({ code: 0 })
    }
    else {
      res.json({
        code: -1,
        errMsg: 'No such a native title'
      })
    }
  })
  .catch(err => {
    res.json({
      code: -1,
      errMsg: err
    })
  })
})

router.get('/get_all_native_titles', (req, res, next) => {
  db.getAllNativeTitles()
  .then(data => {
    res.json({
      code: 0,
      data: data
    })
  })
  .catch(err => {
    res.json({
      code: -1,
      errMsg: err
    })
  })
})

router.post('/get_native_titles_by_area', (req, res, next) => {
  db.getAllNativeTitles().then(data => {
    res.json({
      code: 0,
      data: data
    })
  }).catch(err => {
    res.json({
      code: -1,
      errMsg: err
    })
  })
})

router.post('/get_certain_native_title_by_plot_id', (req, res, next) => {
  let plot_id = req.body.plot_id;
  let user_id = req.body.user_id;

  db.getNativeTitleByPlotId(plot_id).then(data => {
    if (data.length == 0) {
      res.json({
        code: -1,
        errMsg: 'No such a native title with this plot id'
      })
    }
    else {
      if (user_id) {
        db.ifRecordExist('my_favourite', user_id, plot_id).then(data2 => {
          if (data2.code == 0) {
            res.json({
              code: 0,
              data: {
                nativeTitleInfo: data[0],
                ifLiked: data2.data
              }
            })
          }
        })
        db.addRecords('my_history', user_id, [plot_id]).then(hisRes => {
          console.log(hisRes);
          console.log('add or update to history successfully')
        })
      }
      else {
        res.json({
          code: 0,
          data: {
            nativeTitleInfo: data[0],
            ifLiked: false
          }
        })
      }
    }
  }).catch(err => {
    res.json({
      code: -1,
      errMsg: err
    })
  })
})

router.post('/favourite_native_titles', (req, res, next) => {

  var user_id = req.body.user_id;
  var plot_id_list = req.body.plot_id_list;
  
  async.waterfall([
    (callback) => {
      checkUserIdAndPlotId(user_id, plot_id_list).then(data => {
        if (data.code != 0) callback(data.errMsg)
        else callback(null, data.data)
      })
    },
    (list, callback) => {
      db.addRecords('my_favourite', user_id, list).then(data => {
        callback(null, data)
      })
    }
  ], (err, result) => {
    if (err) res.json({ code: -1, errMsg: err })
    else res.json({ code: 0 })
  })
})

router.post('/unfavourite_native_titles', (req, res, next) => {

  var user_id = req.body.user_id;
  var plot_id_list = req.body.plot_id_list;
  
  async.waterfall([
    (callback) => {
      checkUserIdAndPlotId(user_id, plot_id_list).then(data => {
        if (data.code != 0) callback(data.errMsg)
        else callback(null, data.data)
      })
    },
    (list, callback) => {
      db.deleteRecords('my_favourite', user_id, list).then(data => {
        callback(null, data)
      })
    }
  ], (err, result) => {
    if (err) res.json({ code: -1, errMsg: err })
    else res.json({ code: 0 })
  })

})

router.post('/get_favourite_native_titles_list', (req, res, next) => {
  var user_id = req.body.user_id;

  async.waterfall([
    (callback) => {
      db.findOneRecord('my_favourite', user_id).then(data => {
        if (data.code != 0) callback(data.errMsg)
        else callback(null, data.data)
      })
    },
    (record, callback) => {

      let plot_id_list = []
      for (let i = 0, len = record.plots.length; i < len; ++i) {

        plot_id_list.push(record.plots[i].plot_id)
      }

      console.log(plot_id_list)
      db.getNativeTitlesByPlotIdList(plot_id_list).then(data => {
        callback(null, data, record)
      })
    }
  ], (err, result, record) => {
    let resultWithUpdateTime = result;

    // add update time
    for (let i = 0, len = record.plots.length; i < len; ++i) {
      for (let j = 0, len2 = result.length; j < len2; ++j) {
        if (record.plots[i].plot_id == result[j].plot_id) {
          resultWithUpdateTime[i].update_time = record.plots[j].update_time;
          break;
        }
      }
    }

    if (err) res.json({ code: -1, errMsg: err })
    else res.json({ code: 0, data: resultWithUpdateTime })
  })
})

router.post('/add_history_records', (req, res, next) => {
  var user_id = req.body.user_id;
  var plot_id_list = req.body.plot_id_list;
  
  async.waterfall([
    (callback) => {
      checkUserIdAndPlotId(user_id, plot_id_list).then(data => {
        if (data.code != 0) callback(data.errMsg)
        else callback(null, data.data)
      })
    },
    (list, callback) => {
      db.addRecords('my_history', user_id, list).then(data => {
        callback(null, data)
      })
    }
  ], (err, result) => {
    if (err) res.json({ code: -1, errMsg: err })
    else res.json({ code: 0 })
  })
})

router.post('/delete_history_records', (req, res, next) => {
  var user_id = req.body.user_id;
  var plot_id_list = req.body.plot_id_list;
  
  async.waterfall([
    (callback) => {
      checkUserIdAndPlotId(user_id, plot_id_list).then(data => {
        if (data.code != 0) callback(data.errMsg)
        else callback(null, data.data)
      })
    },
    (list, callback) => {
      db.deleteRecords('my_history', user_id, list).then(data => {
        callback(null, data)
      })
    }
  ], (err, result) => {
    if (err) res.json({ code: -1, errMsg: err })
    else res.json({ code: 0 })
  })
})

router.post('/get_history_records_list', (req, res, next) => {
  var user_id = req.body.user_id;

  async.waterfall([
    (callback) => {
      db.findOneRecord('my_history', user_id).then(data => {
        if (data.code != 0) callback(data.errMsg)
        else callback(null, data.data)
      })
    },
    (record, callback) => {

      let plot_id_list = []
      for (let i = 0, len = record.plots.length; i < len; ++i) {

        plot_id_list.push(record.plots[i].plot_id)
      }

      console.log(plot_id_list)
      db.getNativeTitlesByPlotIdList(plot_id_list).then(data => {
        callback(null, data, record)
      })
    }
  ], (err, result, record) => {
    let resultWithUpdateTime = result;
    // add update time
    for (let i = 0, len = record.plots.length; i < len; ++i) {
      for (let j = 0, len2 = result.length; j < len2; ++j) {
        if (record.plots[i].plot_id == result[j].plot_id) {
          resultWithUpdateTime[i].update_time = record.plots[j].update_time;
          break;
        }
      }
    }

    if (err) res.json({ code: -1, errMsg: err })
    else res.json({ code: 0, data: resultWithUpdateTime })
  })
})

router.post('/add_properties_as_own', (req, res, next) => {
  var user_id = req.body.user_id;
  var plot_id_list = req.body.plot_id_list;
  
  async.waterfall([
    (callback) => {
      checkUserIdAndPlotId(user_id, plot_id_list).then(data => {
        if (data.code != 0) callback(data.errMsg)
        else callback(null, data.data)
      })
    },
    (list, callback) => {
      db.addRecords('my_property', user_id, list).then(data => {
        callback(null, data)
      })
    }
  ], (err, result) => {
    if (err) res.json({ code: -1, errMsg: err })
    else res.json({ code: 0 })
  })
})

router.post('/delete_own_properties', (req, res, next) => {
  var user_id = req.body.user_id;
  var plot_id_list = req.body.plot_id_list;
  
  async.waterfall([
    (callback) => {
      checkUserIdAndPlotId(user_id, plot_id_list).then(data => {
        if (data.code != 0) callback(data.errMsg)
        else callback(null, data.data)
      })
    },
    (list, callback) => {
      db.deleteRecords('my_property', user_id, list).then(data => {
        callback(null, data)
      })
    }
  ], (err, result) => {
    if (err) res.json({ code: -1, errMsg: err })
    else res.json({ code: 0 })
  })
})

router.post('/get_own_properties_list', (req, res, next) => {
  var user_id = req.body.user_id;

  async.waterfall([
    (callback) => {
      db.findOneRecord('my_property', user_id).then(data => {
        if (data.code != 0) callback(data.errMsg)
        else callback(null, data.data)
      })
    },
    (record, callback) => {

      let plot_id_list = []
      for (let i = 0, len = record.plots.length; i < len; ++i) {

        plot_id_list.push(record.plots[i].plot_id)
      }

      console.log(plot_id_list)
      db.getNativeTitlesByPlotIdList(plot_id_list).then(data => {
        callback(null, data, record)
      })
    }
  ], (err, result, record) => {
    let resultWithUpdateTime = result;
    // add update time
    for (let i = 0, len = record.plots.length; i < len; ++i) {
      for (let j = 0, len2 = result.length; j < len2; ++j) {
        if (record.plots[i].plot_id == result[j].plot_id) {
          resultWithUpdateTime[i].update_time = record.plots[j].update_time;
          break;
        }
      }
    }

    if (err) res.json({ code: -1, errMsg: err })
    else res.json({ code: 0, data: resultWithUpdateTime })
  })
})

router.post('/search_by_plot_id', (req, res, next) => {
  var plot_id = req.body.plot_id;

  db.searchPropertyByPlotId(plot_id).then(data => {
    res.json({ code: 0, data: data})
  })
  .catch(err => {
    res.json({ code: -1, errMsg: err })
  })
})

router.post('/search_by_address', (req, res, next) => {
  var address = req.body.address;

  db.searchPropertyByAddress(address).then(data => {
    res.json({ code: 0, data: data})
  })
  .catch(err => {
    res.json({ code: -1, errMsg: err })
  })
})

function checkUserIdAndPlotId (user_id, plot_id_list) {
  var user_id = user_id;
  var plot_id_list = plot_id_list;

  return new Promise((resolve, reject) => {
    async.waterfall([
      (callback) => {
        db.checkUser(user_id).then(data => {
          if (data.code != 0)  callback('There is no such a user') 
          else callback(null, plot_id_list) 
        })
      },
      (list, callback) => {
        let validPlotId = [];
        async.each(list, (plot_id, cb) => {
          db.checkNativeTitle(plot_id).then(data => {
            if (data.code != 0)  cb() 
            else {
              validPlotId.push(plot_id)
              cb()
            }
          })
        }, (err) => {
          if (err) callback(err)
          else callback(null, validPlotId)
        })
      },
      (filteredList, callback) => {
        if (filteredList.length == 0) callback('Enter at least one valid plot id')
        else callback(null, filteredList)
      }
    ], (err, result) => {
      if (err) resolve({ code: -1, errMsg: err })
      else resolve({ code: 0, data: result })
    })
  })
  
}

module.exports = router;
