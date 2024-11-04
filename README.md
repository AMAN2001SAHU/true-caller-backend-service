## Environment Variables

Create a `.env` file in the root of your project with the following content:

```
|-- src/
| |-- controllers/
| |-- middleware/
| |-- routes/
| |-- prisma/
| |-- schema.prisma
|-- **tests/**
|-- **.env**
|-- jest.config.js
|-- package.json
|-- tsconfig.json
|-- Dockerfile
|-- docker-compose.yml
```
### Add these variables -

DATABASE_URL=""
PORT=3000
JWT_SECRET=""

### Then follow these steps

1.  npm install
2.  npx prisma migrate dev
3.  npx prisma generate
4.  npx prisma db seed
5.  npm run dev

### The API will now be running on http://localhost:3000.

# API Endpoints

- Base Path :- /api/v1

1.  POST /register
2.  POST /login
3.  POST /create-contact (requires authentication)
4.  GET /contacts (requires authentication)
5.  DELETE /delete-contact/:contactId (requires authentication)
6.  GET /search/name?query=<name> (requires authentication)
7.  GET /search/phone?phone=<phoneNumber> (requires authentication)
8.  POST /mark-spam (requires authentication)
9.  GET /spam (requires authentication)

## Some work is needed to be done on Tests and Docker. As of Now they are not working properly. 😅😅
