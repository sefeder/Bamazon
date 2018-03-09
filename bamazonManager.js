var mysql = require('mysql');
var inquirer = require('inquirer');
var cTable = require('console.table');
var colors = require('colors');

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
    start();
});

function start() {
    console.log('\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-'.yellow+'\nWelcome to Bamazon Manager View'.blue+'\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-\n'.yellow)
    inquirer.prompt([
        {
            name: "managerSelect",
            type: "list",
            choices: ["View products currently for sale", "View products with low inventory", "Restock inventory", "Add a new product to sell", "Exit manager view"],
            message: "What would you like to do, Manager? (Use arrow keys to select)",
            pageSize: 10,
        },
    ])
    .then(function (answer) {
        if (answer.managerSelect === "View products currently for sale") {
            viewProducts();
        } else if (answer.managerSelect === "View products with low inventory") {
            viewInventory();
        } else if (answer.managerSelect === "Restock inventory") {
            restockInventory();
        } else if (answer.managerSelect === "Add a new product to sell") {
            addNewProduct();
        } else {
            console.log("\nAlright then, Manager. Thanks for stopin' by. You have yourself a good one!\n")
            connection.end()
        }
        
    });
};

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err
        console.log("");
        console.table(res);
        console.log("");
        inquirer.prompt([
            {
                name: "anythingElse",
                type: "confirm",
                message: "Would you like to do anything else?"
            },
        ])
        .then(function (answer) {
            if (answer.anythingElse === true) {
                start();
            } else {
                console.log("\nAlright then, Manager. Thanks for stopin' by. You have yourself a good one!\n")
                connection.end();
            }
        })
    })
}

function viewInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<" + 5, function (err, res) {
        if (err) throw err

        if (res[0] === undefined) {
            console.log("\nLooks like you're in good shape! You don't have any products with a stock quantity less than 5!\n".green);
            inquirer.prompt([
                {
                    name: "anythingElse",
                    type: "confirm",
                    message: "Would you like to do anything else?"
                },
            ])
            .then(function (answer) {
                if (answer.anythingElse === true) {
                    start();
                } else {
                    console.log("\nAlright then, Manager. Thanks for stopin' by. You have yourself a good one!\n")
                    connection.end();
                }
            })
                    
        } else {
            console.log("\n     You'll need to restock these products soon (they have a stock quantity lower than 5):\n".yellow);
            console.table(res);
            console.log("");
            inquirer.prompt([
                {
                    name: "anythingElse",
                    type: "confirm",
                    message: "Would you like to do anything else?"
                },
            ])
            .then(function (answer) {
                if (answer.anythingElse === true) {
                    start();
                } else {
                    console.log("\nAlright then, Manager. Thanks for stopin' by. You have yourself a good one!\n")
                    connection.end();
                }
            })
        }
    })
}

function restockInventory() {
    connection.query("SELECT product_name, item_id, price, stock_quantity FROM products", function (err, results) {
        if (err) throw err;
        var choiceArray = [];
        inquirer.prompt([
            {
                name: "productSelect",
                type: "list",
                choices: function () {
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name + " | " + "Current stock quantity: " + results[i].stock_quantity);
                    }
                    return choiceArray;

                },
                message: "Which product would you like to restock? (Use arrow keys to select)",
                pageSize: 20,
            },
        ])
        .then(function (answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (choiceArray.indexOf(answer.productSelect) === i) {
                    chosenItem = results[i];
                }
            }
            inquirer.prompt([
                {
                    name: "productUnits",
                    type: "input",
                    message: "Restock with what quantity?",
                    validate: function (value) {
                        if (isNaN(value) === false && value < 1000 && value > 0) {
                            return true;
                        } else if (isNaN(value) === false && value > 999 && value > 0) {
                            console.log("\n\nCome on now, we can't buy that many! Pick a reasonable number less than 1000\n".red);
                            return false;
                        } else if (isNaN(value) === false && value < 1000 && value < 1) {
                            console.log("\n\nYou can't restock with nothing or negative amounts!\n".red)
                            return false;
                        } else {
                            console.log("\n\nWhat kinda number is that, Sir?!\n".red)
                            return false;

                        }
                    }
                },

            ])
            .then(function (answer) {

                connection.query("UPDATE products SET stock_quantity =" + (chosenItem.stock_quantity + parseInt(answer.productUnits)) + " WHERE item_id =" + chosenItem.item_id, function (err, res) {
                    if (err) throw err;

                })
                console.log("\nAlright, we'll get right on that.\n You now have " + (chosenItem.stock_quantity + parseInt(answer.productUnits)) + " of those!"+"\n\nRestock Successfull!!\n".green)

                inquirer.prompt([
                    {
                        name: "anotherRestock",
                        type: "confirm",
                        message: "Would you like to restock anything else?",

                    },
                ])
                .then(function (answer) {
                    if (answer.anotherRestock === true) {
                        restockInventory();
                    } else {
                        inquirer.prompt([
                            {
                                name: "anythingElse",
                                type: "confirm",
                                message: "Would you like to do anything else?"
                            },
                        ])
                        .then(function (answer) {
                            if (answer.anythingElse === true) {
                                start();
                            } else {
                                console.log("\nAlright then, Manager. Thanks for stopin' by. You have yourself a good one!\n")
                                connection.end();
                            }
                        })
                    }
                })
            })
        })
    })
}

function addNewProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What new product would you like to add?",
        },
        {
            name: "department",
            type: "input",
            message: "What department will sell that product?",
        },
        {
            name: "price",
            type: "input",
            message: "How much should it cost?",
            validate: function (value) {
                if (isNaN(value) === false && value < 1000000 && value > 0) {
                    return true;
                } else if (isNaN(value) === false && value > 999999 && value > 0) {
                    console.log("\n\nCome on now, we can't sell them for that much! Pick a reasonable number less than $1,000,000.\n".red);
                    return false;
                } else if (isNaN(value) === false && value < 1000000 && value < 1) {
                    console.log("\n\nYou can't charge people nothing or negative amounts. We need to make a profit!\n".red)
                    return false;
                } else {
                    console.log("\n\nWhat kinda number is that, Sir?!\n".red)
                    return false;

                }
            }
        },
        {
            name: "stock",
            type: "input",
            message: "How many would you like to start out with in your inventory?",
            validate: function (value) {
                if (isNaN(value) === false && value < 1000 && value > 0) {
                    return true;
                } else if (isNaN(value) === false && value > 999 && value > 0) {
                    console.log("\n\nCome on now, we can't buy that many! Pick a reasonable number less than 1000.\n".red);
                    return false;
                } else if (isNaN(value) === false && value < 1000 && value < 1) {
                    console.log("\n\nYou can't stock your inventory with nothing or negative amounts!\n".red)
                    return false;
                } else {
                    console.log("\n\nWhat kinda number is that, Sir?!\n".red)
                    return false;

                }
            }
        },
    ])
    .then(function (answer) {
        connection.query("INSERT into products (product_name, department_name, price, stock_quantity) VALUES ('" + answer.name + "', '" + answer.department + "', " + answer.price + ", " + answer.stock + ")", function (err, results) {
            if (err) throw err;
            console.log('\nYou successfully added '.green + answer.name + ' to your inventory!!\n'.green)

            inquirer.prompt([
                {
                    name: "anotherProduct",
                    type: "confirm",
                    message: "Would you like to add another new product?",

                },
            ])
            .then(function (answer) {
                if (answer.anotherProduct === true) {
                    addNewProduct();
                } else {
                    inquirer.prompt([
                        {
                            name: "anythingElse",
                            type: "confirm",
                            message: "Would you like to do anything else?"
                        },
                    ])
                    .then(function (answer) {
                        if (answer.anythingElse === true) {
                            start();
                        } else {
                            console.log("\nAlright then, Manager. Thanks for stopin' by. You have yourself a good one!\n")
                            connection.end();
                        }
                    })
                }
            })
        })
    })
}


