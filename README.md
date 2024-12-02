# TechForge

TechForge is a product, user, and sales management system developed with Node.js, Express, and PostgreSQL. The project is designed to provide a RESTful API to manage products, sales receipts, and user information with JWT authentication and password encryption.

# Postman Documentation: 
https://documenter.getpostman.com/view/37745648/2sAYBYfW4J

## Features

- **Product Management:**
  - Product CRUD (Create, Read, Update, Delete).
  - Filtering products by name, category, and sorting.
  - Pagination for product results.

- **User Management:**
  - User registration with unique email validation.
  - Authentication via JWT-based login.
  - User information update (address).

- **Sales Management:**
  - Creation of sales receipts.
  - Retrieve sales receipts by ID.

## Technologies Used

- **Backend:** 
  - Node.js
  - Express
  - PostgreSQL
  - JWT (Json Web Token)
  - bcryptjs (for password hashing)
  - Knex.js (for database interaction)

- **Architecture:**
  - **MVC Architecture:** Controllers, services, and data layers are separated to maintain modular structure and ease of maintenance.
  - **Validation and Authentication:** Input validation and JWT-based authentication for security.

## How to Run the Project

### Prerequisites

1. **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
2. **PostgreSQL**: The project uses PostgreSQL as the database. Ensure you have PostgreSQL installed and running locally.

### Environment Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/TechForge.git
    cd TechForge
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create the `.env` file in the root of the project with the following environment variables:

    ```env
    DB_HOST=localhost
    DB_USER=postgres
    DB_PASSWORD=123
    DB_NAME=BackEnd2
    SECRET_KEY=3e8d4f8a14b5d9c3b3e2e073f85c6193a2d7b82e5f9b42465d722d3f858b9a7c
    API_KEY=3e8d4f8a14b5d9c3b3e2e073f85c6193a2d7b82e5f9b42465d722d3f858b9a7c
    ```

4. Create and configure the database:

    - Ensure the `BackEnd2` database is created in PostgreSQL.
    - Run migrations or scripts to create the tables (depending on your setup).

5. Start the server:

    ```bash
    npm start
    ```

    The server will be running on `http://localhost:3003`.

## API Endpoints

### Products

- **GET** `/product/` - List all products (with pagination).
- **GET** `/product/:productId` - Get a product by ID.
- **POST** `/product` - Create a new product.
- **PATCH** `/product/:productId` - Update a product by ID.
- **DELETE** `/product/:productId` - Delete a product by ID.
- **GET** `/productwithfilter/` - Search products with filters (name, category, sorting).

### Users

- **POST** `/user` - Create a new user.
- **GET** `/user/:id_user` - Get user information by ID.
- **PUT** `/user/:id_user` - Update user address information.
- **POST** `/login` - User login to obtain a JWT token.

### Sales

- **POST** `/sale` - Create a new sales receipt.
- **GET** `/sale/:ReceiptId` - Get a sales receipt by ID.

## Project Structure

```plaintext
TechForge/
│
├── src/
│   ├── app.ts                  # Main server setup
│   ├── controllers/             # Controllers (ProductController, UserController, SaleController)
│   ├── business/               # Business logic (ProductBusiness, UserBusiness, SaleBusiness)
│   ├── data/                   # Database interaction (ProductData, UserData, SaleData)
│   ├── middlewares/            # Middlewares (Authenticator, hashManager, idGenerator)
│   ├── routes/                 # Route definitions (ProductRouter, UserRouter, SaleRouter)
│   ├── types/                  # TypeScript types (Product, User, Receipt)
│   ├── config/                 # Configuration files (connection.ts)
│   ├── index.ts                # Server initialization
│
├── .env                        # Environment variables file
├── package.json                # Project dependencies
└── README.md                   # This file



