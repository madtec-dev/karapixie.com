var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var request = require('supertest');

var cfg = require('../config');
var dbConnection = require('../db');
cfg.dbName = 'karapixie-test';

var app = require('../app');
var conn;
conn = app.get('conn');

var Paint = require('../models/paint');


describe('Paint', function() {
  
  this.timeout(10000);
  
  var paintData = {
      title: 'square'
    , imagesDir: 'test'
    , category: 'oil'
  };

  before(function(done) {
    if ( !conn ) {
      console.log('opening');
      conn = dbConnection(cfg);
      done();
    }
    done();
  });

  after(function(done) {
    conn.close(done);
  });

  afterEach(function(done) {
    conn.db.dropDatabase(done);
  });

  it('should post a paint', function(done){
    request(app)
    .post('/api/paints')
    .send({name: 'square'})
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res.body.name).to.equal('square');
      done();
    })
    
  });

  it.skip('should create a paint', function(done){
    Paint.createPaint('test/square.jpg', paintData, function(err, paint){
      expect(err).to.be.null;
      expect(paint.title).to.equal('square');
      expect(paint.imagesDir).to.equal('test');
      //expect(paint.imageCanonicalName).to.equal('test/square.jpg');
      done();
    })

  });

  it.skip('should save a paint', function(done) {
    Paint.createPaint('test/square.jpg', paintData, function(err, paint) {
      paint.save(done);
    
    });
  })

  it.skip('should update a paint with no new image', function(done) {
    Paint.createPaint('test/square.jpg', paintData, function(err, paint) {
      paint.save(done);
      Paint.updatePaint({
        _id: paint._id,
        title: 'wide',
        imagesDir: 'newDir',
        category: 'charcoal'
      }, function(err, paint){
        expect(paint.title).to.equal('wide');
        expect(paint.imagesDir).to.equal('newDir');
        done();
        Category.findById(paint.category, function(err, category) {
          expect(category.name).to.equal('charcoal');
          done();
        })
      })
    });
  });
})
