var mongoose = require('mongoose');
var gm = require('gm');
var Category = require('./category');
var path = require('path');
var imageFile = require('./imageFile'); 

var paintImageSchema = new mongoose.Schema({
  
    filepath: {
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

paintImageSchema.virtuals('_file').get(function() {
  return this._file ? this._file : new imageFile(this.filepath);
});


paintImageSchema.methods.resize = function(width, height, cb) {

  this._file.resize(width, height, function(err) {
    if ( err ) cb(err);
    this.width = width;
    this.height = height;
    cb(null, this);
  });
  
};

module.exports = mongoose.model('PaintImage', paintImageSchema);
