# Expense Tracker API Reference

Base URL: `http://localhost:8000`

---

## Authentication

### Register

**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "John Doe"
}
```

**Response `201 Created`:**
```json
{
  "id": "uuid-123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

### Login

**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response `200 OK`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## Expenses

> All expense endpoints require `Authorization: Bearer <accessToken>` header.

---

### Get All Expenses

**GET** `/expenses`

**Query Parameters (all optional):**

| Parameter   | Type   | Description                              |
|-------------|--------|------------------------------------------|
| `category`  | string | Filter by category (e.g. `food`)         |
| `startDate` | string | Filter from date (ISO format)            |
| `endDate`   | string | Filter to date (ISO format)              |
| `page`      | number | Page number (default: `1`)               |
| `limit`     | number | Items per page (default: `10`)           |

**Example Request:**
```
GET /expenses?category=food&startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10
```

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "expense-uuid-1",
      "amount": 15.50,
      "category": "food",
      "date": "2024-01-10T00:00:00.000Z",
      "note": "Lunch at cafe",
      "createdAt": "2024-01-10T12:30:00.000Z",
      "updatedAt": "2024-01-10T12:30:00.000Z"
    },
    {
      "id": "expense-uuid-2",
      "amount": 8.00,
      "category": "food",
      "date": "2024-01-12T00:00:00.000Z",
      "note": "Coffee",
      "createdAt": "2024-01-12T09:00:00.000Z",
      "updatedAt": "2024-01-12T09:00:00.000Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10
}
```

---

### Get Expense by ID

**GET** `/expenses/:id`

**Response `200 OK`:**
```json
{
  "id": "expense-uuid-1",
  "amount": 15.50,
  "category": "food",
  "date": "2024-01-10T00:00:00.000Z",
  "note": "Lunch at cafe",
  "createdAt": "2024-01-10T12:30:00.000Z",
  "updatedAt": "2024-01-10T12:30:00.000Z"
}
```

---

### Create Expense

**POST** `/expenses`

**Request Body:**
```json
{
  "amount": 45.00,
  "category": "transport",
  "date": "2024-01-15",
  "note": "Taxi to airport"
}
```

**Available Categories:**
`food` | `transport` | `entertainment` | `health` | `shopping` | `utilities` | `other`

**Response `201 Created`:**
```json
{
  "id": "expense-uuid-3",
  "amount": 45.00,
  "category": "transport",
  "date": "2024-01-15T00:00:00.000Z",
  "note": "Taxi to airport",
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T08:00:00.000Z"
}
```

---

### Update Expense

**PATCH** `/expenses/:id`

**Request Body (all fields optional):**
```json
{
  "amount": 50.00,
  "note": "Taxi to airport (updated)"
}
```

**Response `200 OK`:**
```json
{
  "id": "expense-uuid-3",
  "amount": 50.00,
  "category": "transport",
  "date": "2024-01-15T00:00:00.000Z",
  "note": "Taxi to airport (updated)",
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T09:00:00.000Z"
}
```

---

### Delete Expense

**DELETE** `/expenses/:id`

**Response `200 OK`:**
```json
{
  "message": "Expense deleted successfully"
}
```

---

### Get Expense Summary

**GET** `/expenses/summary`

**Query Parameters (all optional):**

| Parameter   | Type   | Description           |
|-------------|--------|-----------------------|
| `startDate` | string | From date (ISO)       |
| `endDate`   | string | To date (ISO)         |

**Example Request:**
```
GET /expenses/summary?startDate=2024-01-01&endDate=2024-01-31
```

**Response `200 OK`:**
```json
{
  "totalAmount": 320.50,
  "totalCount": 18,
  "byCategory": [
    { "category": "food", "total": 120.00, "count": 10 },
    { "category": "transport", "total": 95.00, "count": 4 },
    { "category": "entertainment", "total": 60.50, "count": 2 },
    { "category": "utilities", "total": 45.00, "count": 2 }
  ]
}
```

---

## Error Responses

All endpoints return errors in this format:

**`400 Bad Request`** — Validation failed
```json
{
  "statusCode": 400,
  "message": ["amount must be a positive number", "category is required"],
  "error": "Bad Request"
}
```

**`401 Unauthorized`** — Missing or invalid token
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**`403 Forbidden`** — Trying to access another user's resource
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

**`404 Not Found`** — Expense not found
```json
{
  "statusCode": 404,
  "message": "Expense not found"
}
```

---

## Data Models

### User
| Field       | Type     | Description              |
|-------------|----------|--------------------------|
| `id`        | string   | UUID                     |
| `email`     | string   | Unique email             |
| `name`      | string   | Display name             |
| `createdAt` | datetime | Account creation date    |

### Expense
| Field       | Type     | Description                    |
|-------------|----------|--------------------------------|
| `id`        | string   | UUID                           |
| `amount`    | float    | Expense amount (positive)      |
| `category`  | string   | One of predefined categories   |
| `date`      | datetime | Date of expense                |
| `note`      | string   | Optional description           |
| `userId`    | string   | Owner's user ID (foreign key)  |
| `createdAt` | datetime | Record creation timestamp      |
| `updatedAt` | datetime | Record last update timestamp   |