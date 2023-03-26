# Hotel-Room-Reservation-Sys

## Descreption
This website manages a room reservation system for a hotel. The system allows users to make reservations for rooms and manage guest information. The website includes features such as check-in and check-out dates, number of guests, room type, and billing information. Users can also add services such as bar and laundry to their reservation, and the website will generate a bill for the services used. The website has a user authentication system that allows different levels of access, with administrators having additional privileges such as managing users and viewing reports.

## Installation:

1. Clone the repository to your local machine.
2. Install the necessary dependencies by running the command 'npm install'.
3. Set up your MySQL database and update the DATABASE_URL environment variable in the datasource block of the Prisma schema file to the URL of your database.
4. Run the command 'npx prisma migrate dev' to create the necessary tables in your database.
## Usage:

- To start the server, run the command 'npm run dev'.
- To access the website, open your web browser and navigate to http://localhost:3000/.
- Users can create an account by providing a username and password.
- Users can then make reservations by selecting the check-in and check-out dates, room type, and number of guests.
- Users can also add services such as bar and laundry to their reservation.
- Administrators can manage users and view reports by logging in with their credentials.
## Dependencies:

- **Prisma** - an ORM for databases that allows you to interact with your database using TypeScript.
- **Express** - a web framework for Node.js that simplifies the process of building web applications.

## Authentication:

This website uses basic authentication with bcrypt to securely store user passwords.

## Database Schema:
![Erd schema](https://github.com/M0Leo/Hotel-Room-Reservation-Sys/blob/master/ERD.png)
