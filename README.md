# Backend

This directory contains the backend code for the e-commerce application. It is built with Node.js, Express, and PostgreSQL.

## Getting Started

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```makefile
PORT=3000
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
JWT_SECRET=<your_jwt_secret>
```

4. Start the development server

```bash
npm run dev
```
