# Time-Off Microservice — Technical Requirements Document (TRD)

---

## 1. Overview

### 1.1 Problem Statement

ReadyOn provides a user-facing module for employees to request time off. However, the **Human Capital Management (HCM)** system (e.g., Workday, SAP) remains the **source of truth** for employee balances.

The core challenge is maintaining **balance integrity across two systems** that can both update data independently.

---

### 1.2 Goals

* Provide APIs for time-off request lifecycle
* Ensure balance consistency with HCM
* Handle external updates (e.g., yearly refresh, work anniversary)
* Be resilient to HCM failures or inconsistencies

---

### 1.3 Non-Goals

* Payroll integration
* Multi-tenant scaling
* Authentication/authorization

---

## 2. Architecture

### 2.1 High-Level Design

```
Client → TimeOff API (NestJS) → SQLite DB
                      ↓
                 HCM Mock API
```

---

### 2.2 Components

#### TimeOff Service

* Handles request lifecycle
* Maintains local balance cache

#### HCM Service (Mock)

* Simulates external system
* Provides:

  * Real-time balance validation
  * Batch sync

#### Database (SQLite)

* Stores:

  * Employee balances
  * Time-off requests

---

### 2.3 Design Decisions

| Decision                       | Reason                   |
| ------------------------------ | ------------------------ |
| Local DB cache                 | Fast response for UI     |
| HCM validation before approval | Ensures correctness      |
| Batch sync                     | Handles external updates |
| PENDING state                  | Prevents false approvals |

---

## 3. API Endpoints

### 3.1 TimeOff APIs

#### POST `/timeoff/request`

Request time off.

**Request**

```json
{
  "employeeId": "1",
  "locationId": "A",
  "days": 2
}
```

**Response**

```json
{
  "status": "APPROVED"
}
```

---

#### POST `/timeoff/sync`

Sync balances from HCM.

**Response**

```json
{
  "message": "Sync completed successfully"
}
```

---

### 3.2 HCM APIs (Mock)

#### GET `/hcm/balance`

```
/hcm/balance?employeeId=1&locationId=A
```

**Response**

```
10
```

---

#### POST `/hcm/deduct`

```json
{
  "employeeId": "1",
  "locationId": "A",
  "days": 2
}
```

**Response**

```
true
```

---

#### GET `/hcm/batch`

```json
[
  { "employeeId": "1", "locationId": "A", "balance": 15 },
  { "employeeId": "2", "locationId": "B", "balance": 8 }
]
```

---

## 4. Business Logic Flow

### 4.1 Time-Off Request Flow

1. Validate input (DTO)
2. Fetch local balance
3. If insufficient → reject
4. Create request with status = PENDING
5. Call HCM API for validation
6. If HCM fails → mark REJECTED
7. If success:

   * Deduct local balance
   * Mark APPROVED

---

### 4.2 Sync Flow

1. Call HCM batch API
2. Loop through balances
3. Update or insert into DB
4. Override local values

---

### 4.3 Data Consistency Strategy

* **HCM = Source of Truth**
* Local DB = cache
* Sync ensures reconciliation

---

## 5. Error Handling

### 5.1 Validation Errors

* Missing fields → 400
* Invalid types → 400

---

### 5.2 Business Errors

| Scenario                   | Error |
| -------------------------- | ----- |
| No balance found           | 400   |
| Insufficient local balance | 400   |
| HCM rejection              | 400   |

---

### 5.3 External Failures

* HCM failure → request marked REJECTED
* Defensive checks prevent bad state

---

## 6. Test Cases

---

### 6.1 Setup

Start server:

```
npm run start:dev
```

Base URL:

```
http://localhost:3000
```

---

### 6.2 Functional Test Scenarios

---

#### Test Case 1 — Sync Balances

**Request**

```
POST /timeoff/sync
```

**Expected**

```json
{ "message": "Sync completed successfully" }
```

---

#### Test Case 2 — Successful Request

**Request**

```json
POST /timeoff/request
{
  "employeeId": "1",
  "locationId": "A",
  "days": 2
}
```

**Expected**

```json
{ "status": "APPROVED" }
```

---

#### Test Case 3 — Insufficient Balance

**Request**

```json
{
  "employeeId": "1",
  "locationId": "A",
  "days": 100
}
```

**Expected**

```json
{ "message": "Insufficient local balance" }
```

---

#### Test Case 4 — HCM Rejection

(when days > 3)

**Expected**

```json
{ "message": "HCM rejected request" }
```

---

#### Test Case 5 — Validation Failure

**Request**

```json
{
  "employeeId": 1,
  "days": 0
}
```

**Expected**

```json
{
  "statusCode": 400,
  "message": ["validation errors"]
}
```

---

#### Test Case 6 — External Sync Override

**Steps**

1. Request time off
2. Call `/timeoff/sync`

**Expected**

* Balance overwritten from HCM

---

### 6.3 Edge Cases

---

#### Case 1 — Missing Body

→ 400 Bad Request

---

#### Case 2 — Concurrent Requests

* Possible double deduction
* Not handled (documented limitation)

---

## 7. Limitations & Future Improvements

### 7.1 Current Limitations

* No concurrency control (race conditions possible)
* Mock HCM instead of real integration

---


## 8. Conclusion
for test write : npm run test:e2e
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        5.942 s

This system ensures:

* Strong validation before approval
* Consistency with HCM
* Resilience to failures
* Clear lifecycle management

The architecture balances **performance (local cache)** with **accuracy (HCM validation)**.

---
