var mysql = require('mysql');
var inquirer = require('inquirer');
var cTable = require('console.table')

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
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
          productSelect();
        //   productQuantity();
         
      });
  };

  function productSelect() {
    connection.query("SELECT product_name, item_id, price, stock_quantity FROM products", function (err, results) {
        if (err) throw err;
        var choiceArray = [];
        inquirer.prompt([
                {
                    name: "productSelect",
                    type: "list",
                    choices: function () {
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name + " | $" + results[i].price);
                        }
                        return choiceArray;

                    },
                    message: "Which product would you like to purchase? (Use arrows to select)",
                    pageSize: 20,
                },
            ])
            .then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (choiceArray.indexOf(answer.productSelect) === results[i].item_id) {
                        chosenItem = results[i];
                    }
                }
                inquirer.prompt([
                    {
                        name: "productUnits",
                        type: "input",
                        message: "How many of those babies would you like to buy, hun?",
                        validate: function (value) {
                            if (isNaN(value) === false && value <= chosenItem.stock_quantity) {
                                console.log("\nComin' right up, hun!")
                                return true;
                            } else if (isNaN(value) === false && value > chosenItem.stock_quantity) {
                                console.log("\nI can't give ya that many, babe! We only have "+chosenItem.stock_quantity+" left in stock");
                                return false;
                            } else {
                                console.log("\nWhat kinda number is that, darlin'?!")
                                return false;
                            }
                        }

                    }
                ])
            })

        connection.end();
    })
}