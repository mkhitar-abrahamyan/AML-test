# Task Overview

The goal is to create a full-stack expense tracking application, where users can register, log in,
and track their expenses. The app will allow users to add expenses, view their expense history,
filter by category or date range, and see their total expenses over time. The application must be
built with modern technologies and best practices.

## Key Features

### 1. User Authentication
- **Registration/Login:** Users must be able to register, log in.

### 2. Expense Management
- **Add Expenses:** Users should be able to add daily expenses, including details like amount, category, date, and a note. This data should be stored in the database.
- **Edit/Delete Expenses:** Users should be able to modify or delete their previous expenses.
- **Expense Categories:** Provide pre-defined categories (e.g., food, transport, entertainment) for users to select while adding an expense.

### 3. Expense Overview
- **Total Expenses:** Display the total sum of all expenses within a given time frame.
- **Expense Filtering:** Users should be able to filter expenses by date range and category.

### 4. Security
- **Authentication Guards:** Use Next.js middleware to protect frontend routes from unauthorized access, and implement authentication guards in the NestJS backend to ensure that restricted API endpoints cannot be accessed without proper authentication.

### 5. Design
- The application should use a simple and clean design, focusing on functionality rather than complex UI.
