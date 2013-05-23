var mysql = require("mysql");

var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nodejs'
});

exports.add = function(data, callback){
	pool.getConnection(function(err, connection) {
	  // Use the connection
	  connection.query( 'INSERT INTO user SET ?', data, function(err, result) {
		// And done with the connection.
		callback(result.insertId);
		connection.end();
		// Don't use the connection here, it has been returned to the pool.
	  });
	});
};

exports.getAll = function(callback){
	pool.getConnection(function(err, connection) {
	  // Use the connection
	  connection.query( 'SELECT * FROM user', function(err, rows) {
		// And done with the connection.	
		callback(rows);	
		connection.end();
		// Don't use the connection here, it has been returned to the pool.
	  });
	});
};

exports.getById = function(id, callback) {
	pool.getConnection(function(err, connection) {
	  // Use the connection
	  connection.query( 'SELECT * FROM user WHERE id = ?', [id], function(err, rows) {
		// And done with the connection.	
		callback(rows);	
		connection.end();
		// Don't use the connection here, it has been returned to the pool.
	  });
	});
};