var chai = require('chai');
chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);
var app = 'localhost:3000';

describe("Unit Testing", function() {
    describe("User account", function() {
        var userID;
        it("Create a new administrator account with complete and valid data", function(done) {
             chai.request(app)
            .post('/api/create_user')
            .send({
                "username": "Shibao",
                "password": "test",
                "user_type": 0
            })
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.code).to.equal(0);
                userID = res.body.data._id;
                done();
            });
        });
        
        it("Create a new administrator account with incomplete data", function(done) {
            chai.request(app)
           .post('/api/create_user')
           .send({
               "password": "test",
               "user_type": 0
           })
           .end(function (err, res) {
               if (err) return done(err);
               expect(res.body.code).to.equal(-1);         
               expect(res.body.errMsg).to.equal('username error');     
               done();
           });
        });

        it("Test account deletion with an existing account ID", function(done) {
         chai.request(app)
        .post('/api/delete_administrator')
        .send({
            "_id": userID
        })
        .end(function (err, res) {
            if (err) return done(err);
            expect(res.body.code).to.equal(0); 
            done();
            });
        });

        it("Test account get request", function(done) {
            chai.request(app)
           .get('/api/get_administrator_list')
           .end(function (err, res) {
               if (err) return done(err);
               expect(res.body.code).to.equal(0); 
               console.log(res.body.data);
               done();
               });
           });
    });
    describe("Map interaction", function() {
        var plotID;
        it("Test native title creation with valid data", function(done) {
            chai.request(app)
           .post('/api/create_native_title')
           .send({
            "agreement_type": 4,
            "plot_id": "TSR90001",
            "address": "Test, Melbourne, Victoria",
            "owner": "TestUser",
            "coordinates": [
                [-37.807465889941064, 144.963508121078],
                [-37.807516749443536, 144.96591138035535],
                [-37.809076423844395, 144.96591138035535],
                [-37.80916118781366, 144.9639587321925]
            ]
        })
           .end(function (err, res) {
               if (err) return done(err);
               expect(res.body.code).to.equal(0);
               plotID = res.body.data._id;
               done();
           });
        });
        it("Test native title deletion with valid ID", function(done) {
            chai.request(app)
           .post('/api/delete_native_title')
           .send({
            "_id": plotID
        })
           .end(function (err, res) {
               if (err) return done(err);
               expect(res.body.code).to.equal(0);
               done();
           });
        });
        it("Test native title get request", function(done) {
            chai.request(app)
           .get('/api/get_all_native_titles')
           .end(function (err, res) {
               if (err) return done(err);
               expect(res.body.code).to.equal(0);
               console.log(res.body.data);
               done();
           });
        });
    });
});