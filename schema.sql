DROP TABLE IF EXISTS customers;

CREATE TABLE
    customers (
        id INTEGER PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        dynamic_entity TEXT CHECK (json_valid (dynamic_entity)),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

DROP TABLE IF EXISTS businesses;

CREATE TABLE
    businesses (
        id INTEGER PRIMARY KEY,
        business_name TEXT NOT NULL,
        business_slug TEXT NOT NULL UNIQUE,
        business_address TEXT NOT NULL,
        business_category TEXT NOT NULL,
        dynamic_entity TEXT CHECK (json_valid (dynamic_entity)),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );