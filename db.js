var mongoose = require('mongoose');

function dbConnection(cfg) {
  var conn = mongoose.connect(cfg.hostname + ':' + cfg.port + '/' + cfg.dbName);
  conn = mongoose.connection;

  conn.on('error', console.error.bind(console, 'connection error:'));
  conn.once('open', function callback() {
    console.log('Connected to DB -> ' + cfg.dbName);
  })
  return conn;
}

module.exports = dbConnection;
