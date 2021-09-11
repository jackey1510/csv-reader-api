## Description

Reading sales records in CSV and then return records in JSON.

## Installation

```bash
$ npm install
```

## Environment variables
Please start a MongoDB service and set the database URL in .env file if you're running locally

```bash
DATABASE_URL=mongodb://localhost:27017/?directConnection=true&serverSelectionTimeoutMS=2000
```

## Running the app

<h3>Local</h3>

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

<h3>Docker</h3>

```bash
docker compose up
```

The app will run on http://localhost:3000 by default

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Example data

```
USER_NAME,AGE,HEIGHT,GENDER,SALE_AMOUNT,LAST_PURCHASE_DATE
John Doe,29,177,M,21312,2020-11-05T13:15:30Z
Jane Doe,32,187,f,5342,2019-12-05T13:15:30+08:00
```

## API Reference
After starting the application, check {{url}}/api for Swagger Hub.
