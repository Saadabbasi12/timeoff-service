# Time-Off Microservice

A backend service built with NestJS to manage employee time-off requests while maintaining consistency with an external Human Capital Management (HCM) system.

---

## Overview

This service allows employees to request time off while ensuring that the **HCM system remains the source of truth** for balances. It handles validation, synchronization, and failure scenarios to maintain data integrity across systems.

---

## Key Features

* Time-off request lifecycle (PENDING → APPROVED / REJECTED)
* Local balance validation for fast feedback
* Real-time validation with HCM
* Batch synchronization with HCM
* Defensive error handling
* DTO-based validation
* Modular NestJS architecture

---

## Tech Stack

* **Backend:** NestJS
* **Database:** SQLite (TypeORM)
* **Validation:** class-validator
* **Testing:** Jest (basic setup)
* **Language:** TypeScript

---

## Project Structure

```
src/
  entities/
    employee-balance.entity.ts
    timeoff.entity.ts

  hcm/
    hcm.controller.ts
    hcm.service.ts
    hcm.module.ts

  timeoff/
    dto/
      request-timeoff.dto.ts
    timeoff.controller.ts
    timeoff.service.ts
    timeoff.module.ts

  app.module.ts
  main.ts
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd timeoff-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the server

```bash
npm run start:dev
```
for test write : npm run test:e2e
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        5.942 s

Server runs at:

```
http://localhost:3000
```

---

## API Endpoints

### TimeOff

#### Request Time Off

```
POST /timeoff/request
```

**Body**

```json
{
  "employeeId": "1",
  "locationId": "A",
  "days": 2
}
```

---

#### Sync Balances

```
POST /timeoff/sync
```

---

### HCM (Mock APIs)

#### Get Balance

```
GET /hcm/balance?employeeId=1&locationId=A
```

---

#### Deduct Balance

```
POST /hcm/deduct
```

**Body**

```json
{
  "employeeId": "1",
  "locationId": "A",
  "days": 2
}
```

---

#### Batch Sync Data

```
GET /hcm/batch
```

---

## How It Works

1. Request is validated locally
2. Local balance is checked
3. Request is created as **PENDING**
4. HCM is called for validation
5. If successful:

   * Balance updated
   * Request marked **APPROVED**
6. If failure:

   * Request marked **REJECTED**

---

## Testing the System

### Step 1 — Sync initial data

```
POST /timeoff/sync
```

---

### Step 2 — Make a valid request

```
POST /timeoff/request
```

---

### Step 3 — Test failure scenarios

* Large request → insufficient balance
* Invalid input → validation error
* HCM rejection → simulated failure

---

## Design Decisions

* **HCM as Source of Truth**
  All final validations rely on HCM.

* **Local Cache for Performance**
  Improves response time for users.

* **Batch Sync for Reconciliation**
  Handles external updates like bonuses.

* **PENDING State**
  Prevents incorrect approvals.

---

## Limitations

* No concurrency control (race conditions possible)
* Mock HCM instead of real integration

---

## Future Improvements

* Add DB transactions for consistency
* Introduce retry queues (e.g., Bull)
* Implement event-driven architecture
* Add authentication & authorization
* Integrate real HCM APIs

---

## Author

Saad Ali Abbasi
saadaliabbasi2347@gmail.com

---

## Final Note

This project demonstrates handling of distributed data consistency problems using a pragmatic approach that balances performance with correctness.
