#### Install project
```
npm install
```

#### Run SQL
```
npx wrangler d1 execute mydb --local --env development --file=./schema.sql
```

By default role is 'USER'. To setup for admin need to setup manually in db.
