var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/karapixie-test');
module.exports = mongoose.connection;
/*
db.on('connecting', function() {
  console.log('Mongoose connecting to ' + dbURI);
});

db.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});

db.on('open', function() {
  console.log('Mongoose opened connection to ' + dbURI );
});

db.on('disconnecting', function() {
  console.log('Mongoose disconnecting from ' + dbURI);
});

db.on('disconnected', function() {
  console.log('Mongoose disconnected from ' + dbURI);
});

db.on('close', function() {
  console.log('Mongoose closed connection from ' + dbURI);
});

db.on('reconnected', function() {
  console.log('Mongoose reconnecting to ' + dbURI);
});

db.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});

process.on('SIGINT', function() {
  db.close(function() {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);

  })
});
*/
