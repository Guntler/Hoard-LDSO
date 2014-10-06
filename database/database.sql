
---DROP previous tables---
DROP TABLE IF EXISTS useraccount CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS favoriteproduct CASCADE;
DROP TABLE IF EXISTS editrequest CASCADE;
DROP TABLE IF EXISTS productcategory CASCADE;

CREATE TYPE editstatuses AS ENUM ('Approved', 'Denied', 'Pending');
CREATE TYPE usertypes AS ENUM ('User', 'Content Manager', 'Admin');
CREATE TYPE edittypes AS ENUM ('Add', 'Delete', 'Link', 'Name', 'Price', 'Category');

CREATE TABLE useraccount (
	userid SERIAL PRIMARY KEY,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(50),
	permissions usertypes DEFAULT 'User',
	registerdate DATE NOT NULL,
	CHECK (char_length(password) <= 50),
	CHECK (char_length(email) <= 100),
	CHECK (registerdate <= now())
);

CREATE TABLE productcategory (
	categoryid SERIAL PRIMARY KEY,
	categoryname VARCHAR(100) NOT NULL,
	CHECK (char_length(categoryname) <= 100)
);

CREATE TABLE product (
	productid SERIAL PRIMARY KEY,
	name VARCHAR(200) UNIQUE NOT NULL,
	price REAL NOT NULL,
	link VARCHAR(500) UNIQUE NOT NULL,
	category INTEGER NOT NULL REFERENCES productcategory(categoryid),
	visible BOOLEAN NOT NULL DEFAULT false,
	addedby INTEGER NOT NULL REFERENCES useraccount(userid),
	dateadded DATE NOT NULL,
	CHECK (char_length(name) <= 200),
	CHECK (char_length(link) <= 500),
	CHECK (price >= 0),
	CHECK (dateadded <= now())
);

CREATE TABLE favoriteproduct (
	productid INTEGER NOT NULL REFERENCES product(productid),
	userid INTEGER NOT NULL REFERENCES useraccount(userid),
	position INTEGER NOT NULL DEFAULT 0,
	visible BOOLEAN NOT NULL DEFAULT true,
	lastfavorited DATE NOT NULL,
	PRIMARY KEY(productid, userid),
	CHECK (lastfavorited <= now())
);

CREATE TABLE editrequest (
	requestid SERIAL PRIMARY KEY,
	productid INTEGER NOT NULL REFERENCES product(productid),
	submittedby INTEGER NOT NULL REFERENCES useraccount(userid),
	approvedby INTEGER REFERENCES useraccount(userid),
	edittype edittypes NOT NULL,
	editstatus editstatuses NOT NULL DEFAULT 'Pending',
	description VARCHAR(300) NOT NULL,
	justification VARCHAR(500),
	editdate DATE NOT NULL,
	CHECK (char_length(description) <= 300),
	CHECK (char_length(justification) <= 500),
	CHECK (editdate <= now())
);
