Overview

Project Name: ExpensePilot
Type: Express.js REST API with PostgreSQL, Docker, Documentation, and Tests
Goal: Build a secure, well-documented REST API that enables users to manage and analyze personal expenses and income.

The app will allow users to register, log in, create categories, add expenses/income entries, and view reports summarizing their financial data.

Layer Technology Notes
Backend Framework Express.js REST API foundation
ORM Prisma Simplifies DB modeling & migrations
Database PostgreSQL Persistent, relational data store
Auth JWT (jsonwebtoken) Secure, stateless authentication
Testing Jest + Supertest Unit & integration testing
Documentation Swagger (swagger-ui-express) Interactive API docs
Deployment Docker + Docker Compose Containerized backend + database

expensepilot/
├── src/
│   ├── server.js              # Server entry point
│   ├── app.js                 # Express app configuration
│   ├── config/
│   │   └── database.js        # Database connection
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   ├── docs/                  # Swagger documentation
│   └── prisma/                # Prisma client (auto-generated)
├── prisma/
│   └── schema.prisma          # Database schema
├── tests/                     # Test files
├── .env                       # Environment variables
├── .env.example              # Environment template
├── .eslintrc.js              # ESLint configuration
├── .prettierrc               # Prettier configuration
├── Dockerfile
├── docker-compose.yml
└── README.md

Authentication

As a user, I want to register an account so I can start tracking my expenses.

As a user, I want to log in securely to access my data.

As a user, I want my session to be managed via JWTs for security.

Expenses & Income

As a user, I want to add, edit, and delete expense or income entries.

As a user, I want to categorize my entries for better organization.

As a user, I want to view expenses within a specific date range.

Reports

As a user, I want to view a monthly spending report.

As a user, I want to view spending by category.

As a user, I want to see totals for income and expenses separately.

Method Route Description Auth Required
POST /api/auth/register Register new user ❌
POST /api/auth/login Log in and receive JWT ❌
GET /api/auth/me Get logged-in user profile ✅

POST /api/expenses Create a new expense/income ✅
GET /api/expenses Get all user expenses ✅
GET /api/expenses/:id Get single expense by ID ✅
PUT /api/expenses/:id Update an expense ✅
DELETE /api/expenses/:id Delete an expense ✅

POST /api/categories Create a new category ✅
GET /api/categories List all categories ✅
PUT /api/categories/:id Update category ✅
DELETE /api/categories/:id Delete category ✅

GET /api/reports/monthly Get monthly income/expense totals ✅
GET /api/reports/category Get spending totals by category

model User {
id Int @id @default(autoincrement())
name String
email String @unique
password String
expenses Expense[]
createdAt DateTime @default(now())
}

model Category {
id Int @id @default(autoincrement())
name String
expenses Expense[]
}

model Expense {
id Int @id @default(autoincrement())
amount Float
description String
type String // "income" or "expense"
date DateTime @default(now())
userId Int
categoryId Int?

user User @relation(fields: [userId], references: [id])
category Category? @relation(fields: [categoryId], references: [id])
}

Test Area Framework Example Tests
Authentication Jest + Supertest Register, Login, JWT Validation
Expenses Jest + Supertest CRUD operations, unauthorized access
Categories Jest + Supertest Create, Edit, Delete, List
Reports Jest Monthly summary calculations

Documentation

Use swagger-ui-express to serve /api/docs

Define endpoints in /src/docs/swagger.json

Phase Task Description
1 Initialize Project Setup Express, ESLint, Git, Docker
2 Prisma + DB Setup Create schema, migrate DB
3 Auth System Register, Login, JWT middleware
4 Expense + Category CRUD Implement main endpoints
5 Reports Module Implement aggregation queries
6 Swagger Docs Add route documentation
7 Tests Write Jest + Supertest coverage
8 Dockerize Finalize docker-compose & production build
