
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
	name VARCHAR(200) UNIQUE NOT NULL,
	price REAL NOT NULL,
	link VARCHAR(500) UNIQUE NOT NULL,
	imageName VARCHAR(128) UNIQUE NOT NULL, -- Images will be placed in folders with this structure: productImages/<productID>/<imageNameAsInsertedByUser>
	category INTEGER NOT NULL REFERENCES productCategory(categoryID),
	visible BOOLEAN NOT NULL DEFAULT false,
	addedBy INTEGER NOT NULL REFERENCES userAccount(userID),
	dateAdded TIMESTAMP NOT NULL,
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
	lastFavorited TIMESTAMP NOT NULL,
	PRIMARY KEY(productID, userID),
	CHECK (lastFavorited <= now())
);


-- description: Link', 'Name', 'Price', 'Category' --
CREATE TABLE editRequest (
	requestID SERIAL PRIMARY KEY,
	productID INTEGER NOT NULL REFERENCES product(productID),
	submittedBy INTEGER NOT NULL REFERENCES userAccount(userID),
	approvedBy INTEGER REFERENCES userAccount(userID),
	editType editType NOT NULL,
	editStatus editStatus NOT NULL DEFAULT 'Pending',
	description VARCHAR(300),
	reason VARCHAR(500),
	editDate TIMESTAMP NOT NULL,
	CHECK (char_length(description) <= 300),
	CHECK (char_length(reason) <= 500),
	CHECK (editdate <= now())
);


INSERT INTO useraccount (email, password, permissions, registerDate) VALUES ('u1@u.u', '$2a$10$UB0tKnaxoBHcHiuiWK9KBuD8kJnOWpi8zaimBSEh.s2/95kr5C07K', 'User', '2014-11-16 10:47:58.848157');
INSERT INTO useraccount (email, password, permissions, registerDate) VALUES ('u2@u.u', '$2a$10$YproDzfcCenNfj/NblZpwObBZCVO.E3B76n0uHjAMC8ZIMdO5GJLS', 'User', '2014-11-16 10:48:04.060251');
INSERT INTO useraccount (email, password, permissions, registerDate) VALUES ('u3@u.u', '$2a$10$EEKdpicXJQWYeJOXCp8BqOpUNvRFhEs.jePCKVGEDlNrpqTMluP2a', 'User', '2014-11-16 10:48:08.701495');
INSERT INTO useraccount (email, password, permissions, registerDate) VALUES ('u4@u.u', '$2a$10$rZltWBAut6dggRxn0HtqKuFklHe7YLO9fkfyVY4wubCohTvjVumUm', 'User', '2014-11-16 10:48:13.491823');
INSERT INTO useraccount (email, password, permissions, registerDate) VALUES ('u5@u.u', '$2a$10$QUJXyqsHfwaIDRxOeXeNQOMMdV/bnFbD8fS6svlvNuYrAz7kufmSi', 'User', '2014-11-16 10:48:17.349188');
INSERT INTO useraccount (email, password, permissions, registerDate) VALUES ('u6@u.u', '$2a$10$ZjG8PT4Scuphuyqs7czhwOVwklP2NjB2t6hv4G.RcW2FdTi8TCht6', 'User', '2014-11-16 10:48:23.721266');
INSERT INTO useraccount (email, password, permissions, registerDate) VALUES ('m1@m.m', '$2a$10$XEHeS6NuZkMbCqrv2M1DseQs74WItW0Dg5sRQUrvmEPrf37XGjdai', 'Manager', '2014-11-16 10:49:06.357659');
INSERT INTO useraccount (email, password, permissions, registerDate) VALUES ('m2@m.m', '$2a$10$2MNlG0MX8/TkcaGONkkLsedSb9Wwqjk1HcrjPPju74JNDLsFbKp.u', 'Manager', '2014-11-16 10:49:12.52281');
INSERT INTO useraccount (email, password, permissions, registerDate) VALUES ('a1@a.a', '$2a$10$uyvVXDZfKQNamvu6qgIGIe9pyMOxDvC2zO7iq2cmw1YmQ0qwgAPZC', 'Admin', '2014-11-16 10:48:47.539946');
INSERT INTO useraccount (email, password, permissions, registerDate) VALUES ('a2@a.a', '$2a$10$uL0PVKWF2jXZk6gLd2o8uuonJcbEh7ARGfsPTYyAeM.3HoYoJpAGO', 'Admin', '2014-11-16 10:48:52.146526');

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

--- Description: Link, Name, Type, Category---
INSERT INTO editRequest (productID, submittedBy, approvedBy, editType, editStatus, reason, editDate) VALUES (1, 7, NULL, 'Delete', 'Pending', 'Crappy product. May cause Ebola epidemic.', '2001-02-15 20:38:40');
INSERT INTO editRequest (productID, submittedBy, approvedBy, editType, editStatus, reason, editDate) VALUES (2, 7, 9, 'Delete', 'Denied', 'Caused Legionella epidemic.', '2001-02-15 21:38:40');
INSERT INTO editRequest (productID, submittedBy, approvedBy, editType, editStatus, description, reason, editDate) VALUES (3, 8, NULL, 'Edit', 'Pending', 'Price, Category', 'Product was inserted in the wrong category with the wrong price', '2001-02-11 20:38:40');
INSERT INTO editRequest (productID, submittedBy, approvedBy, editType, editStatus, description, reason, editDate) VALUES (4, 8, 9, 'Edit', 'Approved', 'Name', 'Name product was missing.', '2001-02-16 20:38:40');
INSERT INTO editRequest (productID, submittedBy, approvedBy, editType, editStatus, description, reason, editDate) VALUES (5, 8, NULL, 'Edit', 'Pending', 'Link', 'Product number was missing.', '2001-02-17 20:38:40');
