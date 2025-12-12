# System Design Document

## 1. High-Level Architecture

The system follows a typical layered architecture pattern, robustly designed for separation of concerns and scalability.

### Components
- **Client (Frontend)**: React + TypeScript Single Page Application (SPA). Interacts with the backend via RESTful APIs.
- **Load Balancer**: Distributes incoming traffic across multiple backend instances (e.g., Nginx, or Cloud Provider specific like AWS ELB / Render's internal LB).
- **API Gateway / Backend**: Node.js + Express.js. Handles business logic, authentication, and request orchestration.
    - **Controllers**: Handle HTTP requests/responses.
    - **Services**: Contain business logic (booking, availability).
    - **Repositories**: Direct data access layer.
- **Database**: PostgreSQL. Primary source of truth. Handles relational data and concurrency locks.
- **Cache**: Redis. Used for caching show listings and seat availability to reduce DB read load.
- **Job Queue**: BullMQ (with Redis). Handles background tasks like expiring stale pending bookings or sending notifications.

### Diagram (Conceptual)
```mermaid
graph TD
    Client[Client (React)] --> LB[Load Balancer]
    LB --> API[Node.js Backend]
    API --> Cache[Redis Cache]
    API --> DB[(PostgreSQL Primary)]
    API --> Queue[BullMQ Job Queue]
    Queue --> Worker[Background Worker]
    Worker --> DB
```

## 2. Scaling Strategies

### Database
- **Replication**: Use a Primary-Replica setup.
    - **Writes**: Go to Primary.
    - **Reads**: Can be distributed to Replicas (with awareness of replication lag).
- **Sharding**:
    - **Strategy**: Shard by `show_id` or `trip_id`. Bookings for a specific show are self-contained, making this a natural shard key.
    - **Seat Booking Partitioning**: `booking_seats` table can grow large. Partitioning by `booking_date` or `show_id` can improve query performance.

### Caching
- **Implementation**: Redis.
- **Invalidation**: Write-through or Cache-aside with invalidation on updates.
    - When a booking is confirmed, invalidate the specific show's seat map cache.

### Application
- **Stateless**: Backend services are stateless. Scale horizontally by adding more instances behind the Load Balancer.

## 3. Concurrency Control

This is the most critical part of the system to prevent double-booking.

### Selected Approach: Pessimistic Locking (Row-Level)
We will use PostgreSQL's `SELECT ... FOR UPDATE` mechanism.

**Workflow:**
1.  **Start Transaction**: `BEGIN;`
2.  **Lock Seats**:
    ```sql
    SELECT * FROM seats
    WHERE show_id = $1 AND seat_number IN ($2, $3)
    FOR UPDATE;
    ```
    - This locks the specific rows for the requested seats.
    - If another transaction is trying to book these seats, it will wait until this transaction commits or rolls back.
    - **Optimization**: `NOWAIT` can be used to fail fast if seats are locked, or we can just let it wait (usually fast). Better yet, checking status after lock.
3.  **Check Status**: Verify if `status` is still `AVAILABLE` for all locked seats.
    - If any are `BOOKED` or `PENDING` (if using strict pending states), rollback and error.
4.  **Update**: Update seats to `PENDING` (or directly `BOOKED` depending on flow). Insert into `bookings`.
5.  **Commit**: `COMMIT;`

**Alternative (Optimistic Locking)**:
- Add a `version` column.
- Update `WHERE version = read_version`.
- If affected rows < expected, rollback/retry.
- *Reason for choosing Pessimistic*: For high contention (hot tickets), optimistic locking causes many retries/failures. Pessimistic locking (queueing on the DB lock) provides a fairer and more deterministic outcome for high-load ticket sales.

## 4. Caching Strategy

### Shows List
- **Key**: `shows:list:{filter_hash}`
- **TTL**: 1-5 minutes (depending on how often shows are added).
- **Invalidation**: When a NEW show is created by Admin.

### Seat Availability
- **Key**: `show:{id}:seats`
- **Structure**: JSON blob or Hash map of seat statuses.
- **TTL**: Short (e.g., 10-30 seconds) or strictly invalidated on change.
- **Logic**:
    - User views seat map -> Check Cache.
    - Cache Miss -> Read DB -> Write Cache.
    - User Books -> Invalidate `show:{id}:seats` or Update specific seat in Hash.

## 5. Database Schema

### `shows`
- `id` (UUID, PK)
- `name` (VARCHAR)
- `start_time` (TIMESTAMPTZ)
- `total_seats` (INT)
- `created_at`, `updated_at`

### `seats`
- `id` (UUID, PK)
- `show_id` (UUID, FK -> shows)
- `seat_number` (VARCHAR) - e.g., "A1", "A2"
- `status` (ENUM: 'AVAILABLE', 'LOCKED', 'BOOKED')
- `booking_id` (UUID, nullable, FK -> bookings) - Current active booking holding this seat.
- `version` (INT) - For optimistic locking support if needed mixed with pessimistic.

### `bookings`
- `id` (UUID, PK)
- `user_id` (UUID/String)
- `show_id` (UUID, FK -> shows)
- `status` (ENUM: 'PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED')
- `created_at`, `expires_at` (for PENDING timeout)

### `booking_seats` (Junction - Optional if embedding in `seats` is sufficient, but good for history)
- `booking_id` (UUID)
- `seat_id` (UUID)
- *If using `seats.booking_id`, this might be redundant for active state but good for historical records or normalization.*

### `audit_logs`
- `id`, `action`, `entity_type`, `entity_id`, `data`, `timestamp`

### `dead_letter_queue`
- `id`, `payload`, `error`, `retry_count`, `created_at`
