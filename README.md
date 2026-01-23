# 🏦 Banking Audit Engine

Secure, atomic, and fully audited financial backend built with raw SQL and PostgreSQL.

## Overview

A production-grade banking transaction system demonstrating enterprise-level data integrity without an ORM. Every balance change is automatically logged, constraints prevent invalid states, and ACID transactions guarantee money safety.

## Core Technical Features

**Atomic Transaction Handling**  
Uses raw SQL `BEGIN`, `COMMIT`, and `ROLLBACK` commands. Money transfers are all-or-nothing operations—if the receiver's account update fails, the sender's money is automatically restored.

**Database-Level Audit Trail**  
Implements PL/pgSQL triggers that monitor the `accounts` table. Any balance modification automatically writes a record to `audit_log` with old and new balances, creating a tamper-proof history.

**Constraint-Based Security**  
Utilizes SQL `CHECK` constraints like `balance >= 0` to enforce business rules directly in the schema. This acts as a final safety net preventing overdrafts, even if application code has bugs.

**Real-Time Event Monitoring**  
Uses Postgres `LISTEN` and `NOTIFY` commands. The Node.js backend subscribes to database events (like high-value transactions) and triggers immediate security alerts without polling.

**Type-Safe Database Interfacing**  
Leverages TypeScript interfaces to map raw SQL results to strict code objects. This catches data structure errors during development rather than runtime.

**Connection Pooling**  
Uses `pg.Pool` manager to maintain a cache of open connections to Neon Postgres. This reduces cold start latency and enables handling multiple simultaneous transactions efficiently.

**Analytical Window Functions**  
Uses advanced SQL like `LAG()` and `OVER()` to generate user statements. Calculates running balances and transaction deltas purely in SQL, significantly faster than processing in Node.js.

## Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/banking-audit-engine.git
cd banking-audit-engine
npm install

# Setup environment
echo "DATABASE_URL=your_neon_postgres_url" > .env
echo "PORT=3000" >> .env

# Initialize database
psql $DATABASE_URL < schema.sql

# Start server
npm run dev
```

## API Usage

**Transfer Money**
```bash
curl -X POST http://localhost:3000/api/transfer \
  -H "Content-Type: application/json" \
  -d '{"fromId": 1, "toId": 2, "amount": 150.00}'
```

**Response**
```json
{
  "success": true,
  "transaction": {
    "fromId": 1,
    "toId": 2,
    "amount": 150.00,
    "timestamp": "2026-01-24T10:30:00.000Z"
  }
}
```

## Database Schema

```sql
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  CONSTRAINT positive_balance CHECK (balance >= 0)
);

CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  account_id INTEGER REFERENCES accounts(id),
  old_balance DECIMAL(15, 2),
  new_balance DECIMAL(15, 2),
  operation VARCHAR(50),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Automatic audit trigger
CREATE TRIGGER balance_audit
  AFTER UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION log_balance_change();
```

## Why This Matters

This architecture demonstrates understanding of data integrity and system design at the database level. By enforcing ACID properties, implementing automatic auditing, and using constraint-based security, the system maintains financial accuracy even under concurrent load or application failures.

Built for backend interviews and production financial systems.

---

**License:** MIT  
**Author:** [@SHREESH2004](https://github.com/SHREESH2004)
