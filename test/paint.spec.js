var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var chai = require('chai');
var expect = chai.expect;

var Paint = require('../models/paint');

describe('Paint', function() {
  
  var imagesDir = 'test/images';

  before(function() {
 
    mongoose.connect('mongodb://localhost:27017/karapixie');
    this.conn = mongoose.connection;

    /*
    conn.on('error', console.error.bind(console, 'connection error:'));
    conn.once('open', function callback() {
      console.log('Connected to DB');
    })
    */


    fs.mkdirSync(imagesDir);
    var image = fs.readFileSync('test/square.jpg');
    fs.writeFileSync(imagesDir + '/square.jpg', image);
     
  });

  after(function() {
    this.conn.close();
    fs.unlinkSync('test/images/square.jpg');
    fs.rmdirSync(imagesDir)
  });

  describe('initialization', function() {
 
    it('has default attributes', function() {
      var paint = new Paint();

      expect(paint).to.be.ok;
      expect(paint.sizes).to.eql([80, 40]);
      expect(paint.baseDir).to.equal('public/images');
    });

  });

  
  describe('PaintImage', function() {
    it('should read a paint image', function() {
  
      var paint = new Paint({
        title: 'square',
        category: 'oil',
        baseDir: 'test/images'
      });
      

      var canonicalImage = paint.readCanonicalImage();
      expect(canonicalImage).to.be.ok; 
       
      

    }) 
  });
  
  
})
