var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var request = require('supertest');
//var db = require('../db-test');
var app = require('../app');
var Paint = require('../models/paint');

function createPaints(cb) {
  Paint.create({name:'paint-1'});
  Paint.create({name:'paint-2'}, cb);
}

describe('Paints', function() {
  
  before(function(done) {
    mongoose.connect('mongodb://localhost:27017/karapixie-test', done);
  });
   
  after(function(done) {
    console.log('disconnected');
    mongoose.connection.close(done);
  });
  
  afterEach(function(done) {
    console.log('dropped');
    mongoose.connection.db.dropDatabase(done);
  });
 
  describe('GET /api/paints', function() {

    it('should get a collection of paints', function(done) {
      
      createPaints(function() {
        request(app)
          .get('/api/paints')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.body.length).to.equal(2);
            done();
          });
      });
    });

    it('should get an empty array for an empty collection', function(done) {
      request(app)
        .get('/api/paints')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.body).to.be.empty;
          done();
        });
    });  

  });

  describe('POST /api/paints', function() {

    it('should post a paint', function(done){
      request(app)
      .post('/api/paints')
      .send({name: 'square'})
      .expect('Content-Type', /json/)
      .expect(202)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.header.location).to.equal('/api/paints/' + res.body._id.toString() + '/status');
        expect(res.body.name).to.equal('square');
        done();
      });  
    });

  });

});
