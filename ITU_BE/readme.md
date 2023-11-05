# ITU Project Backend

## Description

This backend server is designed to support the ITU project, providing necessary APIs and database functionalities.

### Local Setup

#### Prerequisites

- Docker
- Node.js (with npm)

#### Installation Steps

1. Prepare .env:

   Create a `.env` file and copy the content of .env.example into it

2. Run Docker Compose to set up necessary services:

   ```bash
   $ docker-compose up
   ```

3. Install dependencies:

   ```bash
   $ npm install
   ```

4. Push the database schema using Prisma:

   ```bash
   $ npx prisma db push
   ```

5. Start the server using nodemon:
   ```bash
   $ npx nodemon src/index.ts
   ```

### Accessing the Backend

Once the backend is running, you can access the server at: `http://localhost:3000`

### API Endpoints

The following endpoints are available:

- `GET /api/shops` - Returns list of all shops.
- `POST /api/shops/:id` - Returns detail about a shop with the specific ID.

### Additional Information

Include any other relevant information, environment variables, or configurations here.
