var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var Paint = require('../models/paint');

describe('Paint', function() {
  this.timeout(5000);
  
  var imagesPath = 'test/images';
  var paintData = {
      title: 'square'
    , imagesPath: 'test'
    , category: 'oil'
    , imageCanonicalName: 'test/square.jpg'
  };

  before(function() {
 
    mongoose.connect('mongodb://localhost:27017/karapixie');
    this.conn = mongoose.connection;


    /*fs.mkdirSync(imagesPath);
    var image = fs.readFileSync('test/square.jpg');
    fs.writeFileSync(imagesPath + '/square.jpg', image);
    */
  });

  after(function() {
    this.conn.close();
    /*fs.unlinkSync('test/images/square.jpg');
    fs.rmdirSync(imagesPath)*/
  });

  it('should create a paint', function(done){
    Paint.createPaint(paintData, function(err, paint){
      expect(err).to.be.null;
      expect(paint.title).to.equal('square');
      expect(paint.imagesPath).to.equal('test');
      expect(paint.imageCanonicalName).to.equal('test/square.jpg');
      done();
    })

  });

  it('should save a paint', function(done) {
    Paint.createPaint(paintData, function(err, paint) {
      paint.save(done);
    
    });
  })
})
