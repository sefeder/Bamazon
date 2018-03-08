var mysql = require('mysql');
var inquirer = require('inquirer');
var cTable = require('console.table')

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 8080,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bamazon_db"
  });

  connection.connect(function(err) {
    if (err) throw err;

    afterConnection();

  });

  function afterConnection() {
      connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
          if (err) throw err;
          console.table(res);
          connection.end();
      });
  };