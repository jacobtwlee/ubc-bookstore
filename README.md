# CPEN400A Bookstore Application - Group 12

## Running Locally

1. Make sure you have [Node.js](http://nodejs.org/) installed.
2. Install dependencies:
  ```sh
  npm install
  ```

3. Initialize the Mongo database:
  ```sh
  mongo
  > load("initdb.js")
  ```
  This step can be repeated at any time to reset the database to it's initial state.

4. Start the server:
  ```sh
  npm start
  ```

The application should now be running at [localhost:5000](http://localhost:5000/).

**NOTE:**
In order to access the application a valid username is required to authenticate.
The following usernames are valid (case sensitive):
- jacob
- bernadette
- xueqin
- abraham
