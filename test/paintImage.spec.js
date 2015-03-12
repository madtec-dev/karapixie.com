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
      expect(paintImage.sizeName).to.equal('100');
      expect(paintImage.name).to.equal('xxx.jpg');
      
      done();
    });

  });

});
