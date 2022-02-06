# Swagger API documentation for rides

## Setup

1. Ensure `node (>8.6 and <= 10)` and `npm` are installed
2. Use `cd src/swagger` to navigate to the swagger directory
3. Run `npm install`
4. Run `npm start`
5. Navigate to `localhost:4000/api-docs` to access the documentation page

## Overview

For this exercise, instead of using sqlite, which usually requires a separate software to "take a look" inside the database, a simple json file was used to allow easier and immidiate access to the contents of the database. Almost all of the fields of the database were derived from the `src/server/schemas.js` file. An additional field was added to store when the rides were last modified.

The swagger was developed based on the server APIs (src/server/app.js), but it was extended to include all CRUD operations. All API calls can be tested through the swagger, while the database file (src/swagger/db.json) can be used to check whether the APIs work as expected or not.

More specifically, there is one API to check the status of the server, one API to add new rides to the database, two APIs to retrieve the rides (one with pagination and on with the use of the ride id), one API to update the rides and another one to delete them. There was another API call which returned all the rides but it was replaced by the pagination.

## Feedback

This was a great opportunity to learn how to create swagger documentations for APIs. I didn't have the chance to work with swagger in the past, but it looks like a great tool for documentations, I will keep it in mind for my future projects.