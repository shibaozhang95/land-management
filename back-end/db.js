var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var mongodb = require('mongodb');

// MongoClient.connect(url, (err, client) => {
//   if (err) throw err;
  
//   var db = client.db('ab_quoll');

//   var native_title = db.collection('native_title');
//   native_title.insertOne({
//     plotId: 'test'
//   })
// })
var db = {
  createUser: function (userInfo) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var userTable = db.collection('user');
        userTable.insertOne({
          'username': userInfo.username,
          'password': userInfo.password,
          'user_type': userInfo.user_type
        }, (err, result) => {
          if (err) throw err;

          resolve(result.ops);

          client.close();
        })
      })
    })
  },

  checkUser: function (user_id) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var userTable = db.collection('user');
        
        userTable.find({_id: new mongodb.ObjectID(user_id)}).toArray((err, results) => {
          if (err) throw err;

          if (results.length == 0) {
            resolve({ code: -1, errMsg: 'No such a user' })
          }
          else {
            resolve({ code: 0 })
          }

          client.close();
        })
      })
    })
  },

  checkUserByUsername: function (username) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var userTable = db.collection('user');
        
        userTable.find({'username': username}).toArray((err, results) => {
          if (err) throw err;

          if (results.length != 0) {
            resolve({ code: -1, errMsg: 'Username already exist!' })
          }
          else {
            resolve({ code: 0 })
          }

          client.close();
        })
      })
    })
  },

  login: function (username, password) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var userTable = db.collection('user');
        
        userTable.find({'username': username, 'password': password}).toArray((err, results) => {
          if (err) throw err;

          if (results.length == 0) {
            resolve({ code: -1, errMsg: 'No such a user' })
          }
          else {
            resolve({ code: 0, data: results[0] })
          }

          client.close();
        })
      })
    })
  },

  checkNativeTitle: function (plot_id) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var nativeTitleTable = db.collection('native_title');
        
        nativeTitleTable.find({plot_id: plot_id}).toArray((err, results) => {
          if (err) throw err;

          if (results.length == 0) {
            resolve({ code: -1, errMsg: 'No such a native title' })
          }
          else {
            resolve({ code: 0 })
          }
        })
      })
    })
  },

  getUsersByType: function (type) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var userTable = db.collection('user');
        userTable.find({'user_type': type}).toArray((err, result) => {
          if (err) throw err;

          resolve(result);

          client.close();
        })
      })
    })
  },

  getAllUsers: function () {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var userTable = db.collection('user');
        userTable.find().toArray((err, result) => {
          if (err) throw err;

          resolve(result);

          client.close();
        })
      })
    })
  },

  deleteOneUser: function (_id) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var userTable = db.collection('user');
        userTable.deleteOne({'_id': new mongodb.ObjectID(_id)}, (err, obj) => {
          if (err) throw err;

          else resolve(obj)

          client.close();
        })
      })
    })
  },

  deleteOneById: function (table, _id) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) reject('Something goes wrong with database function');

        var db = client.db('ab_quoll');
        var certainTable = db.collection(table);
        certainTable.deleteOne({'_id': new mongodb.ObjectID(_id)}, (err, obj) => {
          if (err) throw err;

          else resolve(obj)

          client.close();
        })
      })
    })
  },

  getAllNativeTitles: function () {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var nativeTitleTable = db.collection('native_title');
        nativeTitleTable.find().toArray((err, result) => {
          if (err) throw err;

          else resolve(result);

          client.close();
        })
      })
    })
  },

  createNativeTitle: function (info) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var nativeTitleTable = db.collection('native_title');
        nativeTitleTable.insertOne({
          'agreement_type': info.agreement_type,
          'plot_id': info.plot_id,
          'address': info.address,
          'owner': info.owner,
          'coordinates': info.coordinates
        }, (err, result) => {
          if (err) throw err;

          else resolve(result.ops);

          client.close();
        })
      })
    })
  },

  editProperty: function (info) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var nativeTitleTable = db.collection('native_title');
        
        nativeTitleTable.update({_id: new mongodb.ObjectID(info._id)}, {
          $set: {
            "agreement_type": info.agreement_type,
            "plot_id": info.plot_id,
            "address": info.address,
            "owner": info.owner,
            "coordinates": info.coordinates 
          }
        }, (err, res) => {
          if (err) throw err;
          
          resolve(res.result)

          client.close();
        })
      })
    })
  },

  editUser: function (info) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var userTable = db.collection('user');
        
       userTable.update({_id: new mongodb.ObjectID(info._id)}, {
          $set: {
            password: info.password 
          }
        }, (err, res) => {
          if (err) throw err;
          
          resolve(res.result);

          client.close();
        })
      })
    })
  },

  getNativeTitleByPlotId: function (plot_id) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var nativeTitleTable = db.collection('native_title');

        nativeTitleTable.find({
          'plot_id': plot_id
        }).toArray((err, result) => {
          if (err) throw err;

          // response(result.ops);
          else resolve(result)

          client.close();
        })
      })
    })
  },

  getNativeTitlesByPlotIdList: function (list) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var nativeTitleTable = db.collection('native_title');

        nativeTitleTable.find({
          'plot_id': { $in: list }
        }).toArray((err, results) => {
          if (err) throw err;

          // response(result.ops);
          resolve(results)

          client.close();
        })
      })
    })
  },

  ifRecordExist: function (table_name, user_id, plot_id) {
    return new Promise((response, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var table = db.collection(table_name);

        table.find({'user_id': user_id, 'plots.plot_id': plot_id}).toArray((err, results) => {
          if (err) throw err;

          if (results.length == 0) response({ code: 0, data: false })
          else response({ code: 0, data: true })
        })
      })
    })
  },

  addRecords: function (table_name, user_id, plot_id_list) {
    return new Promise((response, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var table = db.collection(table_name);

        table.find({'user_id': user_id}).toArray((err, results) => {
          if (err) throw err;

          // no such records, insert a new one
          if (results.length == 0) {
            let newRecord = {
              'user_id': user_id,
              'plots': []
            }
            for (let i = 0, len = plot_id_list.length; i < len; ++i) {
              newRecord.plots.push({
                'plot_id': plot_id_list[i],
                'update_time': Date.now()
              })
            }
            table.insertOne(newRecord, (err, result) => {
              if (err) throw err;
              else response(result.ops);

              client.close();
            })
          }
          // already got records for this user, update
          else {
            let updatedRecord = results[0];
            let noRepeatList = []; // in case of repeated record
            
            // handle with repeated records first
            for (let j = 0, len2 = plot_id_list.length; j < len2; ++j) {
              let ifRepeated = false;
              for (let i = 0, len = updatedRecord.plots.length; i < len; ++i) {
                if (updatedRecord.plots[i].plot_id == plot_id_list[j]) {
                  ifRepeated = true;
                  updatedRecord.plots[i].update_time = Date.now();
                }
              }
              if (!ifRepeated) noRepeatList.push(plot_id_list[j])
            }
            
            // add new records
            for (let i = 0, len = noRepeatList.length; i < len; ++i) {
              updatedRecord.plots.push({
                'plot_id': noRepeatList[i],
                'update_time': Date.now()
              })
            }

            table.update({'user_id': user_id}, updatedRecord, (err, result) => {
              if (err) throw err;
              else response(result.ops);

              client.close();
            })
          }
        })
      })
    })
  },

  deleteRecords: function (table_name, user_id, plot_id_list) {
    return new Promise((response, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var table = db.collection(table_name);
        
        table.find({'user_id': user_id}).toArray((err, results) => {
          if (err) throw err;

          if (results.length == 0) {
            reject('No records for this user')
            return;
          }

          else {
            let updatedRecord = results[0];
            let newPlotList = [];

            for (let i = 0, len = updatedRecord.plots.length; i < len; ++i) {
              let ifExist = false;
              for (let j = 0, len2 = plot_id_list.length; j < len2; ++j) {
                if (updatedRecord.plots[i].plot_id == plot_id_list[j]) {
                  ifExist = true;
                }
              }
              
              if (!ifExist) newPlotList.push(updatedRecord.plots[i])
            }

            updatedRecord.plots = newPlotList;

            table.update({'user_id': user_id}, updatedRecord, (err, result) => {
              if (err) throw err;
              else response({ code: 0, data: result })
            })
          }
        })
      })
    })
  },

  findOneRecord: function (table_name, user_id) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var table = db.collection(table_name);
        
        table.find({'user_id': user_id}).toArray((err, results) => {
          if (err) throw err;

          if (results.length == 0) resolve({ code: 0, data: {plots : []}});
          else resolve({ code: 0, data: results[0]})
        })
      })
    })
  },

  searchPropertyByPlotId: function (keyword) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var nativeTitleTable = db.collection('native_title');

        var query = {
          'plot_id': new RegExp('\.?' + keyword + '.?')
        }

        nativeTitleTable.find(query).toArray((err, obj) => {
          if (err) throw err;

          resolve(obj)
        })
      })
    })
  },

  searchPropertyByAddress: function (keyword) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, client) => {
        if (err) throw err;

        var db = client.db('ab_quoll');
        var nativeTitleTable = db.collection('native_title');

        var query = {
          'address': new RegExp('\.?' + keyword + '.?')
        }

        nativeTitleTable.find(query).toArray((err, obj) => {
          if (err) throw err;

          resolve(obj)
        })
      })
    })
  }

}
module.exports = db