# Quickstart

## Node.js
Download and install Node.js: https://nodejs.org/en/

## Installation
Open a terminal and run:
```
npm install
```
(You must do this only once.)

## Add data
This program will automatically generate endpoints for all files located in the directory ./data. This directory contains a sample file, "animals.json"

Setup:

1. Create mock data on https://www.mockaroo.com/
2. Download the mock data as JSON and save it to the folder "data". Rename the file to the entity name, e.g., "person.json". (The file name will be used to generate the endpoints.)

## Run the application
Start the server:
```
npm start
```

Open http://localhost:3000/api in a browser to see a list of all generated endpoints.
    