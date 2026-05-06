### Getting Started

#### Install project
```
npm install
```

#### Run SQL
```
npx wrangler d1 execute mydb --local --env development --file=./schema.sql
```

Command above will run SQL inside `schema.sql` file

```sql
DROP TABLE IF EXISTS customers;

CREATE TABLE
	customers
(
	id        INTEGER PRIMARY KEY,
	email     TEXT NOT NULL UNIQUE,
	firstName TEXT NOT NULL,
	lastName  TEXT NOT NULL,
	password  TEXT NOT NULL,
	role      TEXT     DEFAULT NULL,
	metadata  TEXT CHECK (json_valid(metadata)),
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
