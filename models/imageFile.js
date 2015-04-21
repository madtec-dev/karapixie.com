var gm = require('gm');
var fs = require('fs-extra');
var path = require('path');

var imageFile = function(filepath) {

  this._filepath = filepath;
  
  this._file = null;

  
}

imageFile.prototype.getFile = function() {
  return this._file ? this._file : gm(this._filepath).options({imageMagick: true});
};

imageFile.prototype.copy = function(dstpath, cb) {
  
 fs.copy(this._filepath, dstpath, function(err) {
   if ( err ) cb(err);
   cb(null, this);
 }); 
};

imageFile.prototype.getWidth = function(cb) {
  this.getFile().size(function(err, size) {
    if ( err ) cb(err);
    cb(null, size.width);
  });  
};

imageFile.prototype.getHeight = function(cb) {
  this.getFile().size(function(err, size) {
    if ( err ) cb(err);
    cb(null, size.height);
  });  
};

imageFile.prototype.rename = function(newName, cb) {
  fs.rename(this._filepath, path.join(path.dirname(this._filepath), newName), function(err) {
    if ( err ) cb(err);
    cb(null, this);
  });
};

imageFile.prototype.resize = function(width, height, cb) {
  this.getFile().resize(width, height)
  .write(this._filepath, function(err) {
    if ( err ) cb(err);
    cb(null, this);
  });
};

module.exports = imageFile;
