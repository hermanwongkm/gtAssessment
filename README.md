# TechHunt 2020 ⌨️

MVP employee salary management web application to manage employees' salaries

## Screen Captures

<p align="center">
    <img src="Examples/demo.gif" alt="Image" width = "46%" height = "100%" align = "center" />
</p>

## Folder Structure

Frontend code (react, css, js) will be in `client` directory. Backend Node.js/Express code will be in the `server` directory.

In the `examples` folder, one can find a couple of sample CSVs with valid and invalid columns as well as a postman collections to test the endpoints.

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
`npm run start`
```

Perform the migration using the models created and start the server.

```bash
`npm run test`
```

Launches the test using mocha. First it performs a migration, seed the database with 50 random employees and lastly runs the test suite. Test files are available in `./server/test`

Note: You can comment out as client and server code in docker-compose file to run the database if needed or use your own local mysql server and change the credentials in test in config file. I did not create another container for test.

```bash
`sequelize db:seed:all`
```

Seeds the database of 50 employees using faker. Code can be found in `./server/seeders`

## Assumptions

1. CSV file must be in order of id, login, name salary
2. If another CSV file is being uploaded, returns status code 400 with payload: `message: "Another file is still being uploaded"` by using multex.
3. Database design: Decided to make a seperate table for salary for future extensibility, as it is afterall a salary management app, although it might not be necessary for the current scope.
4. In the frontend, after editting an employee, it will not sort again until you re-fetch.
5. On the frontend, when i delete an employee, it will not refetch, and thus will show only 29 out of 30 employees. Thus there might be some werid behavior if there is too many deletion. The solution I would have used was to use `findAndCountAll` in sequelize during the initial search. This way, i will know how many records is there, when scrolling i.e. pressing the left/right arrow and the perform a refetch. I did not do this because i wanted to conform to the results returned for automated testing as i would have returned an additional field. In addition, i might use a state management tool like redux to store previously fetched data as I do not want to hit the database everytime i scrolled back, as sending so many http request might be a bad practice. 

   Authored by Herman Wong
