DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name  VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT,
  stock_quantity INT,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("product1", "dept1", 20, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("product2", "dept1", 5, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("product3", "dept1", 10, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("product4", "dept2", 25, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("product5", "dept2", 25, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("product6", "dept2", 20, 60);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("product7", "dept2", 200, 80);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("product8", "dept3", 12, 45);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("product9", "dept3", 25, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("product10", "dept3", 40, 10);