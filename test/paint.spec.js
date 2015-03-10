var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var Paint = require('../models/paint');

describe('Paint', function() {
  
  var imagesPath = 'test/images';

  before(function() {
 
    mongoose.connect('mongodb://localhost:27017/karapixie');
    this.conn = mongoose.connection;


    fs.mkdirSync(imagesPath);
    var image = fs.readFileSync('test/square.jpg');
    fs.writeFileSync(imagesPath + '/square.jpg', image);
     
  });

  after(function() {
    this.conn.close();
    fs.unlinkSync('test/images/square.jpg');
    fs.rmdirSync(imagesPath)
  });

  describe('initialization', function() {
 
    it('has default attributes', function() {
      var paint = new Paint();

      expect(paint).to.be.ok;
      expect(paint.sizes).to.eql([80, 40]);
      expect(paint.imagesPath).to.equal('public/images');
    });

    /*it('should create a paint', function(done) {
      var paint = Paint.createPaint({
          title: 'square'
        , category: 'oil'
        , imagesPath: 'test/images'
        , imageCanonicalName: 'xxxx.jpg'
      })
      done();
      expect(paint).to.equal('');;
    });*/

    it('should create a cononical image', function() {
      var paint = new Paint({
          imageCanonicalName: 'xxx.jpg'
        , imagesPath: 'test/images'
      })
      var spy = sinon.spy(paint, "createImageCanonical");
      expect(spy.called).to.be.true;
    })

  });

  
  describe('PaintImages', function() {
    it('should have a canonical image path', function() {

      var paint = new Paint({imageCanonicalName: 'square.jpg'});
      expect(paint.imageCanonicalPath).to.equal('public/images/square.jpg');

    }); 

  });
  
})
