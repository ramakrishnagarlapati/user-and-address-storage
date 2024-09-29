# User and Address Storage Application

This is a simple application that allows users to register with their names and addresses.

## Features

- Register users with names and addresses
- Store user data in a SQLite database
- Check if a user already exists by the name and store their address accordingly

## Technologies

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Deployment**: Render

## Setup Instructions

To run this application locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ramakrishnagarlapati/user-and-address-storage
   cd user-address-storage
   ```
2. **Install dependencies:** Run the following command in the terminal:

```
npm install
```

3. **Start the backend server:** Run the following command to start the server:

```
node server.js
```

The server will run on http://localhost:3000.

4. **Open the frontend:** Open the index.html file in your web browser. You can simply double-click the file

## Running the Application

1. After opening the index.html, you should see a registration form.
2. Fill in the full name and address fields.
3. Click the "Register" button to submit the form.
4. The application will display a success or error message based on the submission outcome.

## API Endpoints

- POST /register: Register a new user and store their address.
  - request body:

```
      {

        "name": "John Doe",
        "address": "123 Main St, Anytown, USA"
        }

```

- GET /users: get all the users in the database

- GET /address/:userId : Retrieve all address of a specific user from the database
