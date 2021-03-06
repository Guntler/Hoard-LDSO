﻿
---DROP previous tables---
DROP TABLE IF EXISTS userAccount CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS favoriteProduct CASCADE;
DROP TABLE IF EXISTS editRequest CASCADE;
DROP TABLE IF EXISTS productCategory CASCADE;
DROP TABLE IF EXISTS viewedProducts CASCADE;

DROP TYPE IF EXISTS editStatus CASCADE;
DROP TYPE IF EXISTS userType CASCADE;
DROP TYPE IF EXISTS editType CASCADE;

CREATE TYPE editStatus AS ENUM ('Approved', 'Denied', 'Pending');
CREATE TYPE userType AS ENUM ('User', 'Manager', 'Admin');
CREATE TYPE editType AS ENUM ('Add', 'Delete', 'Edit');

CREATE TABLE userAccount (
	userID SERIAL PRIMARY KEY,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(256),
	permissions userType DEFAULT 'User',
	registerDate TIMESTAMP NOT NULL,
	CHECK (char_length(password) <= 256),
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
	name VARCHAR(200) NOT NULL,
	link VARCHAR(500) NOT NULL,
	imageName VARCHAR(128) NOT NULL, -- Images will be placed in folders with this structure: productImages/<productID>/<imageNameAsInsertedByUser>
	category INTEGER NOT NULL REFERENCES productCategory(categoryID),
	visible BOOLEAN NOT NULL DEFAULT false,
	addedBy INTEGER NOT NULL REFERENCES userAccount(userID),
	dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CHECK (char_length(name) <= 200),
	CHECK (char_length(link) <= 500),
	CHECK (dateAdded <= now())
);

CREATE TABLE favoriteProduct (
	productID INTEGER NOT NULL REFERENCES product(productID),
	userID INTEGER NOT NULL REFERENCES userAccount(userID),
	position INTEGER NOT NULL DEFAULT 0,
	visible BOOLEAN NOT NULL DEFAULT true,
	lastFavorited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(productID, userID),
	CHECK (lastFavorited <= now())
);

CREATE TABLE viewedProducts (
	productID INTEGER NOT NULL REFERENCES product(productID),
	userID INTEGER NOT NULL REFERENCES userAccount(userID)
);

-- description: Link', 'Name', 'Category' --
CREATE TABLE editRequest (
	requestID SERIAL PRIMARY KEY,
	productID INTEGER NOT NULL REFERENCES product(productID),
	submittedBy INTEGER NOT NULL REFERENCES userAccount(userID),
	approvedBy INTEGER REFERENCES userAccount(userID),
	editType editType NOT NULL,
	editStatus editStatus NOT NULL DEFAULT 'Pending',
	name VARCHAR(200),
	link VARCHAR(500),
	imageName VARCHAR(128),
	category INTEGER REFERENCES productCategory(categoryID),
	reason VARCHAR(500),
	editDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CHECK (char_length(reason) <= 500),
	CHECK (editdate <= now())
);

INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES ('u1@u.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-16 10:47:58.848157');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES ('u2@u.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-16 10:48:04.060251');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES ('u3@u.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-16 10:48:08.701495');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES ('u4@u.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-16 10:48:13.491823');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES ('u5@u.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-16 10:48:17.349188');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES ('u6@u.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-16 10:48:23.721266');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES ('m1@m.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'Manager', '2014-11-16 10:49:06.357659');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES ('m2@m.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'Manager', '2014-11-16 10:49:12.52281');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES ('a1@a.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'Admin', '2014-11-16 10:48:47.539946');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES ('a2@a.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'Admin', '2014-11-16 10:48:52.146526');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES ('john@gmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-16 10:48:52.146526');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('carl@gmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-26 07:09:26.437094');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('edward@gmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-26 07:12:57.075868');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('jenny@hotmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-26 07:13:17.129835');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('rita@hotmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-26 07:13:41.050094');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('sophie@hotmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-26 07:14:04.921311');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('sara@hotmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-26 07:14:18.252455');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('peter@gmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-26 07:14:30.736518');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('robert@gmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-26 07:15:25.930057');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('william@gmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'User', '2014-11-26 07:15:37.343716');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('furioushoarder@gmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'Manager', '2014-11-26 07:22:46.222557');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('passivehoarder@gmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'Manager', '2014-11-26 07:23:06.991572');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('maximilian@gmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'Admin', '2014-11-26 07:24:15.703965');
INSERT INTO useraccount (email, password, permissions, registerDate) 
VALUES('maximus@gmail.com', '$2a$10$QyPC0BDsULAM9yrTKLn5/u1EfeuGbryoPk8D/My0OndWAggY8cf26', 'Admin', '2014-11-26 07:24:37.441744');


INSERT INTO productCategory (categoryName) VALUES ('Gadgets');
INSERT INTO productCategory (categoryName) VALUES ('Home & Office');
INSERT INTO productCategory (categoryName) VALUES ('Tools');
INSERT INTO productCategory (categoryName) VALUES ('Books');
INSERT INTO productCategory (categoryName) VALUES ('Clothes & Apparel');
INSERT INTO productCategory (categoryName) VALUES ('Toys');
INSERT INTO productCategory (categoryName) VALUES ('Food');
INSERT INTO productCategory (categoryName) VALUES ('Technology');
INSERT INTO productCategory (categoryName) VALUES ('Other');

INSERT INTO product (name, link, imageName, category, visible, addedBy, dateAdded)
VALUES ('Infectious Disease Ball', 'http://www.thinkgeek.com/product/e8f1/',
 'e8f1_disease_stress_balls.gif', 2, true, 7, '2001-02-16 20:38:40');

INSERT INTO product (name, link, imageName, category, visible, addedBy, dateAdded)
VALUES ('Flux Capacitor USB Car Charger', 'http://www.thinkgeek.com/product/1dbd/',
 '1dbd_flux_capacitor_car_charger.gif', 1, true, 8, '2001-02-16 20:38:40');

INSERT INTO product (name, link, imageName, category, visible, addedBy, dateAdded)
VALUES ('Star Wars Force FX Removable Blade Lightsabers', 'http://www.thinkgeek.com/product/e26d/',
 'e26d_star_wars_removable_blade_lightsabers_anim.gif', 6, true, 9, '2001-02-16 20:38:40');

INSERT INTO product (name, link, imageName, category, visible, addedBy, dateAdded)
VALUES ('Optimus Popularis Keyboard', 'http://www.thinkgeek.com/product/181d/',
 '181d_optimus_popularis_keyboard.jpg', 6, true, 9, '2001-02-16 20:38:40');

INSERT INTO product (name, link, imageName, category, visible, addedBy, dateAdded)
VALUES ('Light Show Fountain Speakers', 'http://www.thinkgeek.com/product/f188/',
 'f188_lightshow_fountain_speakers.gif', 1, true, 7, '2001-02-16 20:38:40');

INSERT INTO product (name, link, imageName, category, visible, addedBy, dateAdded)
VALUES ('The Unicorn Head Mask', 'http://www.thinkgeek.com/product/1107/',
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

--- Description: Link, Name, Type, Category---