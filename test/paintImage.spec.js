var gm = require('gm');
var fs = require('fs')
var chai = require('chai')
var expect = chai.expect;
var path = require('path');
var PaintImage = require('../models/paintImage');

describe('PaintImage', function() {

  it('should create a paintImage', function(done) {
  
    PaintImage.createPaintImageFromFile('test/square.jpg', function(err, paintImage) {
      expect(paintImage.width).to.equal(2679);
      expect(paintImage.height).to.equal(2640);
      expect(paintImage.name).to.equal('square.jpg');
      
      done();
    });

  });

  it('should create a fileimage from file and return new path', function(done){
    PaintImage.createFileImageFromFile(
      'test/square.jpg', 
      'test/square/', 
      80, 
      function(err, toFile) {
        expect(err).to.be.null;
        expect(toFile).to.be.equal('test/square/yyyy.jpg');
        done();
      })
  });

});
