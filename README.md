# ITU

## Repository for ITU project

We have decided to create an application called `SwiftThrift`, which collect data about second-hand shops in our location. It has online market place and local events.

## Team

- Andrej Mokris
- Andrej Nespor
- Veronika Simkova

## Tech Stack

## Install

App is deployed at https://itufe.vercel.app

- Login credentials:
  ```
  email: alice@prisma.io
  password: passwordAlice
  ```

### Backend Setup

1. **Docker Installation:**

   - Install Docker on your system.

2. **Running the Database:**

   - Use `docker-compose up` to start the database.

3. **Environment Variables:**

   - Create a `.env` file with these variables:
     ```
     DATABASE_URL="postgresql://itu_be:itu_be@localhost:5433/itu_be?schema=public"
     PORT=3000
     ```

4. **Database Setup:**

   - Run the following commands:
     ```bash
     npm i
     npx prisma db push
     npx prisma db seed
     ```

5. **Running the Backend Server:**
   - Start the server using:
     ```bash
     npx nodemon src/index.ts
     ```

### Frontend Setup

1. **Running the Database:**

   - Use `npm i` to install dependencies.

2. **Environment Variables:**

   - Create a `.env` file with these variables:
     ```
     VITE_API_URL="http://localhost:3000"
     ```

3. **Running the Frontend:**
   - Start the server using:
     ```bash
     npm run dev
     ```
