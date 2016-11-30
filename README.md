# CPEN400A Bookstore Application - Group 12

## Running Locally

1. Make sure you have [Node.js](http://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed.

2. Install the application dependencies:
  ```sh
  npm install
  ```
3. Start the Mongo server (if it is not already running):
    ```sh
    sudo mongod
    ```

4. Initialize the Mongo database:
  ```sh
  mongo
  > load("initdb.js")
  ```
  This step can be repeated at any time to reset the database to its initial state.

5. Start the application web server:
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
