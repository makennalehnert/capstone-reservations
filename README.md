# Restaurant Reservation System

## Link to Live Application
[reservations-client-ml.herokuapp.com](https://reservations-client-ml.herokuapp.com/)

## Documentation of the API

The API adheres to RESTful conventions. It has the following endpoints & requires all requests to be in JSON format:

### /reservations
##### Accepts GET and POST requests

**GET** requests - must contain either a mobile_number or a data query parameter, i.e. /reservations?mobile_number=xxx-xxx-xxx or /reservations?date=YYYY-MM-DD. Will return an array of reservations matching the search parameters.

**POST** requests - creates a new reservation, requires a set of fields including first_name, last_name, mobile_number, reservation_date, reservation_time, people, and status. Returns the new reservation as saved in the database.

### /reservations/:reservation_id
##### Accepts GET and PUT requests

**GET** requests - returns the single reservation with the requested id. No body is needed in the request.

**PUT** requests - updates the requested reservation, though the request must satisfy the requirements for creating a new reservation including required fields.

### /reservations/:reservation_id/status
##### Accepts PUT requests

**PUT** requests - updates only the status for a given reservation, as when seated, cancelled, or finished.

### /tables
##### Accepts GET and POST requests

**GET** requests - Provides an array including every table.

**POST** requests - Creates a new table, which requires a table_name and a capacity, which must be an integer.

### /tables/:table/seat
##### Accepts PUT and DELETE requests

**PUT** requests - This adds a reservation_id to the table, which indicates which party is seated there.

**DELETE** requests - This removes the reservation_id from the table, and changes the status of the reservation to "finished"


## User Guide
### How to Use the App and it's Functionalities:

#### **Dashboard**
<img width="1271" alt="Screen Shot 2022-01-28 at 3 32 06 PM" src="https://user-images.githubusercontent.com/88870158/151635530-0413175d-3b4d-4279-b1fb-a1483697e1f5.png">
The homepage of the application is the dashboard. The dashboard automatically shows reservations for today's date and gives the user the option to view reservations for other dates by using the "Previous Day" and "Next Day" buttons. It also shows the tables and if a table currently has a reservation assigned to it, it shows the "finish" button which lets the user make the table available. The dashboard also shows a navigation menu on the left side, where the user can go to the search page, new reservation page, new table page, or navigate back to the dashboard. 

#### **Search**
<img width="1269" alt="Screen Shot 2022-01-28 at 3 42 46 PM" src="https://user-images.githubusercontent.com/88870158/151636231-b171eabc-6134-4bc5-a0e1-8894c2b5d47c.png">
The search page allows users to enter a full or partial phone number and find the reservations that match! If a reservation has not been cancelled, finished or already seated, the user will be given the option to "Edit", "Cancel", or "Seat" the reservation.

#### **Edit Reservation**
<img width="1271" alt="Screen Shot 2022-01-28 at 3 46 04 PM" src="https://user-images.githubusercontent.com/88870158/151636418-ec683fda-fdb0-44de-85b1-941b63e1a841.png">
If the user decides to edit a reservation, they will be taken to the edit page where they can edit the information that was previously submitted. They can then change the information and submit it, which will update the reservation details, or cancel and go back to the previous page.

#### **Make a New Reservation**
<img width="1271" alt="Screen Shot 2022-01-28 at 3 48 15 PM" src="https://user-images.githubusercontent.com/88870158/151636554-323e0c96-70ae-4531-9c74-aecbabdc18ca.png">
If the user needs to make a new reservation, they will be taken to the new reservation page where they can fill out the reservation details. They can then either submit the new reservation, or cancel and go back to the previous page.

#### **Add a New Table**
<img width="1271" alt="Screen Shot 2022-01-28 at 3 49 32 PM" src="https://user-images.githubusercontent.com/88870158/151636637-49f9dc0c-ac18-410b-a938-764810e66d18.png">
If the user needs to add a new table, they will be taken to this page, where they can create a new table. They can then either submit the new table, or cancel and go back to the previous page.

## Technology Used
- React
- Javascript
- Node
- Express
- Knex
- PostgreSQL
- HTML
- CSS
- Heroku for Deployment

## Installation Instructions
- You will need node installed on your machine
- Run npm install
- Then, in back-end folder run: 
- npx migrate:latest
- npx knex seed:run
- npm start
- Then run npm start in the front-end folder
