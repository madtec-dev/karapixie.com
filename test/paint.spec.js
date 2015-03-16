var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var Paint = require('../models/paint');

describe('Paint', function() {
  
  this.timeout(5000);
  
  var paintData = {
      title: 'square'
    , imagesDir: 'test'
    , category: 'oil'
  };


  before(function() {
 
    mongoose.connect('mongodb://localhost:27017/karapixie');
    this.conn = mongoose.connection;


  });

  after(function() {
    this.conn.close();
  });

  it('should create a paint', function(done){
    Paint.createPaint('test/square.jpg', paintData, function(err, paint){
      expect(err).to.be.null;
      expect(paint.title).to.equal('square');
      expect(paint.imagesDir).to.equal('test');
      //expect(paint.imageCanonicalName).to.equal('test/square.jpg');
      done();
    })

  });

  it('should save a paint', function(done) {
    Paint.createPaint('test/square.jpg', paintData, function(err, paint) {
      paint.save(done);
    
    });
  })
})
