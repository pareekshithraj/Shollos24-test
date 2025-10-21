# Schools24 - Spring Boot Backend

## Prerequisites
- Java 17+
- Maven 3.9+
- MySQL 8+

## Setup
1. Create database:
```sql
CREATE DATABASE IF NOT EXISTS schools24 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
2. Configure `backend/src/main/resources/application.properties`:
- Set `spring.datasource.username` and `spring.datasource.password` to your MySQL credentials.

3. Build and run:
```bash
mvn -f backend/pom.xml clean package
mvn -f backend/pom.xml spring-boot:run
```
The server starts on port 5000.

## API Endpoints (admin)
- GET `/api/admin/dashboard`
- GET `/api/admin/teachers`
- POST `/api/admin/users` { name, email, password, role, userId }
- GET `/api/admin/classes`
- POST `/api/admin/classes` { name, grade, section }
- GET `/api/admin/subjects`
- POST `/api/admin/subjects` { name, code }

Note: Authentication is not implemented in this bootstrapped version. The UI should omit the `Authorization` header or you can extend with Spring Security + JWT later.
