# SP - Steelduxx klantenportaal

## Stack

### Frontend

This project was scaffolded on Node 20.11.1 so we recommend using that version.

### Backend

- BellSoft Liberica JDK v17 is recommended to avoid compatibility issues

- Flyway is used to manage database migrations.
  - These migrations are ran every time when the backend starts, when writing migrations make sure to write them in a way that they can be ran multiple times without breaking anything (ex. use `IF (NOT) EXISTS`).
  - Flyway will automatically create a table called `flyway_schema_history` in the database to keep track of which migrations have been ran.
  - Name your migrations `V{version}__{description}.sql` where `{version}` is a number and `{description}` is a description of the migration.

### Database

This project uses a MySQL 8.3.0 database.

## Development

### Frontend

```
cd frontend && npm install && npm run dev
```

### Backend

I personally use IntelliJ IDEA to run the backend during development

### Database

You can use a local MySQL database or fire up a mysql container, make sure its running on port 3306 and the database is named `steelduxxklantenportaal` so you dont need to change the connectionstring

## Docker

Copy .env.template and rename to .env
Complete the env file by filling in passwords

Then use the following command to start containers

```

docker compose up --build -d

```

## Bruno

[Bruno](https://www.usebruno.com/) is a postman alternative to test API endpoints.
Bruno allows you to keep track of requests inside of a collection using git.
You can find the existing collection in bruno folder in the root of the project.

```

```
