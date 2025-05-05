# Getting Started with Smart Notes App

This is Project is create to demonstrate MERN Stack App and also using Transformer models from Hugging Face

## How to start the App

### - Frontend

In the project directory, you can run:

#### `npm i`

then

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### - Backend

Firstly you need to have MongoDB 8.0 Community Edition installed on device
then you can start ther server by either

#### `mongod`

or

#### `brew services start mongodb-community@8.0` (for macOS)

then you can cd into the server directory and then

- Also don't forget to add Hugging face token in the dot env file to run the Transformer models locally

#### `npm i`

then

#### `nodemon start`

Launches the backend server and then you can interact the with the app
