# PouchPilot API Documentation

## User Routes

### 1. `GET /users/`

- **Description**: Test route for user router.
- **Response**:
  ```json
  "Hello from user router"
  ```

### 2. `POST /users/register`

- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "userName": "user_name!"
  }
  ```
- **Validation**:
  - `email`: Must be a valid email.
  - `password`: Minimum 6 characters.
  - `userName`: Minimum 8 characters, must include at least one special character.
- **Response**:
  ```json
  {
    "message": "User created successfully",
    "user": { "email": "user@example.com", "userName": "user_name!" }
  }
  ```
- **Errors**:
  - `401`: Validation errors.
  - `400`: Missing fields or email already exists.

### 3. `POST /users/login`

- **Description**: Log in a user.
- **Request Body**:
  ```json
  {
    "identifier": "user@example.com",
    "password": "password123"
  }
  ```
- **Validation**:
  - `identifier`: Must not be empty.
  - `password`: Minimum 6 characters.
- **Response**:
  ```json
  {
    "message": "User logged in successfully",
    "user": { "email": "user@example.com", "userName": "user_name!" },
    "token": "jwt_token"
  }
  ```
- **Errors**:
  - `401`: Validation errors.
  - `400`: Invalid credentials or missing fields.

### 4. `GET /users/get-profile`

- **Description**: Get the logged-in user's profile.
- **Headers**: Requires authentication token.
- **Response**:
  ```json
  {
    "user": { "email": "user@example.com", "userName": "user_name!" }
  }
  ```
- **Errors**:
  - `401`: Unauthorized.

### 5. `GET /users/logout`

- **Description**: Log out the user.
- **Headers**: Requires authentication token.
- **Response**:
  ```json
  {
    "message": "User logged out successfully"
  }
  ```
- **Errors**:
  - `401`: Unauthorized.

---

## Product Routes

### 1. `GET /products/`

- **Description**: Fetch all products.
- **Response**:
  ```json
  {
    "products": [
      {
        "name": "Product 1",
        "price": 100,
        "images": ["data:image/png;base64,..."],
        ...
      }
    ],
    "message": "Products fetched successfully"
  }
  ```
- **Errors**:
  - `500`: Internal server error.

### 2. `POST /products/create-product`

- **Description**: Create a new product.
- **Request Body**:
  ```json
  {
    "name": "Product 1",
    "price": "100",
    "description": "Product description",
    "category": "Category",
    "brand": "Brand",
    "stock": "10",
    "bgColor": "#FFFFFF",
    "panelColor": "#000000",
    "textColor": "#FF0000",
    "isActive": "true"
  }
  ```
- **Validation**:
  - `name`, `category`, `brand`, `bgColor`, `panelColor`, `textColor`: Minimum 3 characters.
  - `price`, `stock`: Must be a number.
  - `description`: Minimum 10 characters.
  - `isActive`: Must be a boolean.
- **Response**:
  ```json
  {
    "message": "Product created successfully",
    "product": { "name": "Product 1", ... }
  }
  ```
- **Errors**:
  - `401`: Validation errors.
  - `400`: Missing fields.
  - `500`: Internal server error.

---

## Admin Routes

### 1. `GET /admin/`

- **Description**: Test route for admin router.
- **Response**:
  ```json
  "Hello from admin router"
  ```

### 2. `POST /admin/register`

- **Description**: Register a new admin (only allowed if no admin exists).
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "password123",
    "userName": "admin_name!"
  }
  ```
- **Validation**:
  - `email`: Must be a valid email.
  - `password`: Minimum 6 characters.
  - `userName`: Minimum 8 characters, must include at least one special character.
- **Response**:
  ```json
  {
    "message": "Admin created successfully",
    "admin": { "email": "admin@example.com", "userName": "admin_name!" }
  }
  ```
- **Errors**:
  - `401`: Validation errors.
  - `400`: Missing fields or email already exists.
  - `503`: Admin creation not allowed.

### 3. `POST /admin/login`

- **Description**: Log in an admin.
- **Request Body**:
  ```json
  {
    "identifier": "admin@example.com",
    "password": "password123"
  }
  ```
- **Validation**:
  - `identifier`: Must not be empty.
  - `password`: Minimum 6 characters.
- **Response**:
  ```json
  {
    "message": "Admin logged in successfully",
    "admin": { "email": "admin@example.com", "userName": "admin_name!" },
    "token": "jwt_token"
  }
  ```
- **Errors**:
  - `401`: Validation errors.
  - `400`: Invalid credentials or missing fields.

### 4. `GET /admin/get-profile`

- **Description**: Get the logged-in admin's profile.
- **Headers**: Requires authentication token.
- **Response**:
  ```json
  {
    "admin": { "email": "admin@example.com", "userName": "admin_name!" }
  }
  ```
- **Errors**:
  - `401`: Unauthorized.

### 5. `GET /admin/logout`

- **Description**: Log out the admin.
- **Headers**: Requires authentication token.
- **Response**:
  ```json
  {
    "message": "Admin logged out successfully"
  }
  ```
- **Errors**:
  - `401`: Unauthorized.
