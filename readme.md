# 🏦 Ledger Bank Backend Application

## 📌 Overview

Welcome to the **Ledger Bank Backend Application**.

This backend system demonstrates how secure financial transactions work between two accounts. The application focuses on implementing reliable money transfers using MongoDB transactions to ensure data consistency, integrity, and atomic operations.

---

## 🚀 Project Objective

The main objective of this project is to simulate real-world banking transactions where:

- Funds are transferred between two accounts
- Account balances are updated securely
- Transactions are processed atomically
- Data remains consistent even if an error occurs

---

## 🔄 How Transactions Work

This application uses **MongoDB Transactions with Sessions** to guarantee safe database operations.

### 🔹 Transaction Flow

1. **Create Session**
   - A MongoDB session is created before starting a transaction.

2. **Start Transaction**
   - The transaction begins using the created session.
   - All operations are executed within this session context.

3. **Perform Operations**
   - Debit amount from sender's account
   - Credit amount to receiver's account
   - Validate sufficient balance before transfer

4. **Commit Transaction**
   - If all operations succeed, the transaction is committed.
   - Changes are permanently saved to the database.

5. **Abort Transaction**
   - If any error occurs, the transaction is aborted.
   - All changes are rolled back automatically.

6. **End Session**
   - After committing or aborting, the session is properly closed.

---

## 🔐 Why Use MongoDB Transactions?

MongoDB transactions ensure:

- ✅ Atomicity (All operations succeed or fail together)
- ✅ Consistency of account balances
- ✅ No partial updates
- ✅ Safe concurrent operations
- ✅ Data integrity

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **MongoDB Sessions & Transactions**

---

## 📂 Project Structure
