var mongoose = require('mongoose');
var gm = require('gm');
var Category = require('./category');
var path = require('path');
var fs = require('fs');

var Schema = mongoose.Schema;


var PaintImage = function(options) {
   
  var _filepath = options.filepath || ''; 

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

};


var paintImageSchema = new Schema({

  name: {
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

paintImageSchema.methods.copy = function(dstpath) {

};


var PaintImage = mongoose.model('PaintImage', paintImageSchema);

module.exports = PaintImage;
