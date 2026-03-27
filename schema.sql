DROP TABLE IF EXISTS customers;

CREATE TABLE
    customers (
        id INTEGER PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
	role TEXT DEFAULT NULL,
        dynamic_entity TEXT CHECK (json_valid (dynamic_entity)),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

