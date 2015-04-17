var mongoose = require('mongoose');
var gm = require('gm');
var Category = require('./category');
var path = require('path');
var fs = require('fs-extra');

var Schema = mongoose.Schema;

var schema = new mongoose.Schema({
  
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

// TODO this create a new model when a PaintImage is created
// if not the same model is overwirtten when a new PaintImage is created 
var Model = mongoose.model('PaintImageModel', schema);
var PaintImage = function(filepath) {

  var _model = new Model();
  var _filepath = filepath; 

 
  this.getWidth = function() {
    return _model.width;
  };

  this.setWidth = function(width) {
    _model.width = width;
  };

  this.setHeight = function(height) {
   _model.height = height;
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
    return new Promise(function(resolve, reject) {
      gm(_filepath)
      .options({imageMagick: true})
      .resize(width, height)
      .write(path.join(path.dirname(_filepath), self.getFileName()), function(err) {
        if( err ) reject(err);
        resolve(self);
      })
    })
  };

  this.copy = function(dstpath) {
    var self = this;
    return new Promise(function(resolve, reject) {
      fs.copySync(_filepath, dstpath);
      _filepath = dstpath;
      resolve(self);
    });
  };
  
  this.move = function(dstpath) {
    var self = this;
      // THIS IS MOVE IN PRODUCTION
      fs.copySync(_filepath, dstpath);
      _filepath = dstpath;
      return(self);
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
  this.setSizes = function() {
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
    })
  };
};

module.exports = PaintImage;
