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

connection.connect(function (err) {
    if (err) throw err;

    afterConnection();

});

function afterConnection() {
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        productSelect();
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
                message: "Which product would you like to purchase? (Use arrow keys to select)",
                pageSize: 20,
            },
        ])
            .then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (choiceArray.indexOf(answer.productSelect) + 1 === results[i].item_id) {
                        chosenItem = results[i];
                    }
                }
                inquirer.prompt([
                    {
                        name: "productUnits",
                        type: "input",
                        message: "How many of those would you like to buy, hun?",
                        validate: function (value) {
                            if (isNaN(value) === false && value <= chosenItem.stock_quantity) {
                                return true;
                            } else if (isNaN(value) === false && value > chosenItem.stock_quantity) {
                                console.log("\n\nI can't give ya that many, babe! We only have " + chosenItem.stock_quantity + " left in stock.\n");
                                return false;
                            } else {
                                console.log("\n\nWhat kinda number is that, darlin'?!\n")
                                return false;

                            }
                        }
                    },

                ])
                    .then(function (answer) {

                        connection.query("UPDATE products SET stock_quantity =" + (chosenItem.stock_quantity - parseInt(answer.productUnits)) + " WHERE item_id =" + chosenItem.item_id, function (err, res) {
                            if (err) throw err;

                        })
                        console.log("\nComin' right up, hun! That's gonna run you $" + answer.productUnits * chosenItem.price + ".\nPurchase Successfull!!\n")

                        inquirer.prompt([
                            {
                                name: "anotherPurchase",
                                type: "confirm",
                                message: "Would you like to make another purchase?",

                            },
                        ])
                            .then(function (answer) {
                                if (answer.anotherPurchase === true) {
                                    productSelect();
                                } else {
                                    console.log("\nAlright then, dear. Thanks for shoppin'. You have yourself a good one!\n")
                                    connection.end();
                                }

                            })
                    })
            })
    })
}