# TechHunt 2020 ⌨️

MVP employee salary management web application to manage employees' salaries

## Folder Structure

Frontend code (react, css, js) will be in `client` directory. Backend Node.js/Express code will be in the `server` directory.

## Getting Started

Make sure you have docker-compose version >= `3.7` and Docker version >= `19.03.8` installed. Then run:

```bash
docker-compose up
```

Docker-compose will spin up a `mysql` database container. Next, the backend server written in `Nodejs` will be created and connected to the database. Lastly, a container for the frontend written in `React` will then be connected to the backend.

Once the setup is complete, the local version of the app can be accessed on your browser via `localhost:3000`. The backend will listen on port `3001`, and the database is listening on port `3306`.

## Others/Available Scripts

In the client directory, you can run:

```bash
`npm start`
```

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

In the server directory, you can run:

```bash
`npm start`
```

Perform the migration using the models created and start the server.

```bash
`npm run test`
```

Launches the test using mocha. First it performs a migration, seed the database with 50 random employees and lastly runs the test suite. Test files are available in `./server/test`

```bash
`sequelize db:seed:all`
```

Seeds the database of 50 employees using faker. Code can be found in `./server/seeders`

## Assumptions

1. CSV file must be in order of id, login, name salary
2. Database design: Decided to make a seperate table for salary for future extensibility, as it is afterall a salary management app, although it might not be necessary for the current scope.
3. In the frontend, after editting an employee, it will not sort again until you re-fetch.
