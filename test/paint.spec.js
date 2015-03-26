var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var request = require('supertest');

var app = require('../app');

var Paint = require('../models/paint');


describe('Paint', function() {
 
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
  
  describe('GET /api/paints/:paintId', function() {

    var _id = mongoose.Types.ObjectId.createPk();
    before(function(done) {
      Paint.create({
        _id: _id,
        name: 'paint-1'
      }, done);
    });

    it('should get a paint by id', function(done) {
      request(app)
        .get('/api/paints/' + _id.toString())
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.body.name).to.equal('paint-1');
          done();
        });
    }); 

  });

  describe('PATCH /api/paints/:paintId', function() {
    
    var _id = mongoose.Types.ObjectId.createPk();
    beforeEach(function(done) {     
      Paint.create({
        _id: _id,
        name: 'paint-1'
      }, done);
    });
    
    it('should update a paint', function(done) {
      request(app)
      .patch('/api/paints/' + _id.toString())
      .send({name: 'updated'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.name).to.equal('updated');
        done();
      });     
    });

  });

  describe('DELETE /api/paints/:paintId', function() {
  
    var _id = mongoose.Types.ObjectId.createPk();
    beforeEach(function(done) {     
      Paint.create({
        _id: _id,
        name: 'paint-1'
      }, done);
    });
    
    it('should delete a paint', function(done) {
      request(app)
      .delete('/api/paints/' + _id.toString())
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body.name).to.equal('paint-1');
      });     
      request(app)
      .get('/api/paints/' + _id.toString())
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.body).to.be.empty;
        done();
      }); 
    });
  });

});
