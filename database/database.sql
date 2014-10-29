
---DROP previous tables---
DROP TABLE IF EXISTS userAccount CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS favoriteProduct CASCADE;
DROP TABLE IF EXISTS editRequest CASCADE;
DROP TABLE IF EXISTS productCategory CASCADE;

DROP TYPE IF EXISTS editStatus CASCADE;
DROP TYPE IF EXISTS userType CASCADE;
DROP TYPE IF EXISTS editType CASCADE;

CREATE TYPE editStatus AS ENUM ('Approved', 'Denied', 'Pending');
CREATE TYPE userType AS ENUM ('User', 'Manager', 'Admin');
CREATE TYPE editType AS ENUM ('Add', 'Delete', 'Link', 'Name', 'Price', 'Category');

CREATE TABLE userAccount (
	userID SERIAL PRIMARY KEY,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(50),
	permissions userType DEFAULT 'User',
	registerDate DATE NOT NULL,
	CHECK (char_length(password) <= 50),
	CHECK (char_length(email) <= 100),
	CHECK (registerdate <= now())
);

CREATE TABLE productCategory (
	categoryID SERIAL PRIMARY KEY,
	categoryName VARCHAR(100) NOT NULL,
	CHECK (char_length(categoryName) <= 100)
);

CREATE TABLE product (
	productID SERIAL PRIMARY KEY,
	name VARCHAR(200) UNIQUE NOT NULL,
	price REAL NOT NULL,
	link VARCHAR(500) UNIQUE NOT NULL,
	imageName VARCHAR(128) UNIQUE NOT NULL, -- Images will be placed in folders with this structure: productImages/<productID>/<imageNameAsInsertedByUser>
	category INTEGER NOT NULL REFERENCES productCategory(categoryID),
	visible BOOLEAN NOT NULL DEFAULT false,
	addedBy INTEGER NOT NULL REFERENCES userAccount(userID),
	dateAdded DATE NOT NULL,
	CHECK (char_length(name) <= 200),
	CHECK (char_length(link) <= 500),
	CHECK (price >= 0),
	CHECK (dateAdded <= now())
);

CREATE TABLE favoriteProduct (
	productID INTEGER NOT NULL REFERENCES product(productID),
	userID INTEGER NOT NULL REFERENCES userAccount(userID),
	position INTEGER NOT NULL DEFAULT 0,
	visible BOOLEAN NOT NULL DEFAULT true,
	lastFavorited DATE NOT NULL,
	PRIMARY KEY(productID, userID),
	CHECK (lastFavorited <= now())
);

CREATE TABLE editRequest (
	requestID SERIAL PRIMARY KEY,
	productID INTEGER NOT NULL REFERENCES product(productID),
	submittedBy INTEGER NOT NULL REFERENCES userAccount(userID),
	approvedBy INTEGER REFERENCES userAccount(userID),
	editType editType NOT NULL,
	editStatus editStatus NOT NULL DEFAULT 'Pending',
	description VARCHAR(300),
	reason VARCHAR(500),
	editDate DATE NOT NULL,
	CHECK (char_length(description) <= 300),
	CHECK (char_length(reason) <= 500),
	CHECK (editdate <= now())
);

INSERT INTO userAccount (email, password, registerDate) VALUES ('a@a.a', 'a', '2001-02-16 20:38:40');
INSERT INTO userAccount (email, password, registerDate) VALUES ('b@b.b', 'b', '2001-02-16 20:38:40');
INSERT INTO userAccount (email, password, registerDate) VALUES ('c@c.c', 'c', '2001-02-16 20:38:40');
INSERT INTO userAccount (email, password, registerDate) VALUES ('d@d.d', 'd', '2001-02-16 20:38:40');
INSERT INTO userAccount (email, password, registerDate) VALUES ('e@e.e', 'e', '2001-02-16 20:38:40');
INSERT INTO userAccount (email, password, registerDate) VALUES ('f@f.f', 'f', '2001-02-16 20:38:40');
INSERT INTO userAccount (email, password, permissions, registerDate) VALUES ('m1@m1.m1', 'm1', 'Manager', '2001-02-16 20:38:40');
INSERT INTO userAccount (email, password, permissions, registerDate) VALUES ('m2@m2.m2', 'm2', 'Manager', '2001-02-16 20:38:40');
INSERT INTO userAccount (email, password, permissions, registerDate) VALUES ('admin@admin.admin', 'admin', 'Admin', '2001-02-16 20:38:40');

INSERT INTO productCategory (categoryName) VALUES ('Gadgets');
INSERT INTO productCategory (categoryName) VALUES ('Home & Office');
INSERT INTO productCategory (categoryName) VALUES ('Tools');
INSERT INTO productCategory (categoryName) VALUES ('Books');
INSERT INTO productCategory (categoryName) VALUES ('Apparel');
INSERT INTO productCategory (categoryName) VALUES ('Toys');

INSERT INTO product (name, price, link, imageName, category, visible, addedBy, dateAdded) 
VALUES ('Infectious Disease Ball', 2.00, 'http://www.thinkgeek.com/product/e8f1/',
 'e8f1_disease_stress_balls.gif', 2, true, 7, '2001-02-16 20:38:40');
INSERT INTO product (name, price, link, imageName, category, visible, addedBy, dateAdded) 
VALUES ('Flux Capacitor USB Car Charger', 24.99, 'http://www.thinkgeek.com/product/1dbd/',
 '1dbd_flux_capacitor_car_charger.gif', 1, true, 8, '2001-02-16 20:38:40');
INSERT INTO product (name, price, link, imageName, category, visible, addedBy, dateAdded) 
VALUES ('Star Wars Force FX Removable Blade Lightsabers', 169.99, 'http://www.thinkgeek.com/product/e26d/',
 'e26d_star_wars_removable_blade_lightsabers_anim.gif', 6, true, 9, '2001-02-16 20:38:40');
INSERT INTO product (name, price, link, imageName, category, visible, addedBy, dateAdded) 
VALUES ('Optimus Popularis Keyboard', 1424.99, 'http://www.thinkgeek.com/product/181d/',
 '181d_optimus_popularis_keyboard.jpg', 6, true, 9, '2001-02-16 20:38:40');
INSERT INTO product (name, price, link, imageName, category, visible, addedBy, dateAdded) 
VALUES ('Light Show Fountain Speakers', 39.99, 'http://www.thinkgeek.com/product/f188/',
 'f188_lightshow_fountain_speakers.gif', 1, true, 7, '2001-02-16 20:38:40');
INSERT INTO product (name, price, link, imageName, category, visible, addedBy, dateAdded) 
VALUES ('The Unicorn Head Mask', 23.99, 'http://www.thinkgeek.com/product/1107/',
 '1107_unicorn_head_mask.jpg', 5, true, 8, '2001-02-16 20:38:40');

INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (1, 1, 1, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (2, 1, 2, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (3, 1, 3, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (4, 1, 4, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (6, 1, 5, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (1, 2, 1, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (3, 2, 2, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (5, 2, 3, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (6, 2, 4, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (2, 3, 1, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (3, 3, 2, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (4, 5, 1, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (6, 5, 2, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (2, 4, 1, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (5, 4, 2, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (6, 6, 1, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (2, 6, 2, true, '2001-02-16 20:38:40');
INSERT INTO favoriteProduct (productID, userID, position, visible, lastFavorited) VALUES (3, 6, 3, true, '2001-02-16 20:38:40');

INSERT INTO editRequest (productID, submittedBy, approvedBy, editType, editStatus, reason, editDate) VALUES (1, 5, NULL, 'Delete', 'Pending', 'Crappy product. May cause Ebola epidemic.', '2001-02-16 20:38:40');

