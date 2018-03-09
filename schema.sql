DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name  VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DEC(4,2),
  stock_quantity INT,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bananas", "Grocery", 0.65, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Apples", "Grocery", 1.10, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sweatshirts", "Clothing", 24.99, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("T-Shirts", "Clothing", 19.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sunglasses", "Accesories", 15.50, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Milk", "Grocery", 2.65, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shampoo", "Cosmetics", 9.95, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Body Wash", "Cosmetics", 8.50, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Advil", "Pharmecy", 19.99, 35);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("DayQuil", "Pharmecy", 15.50, 20);