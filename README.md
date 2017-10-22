# demo

> Demo for homeyantra.com project

## Build Setup

``` bash
# install dependencies
npm install
# Create database with following credentials

CREATE DATABASE product_db;
CREATE USER 'myuser'@'%' IDENTIFIED BY 'mypass';
GRANT CREATE, SELECT, INSERT, UPDATE, DELETE, ALTER, INDEX, DROP, REFERENCES ON product_db.* to 'myuser'@'%';
Note: please use the following credentials as that is what is used in the code too.

# run knex migration
DEBUG=knex:query,knex:bindings,knex:tx knex migrate:latest --knexfile config/knexfile.js
# run knex seeds file
DEBUG=knex:query,knex:bindings,knex:tx knex seed:run --knexfile config/knexfile.js

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# serve production build
npm run prod

```
