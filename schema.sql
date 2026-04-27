DROP TABLE IF EXISTS customers;

CREATE TABLE
	customers
(
	id            INTEGER PRIMARY KEY,
	email         TEXT NOT NULL UNIQUE,
	firstName     TEXT NOT NULL,
	lastName      TEXT NOT NULL,
	password      TEXT NOT NULL,
	role          TEXT     DEFAULT NULL,
	dynamicEntity TEXT CHECK (json_valid(dynamicEntity)),
	createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt     DATETIME DEFAULT CURRENT_TIMESTAMP
);

