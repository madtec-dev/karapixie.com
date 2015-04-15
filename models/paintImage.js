var mongoose = require('mongoose');
var gm = require('gm');
var Category = require('./category');
var path = require('path');
var fs = require('fs');

var Schema = mongoose.Schema;


var PaintImage = function(filepath) {

  var _filepath = filepath; 

  var _schema = new mongoose.Schema({
  
    filename: {
      type: String,
      required: true
    },

    width: {
      type: Number,
      required: true
    },

    height: {
      type: Number,
      required: true
    }
  
  });

  var _model = mongoose.model('PaintImageModel', _schema);

  this.getWidth = function() {
    return _model.width;
  };

  this.getHeight = function() {
    return _model.height;
  };

  this.getSize = function() {
    return {
      width: _model.width,
      height: _model.height
    }
  };

  this.resize = function(width, height, cb) {
    var self = this;
    gm(_filepath)
    .options({imageMagick: true})
    .resize(width, height)
    .write(_filepath, function(err) {
      if( err ) return cb(err);
      cb(null, self);
    })
  };

  this.move = function(dstpath, cb) {
    var self = this;
    fs.move(_filepath, dstpath, function(err) {
      if( err ) return cb(err);
      _filepath = dstpath;
      cb(null, self);
    });
  };

  this.getFilePath = function() {
    return _filepath;
  };


  this.setFilePath = function(filepath) {
    _filePath = filepath;
    
  };
  
  this.getFileName = function() {
    return _model.filename; 
  };

  this.setFileName = function(filename) {
    _model.filename = filename;
  };
  
  //this.setFileName(path.basename(_filepath));
  var self = this;
  return new Promise(function(resolve, reject) {
    gm(_filepath)
    .options({imageMagick: true})
    .size(function(err, size) {
      if( err ) reject(err);
      _model.width = size.width;
      _model.height = size.height;
      resolve(self);
    });
  });



};

module.exports = PaintImage;
