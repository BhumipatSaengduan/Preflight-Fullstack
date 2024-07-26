# PF Project

## Table of Contents

1. [Getting Started](#getting-started)
2. [Testing](#testing)
3. [Cleaning](#cleaning)

## Getting Started
1. Start PostgreSQL service

```sh
cd pf-deploy  # cd is a changing directory tool

###################################################
# Handle the `.env.example`. You know what to do. #
###################################################

docker compose pull            # pull all images
docker compose up -d postgres  # starting only postgresql in the background

cd ..  # cd to root project (`..` mean the parent directory)
```

2. Create user and schema for the application.

```sh
docker exec -it g4-db bash  # get inside `g4-db`'s terminal
psql -U postgres -d mydb    # open up the postgres console in the `g4-db`
```

Run these SQL commands: (yes, with the `\q`)
```sql
REVOKE CONNECT ON DATABASE mydb FROM public;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
CREATE USER appuser WITH PASSWORD '1234';
CREATE SCHEMA drizzle;
GRANT ALL ON DATABASE mydb TO appuser;
GRANT ALL ON SCHEMA public TO appuser;
GRANT ALL ON SCHEMA drizzle TO appuser;
\q
```

> `\q` is a postgresql-exclusive command to get out of the postgres console.

```sh
cd ..  # cd to root project
```

3. Migrate all tables to the database.

```sh
cd pf-backend

###################################################
# Handle the `.env.example`. You know what to do. #
###################################################

npm i                # install all libraries that the application will use
                     # `npm i` is a short for `npm install`

npm run db:generate  # generate sql commands for migrating
npm run db:migrate   # running migration to the database

cd ..  # cd to root project
```

4. Start all services

```sh
cd pf-deploy
docker compose up -d --force-recreate  # start all services
```

## Testing

1. Run the project. See [Getting Started](#getting-started).

2. 

```sh
cd pf-testing

###################################################
# Handle the `.env.example`. You know what to do. #
###################################################

npm i         # install all libraries that the application will use
npm run test  # good luck, pray and hope the tests are all passed
```

## Cleaning

This will **stops, removes** the container and volume. (all data) **Run it with caution!**

```sh
docker compose down && docker volume rm preflight_pf-data
```
