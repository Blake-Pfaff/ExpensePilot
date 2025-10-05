# ExpensePilot 💰

A secure, well-documented REST API that enables users to manage and analyze personal expenses and income. Built with Express.js, PostgreSQL, and modern development practices.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Expense Management**: Create, read, update, and delete expense/income entries
- **Categorization**: Organize transactions with custom categories
- **Financial Reports**: Monthly summaries and category breakdowns
- **Date Filtering**: View transactions within specific date ranges
- **Interactive API Documentation**: Swagger/OpenAPI documentation
- **Comprehensive Testing**: Unit and integration tests with Jest
- **Containerized Deployment**: Docker and Docker Compose setup

## 🛠 Tech Stack

| Layer                 | Technology                   | Description                       |
| --------------------- | ---------------------------- | --------------------------------- |
| **Backend Framework** | Express.js                   | REST API foundation               |
| **ORM**               | Prisma                       | Database modeling & migrations    |
| **Database**          | PostgreSQL                   | Persistent, relational data store |
| **Authentication**    | JWT (jsonwebtoken)           | Secure, stateless authentication  |
| **Testing**           | Jest + Supertest             | Unit & integration testing        |
| **Documentation**     | Swagger (swagger-ui-express) | Interactive API docs              |
| **Deployment**        | Docker + Docker Compose      | Containerized backend + database  |

## 📋 Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Blake-Pfaff/ExpensePilot.git
cd ExpensePilot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/expensepilot?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### 6. Docker Development

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f api
```

## 📚 API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` for interactive API documentation with Swagger UI.

### Authentication Endpoints

| Method | Endpoint             | Description                | Auth Required |
| ------ | -------------------- | -------------------------- | ------------- |
| POST   | `/api/auth/register` | Register new user          | ❌            |
| POST   | `/api/auth/login`    | Log in and receive JWT     | ❌            |
| GET    | `/api/auth/me`       | Get logged-in user profile | ✅            |

### Expense Management

| Method | Endpoint            | Description                 | Auth Required |
| ------ | ------------------- | --------------------------- | ------------- |
| POST   | `/api/expenses`     | Create a new expense/income | ✅            |
| GET    | `/api/expenses`     | Get all user expenses       | ✅            |
| GET    | `/api/expenses/:id` | Get single expense by ID    | ✅            |
| PUT    | `/api/expenses/:id` | Update an expense           | ✅            |
| DELETE | `/api/expenses/:id` | Delete an expense           | ✅            |

### Categories

| Method | Endpoint              | Description           | Auth Required |
| ------ | --------------------- | --------------------- | ------------- |
| POST   | `/api/categories`     | Create a new category | ✅            |
| GET    | `/api/categories`     | List all categories   | ✅            |
| PUT    | `/api/categories/:id` | Update category       | ✅            |
| DELETE | `/api/categories/:id` | Delete category       | ✅            |

### Reports

| Method | Endpoint                | Description                       | Auth Required |
| ------ | ----------------------- | --------------------------------- | ------------- |
| GET    | `/api/reports/monthly`  | Get monthly income/expense totals | ✅            |
| GET    | `/api/reports/category` | Get spending totals by category   | ✅            |

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🏗 Project Structure

```
expensepilot/
├── src/
│   ├── app.js              # Express application setup
│   ├── server.js           # Server configuration
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── controllers/        # Route controllers
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── docs/              # Swagger documentation
├── tests/                 # Test files
├── Dockerfile             # Container configuration
├── docker-compose.yml     # Multi-container setup
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## 🚢 Deployment

### Production Docker Deployment

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL="postgresql://username:password@db:5432/expensepilot?schema=public"
JWT_SECRET="your-production-secret-key"
PORT=3000
```

## 🔒 Security Features

- JWT-based authentication with secure token management
- Password hashing using bcrypt
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Rate limiting (to be implemented)
- SQL injection prevention through Prisma ORM

## 🗄 Database Schema

### User Model

```prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  expenses  Expense[]
  createdAt DateTime  @default(now())
}
```

### Category Model

```prisma
model Category {
  id        Int       @id @default(autoincrement())
  name      String
  expenses  Expense[]
}
```

### Expense Model

```prisma
model Expense {
  id          Int       @id @default(autoincrement())
  amount      Float
  description String
  type        String    // "income" or "expense"
  date        DateTime  @default(now())
  userId      Int
  categoryId  Int?

  user        User      @relation(fields: [userId], references: [id])
  category    Category? @relation(fields: [categoryId], references: [id])
}
```

## 🧪 Development Workflow

### Phase 1: Initialize Project

- [x] Setup Express, ESLint, Git, Docker
- [x] Add comprehensive dependencies (Prisma, JWT, testing)

### Phase 2: Prisma + DB Setup

- [x] Create schema, migrate DB
- [x] Configure database connection

### Phase 3: Auth System

- [x] Implement Register, Login, JWT middleware
- [x] Password hashing and validation

### Phase 4: Expense + Category CRUD

- [x] Implement main endpoints
- [x] Add input validation

### Phase 5: Reports Module

- [x] Implement aggregation queries
- [x] Add date filtering

### Phase 6: Swagger Docs

- [x] Add route documentation
- [x] Set up API documentation

### Phase 7: Tests

- [x] Write Jest + Supertest coverage
- [x] Add CI/CD pipeline

### Phase 8: Dockerize

- [x] Finalize docker-compose & production build
- [x] Deploy to production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and not licensed for public use.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

---

**ExpensePilot** - Take control of your financial journey! 💪
