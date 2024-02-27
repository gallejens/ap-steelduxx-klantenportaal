# SP - Steelduxx klantenportaal

## Development

### Frontend

-   Use Node 20.11.1 to avoid compatibility issues

-   Start local server using the following command
    ```
    cd frontend && npm install && npm run dev
    ```

### Backend

-   I personally use IntelliJ IDEA to run the backend during development

-   BellSoft Liberica JDK v17 is recommended to avoid compatibility issues

-   Flyway is used to manage database migrations.
    -   When writing migrations make sure to write them in a way that they can be ran multiple times without breaking anything (ex. use `IF (NOT) EXISTS`).
    -   Flyway will automatically create a table called `flyway_schema_history` in the database to keep track of which migrations have been ran.
    -   Name your migrations `V{version}__{description}.sql` where `{version}` is a number and `{description}` is a description of the migration.

### Database

-   You can run the database in 2 ways
    -   Use a local MySQL 8.3.0 installation
    -   Use a MySQL 8.3.0 container
-   Make sure the database is running on port 3306 and the database is named `steelduxxklantenportaal`

    -   If not, you will need to change the connectionstring in application.properties

-   There is a docker-compose-dev-db provided to start a mysql container for development
    -   Use the following command to start the container
        ```
        docker compose -f docker-compose-dev-db.yaml up -d
        ```
    -   Use the following command to stop the container
        ```
        docker compose -f docker-compose-dev-db.yaml down
        ```

## Staging

-   The staging environment is meant to be used to test the application in a production-like environment but on your local machine
-   Make sure to copy the .env.template file and rename it to .env
    -   Fill in the db password, app_url, letsencrypt email
    -   The file contains comments to help you fill in the correct values
-   Then use the following command to build & start containers
    ```
    docker compose up --build -d
    ```
-   If you use the values suggested in the .env comments, you will be able to access:
    -   The application at https://steelduxx.localhost
    -   The api at https://steelduxx.localhost/api
    -   The Traefik dashboard at https://traefik.localhost

## Production

-   Make sure to copy the .env.template file and rename it to .env

    -   Fill in the db password, app_url, letsencrypt email
    -   The file contains comments to help you fill in the correct values

-   To generate a different Traefik dashboard user password, use the following command

    ```sh
    echo $(htpasswd -nB user) | sed -e s/\\$/\\$\\$/g
    ```

-   Use the following command to build & start containers

    ```
    docker compose up --build -d
    ```

## Bruno

[Bruno](https://www.usebruno.com/) is a postman alternative to test API endpoints.  
Bruno allows you to keep track of requests inside of a collection using git.  
You can find the existing collection in bruno folder in the root of the project.
