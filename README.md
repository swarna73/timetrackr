# ⏱️ TimeTrackr

A simple, full-stack micro-SaaS tool for freelancers to track their time, manage clients, and generate invoices — built with **Spring Boot + React**.

---

## 🚀 Features

- User authentication (JWT-based)
- Add clients
- Log time entries by project/client
- Generate invoices from tracked time
- REST API with secure endpoints
- Simple and responsive frontend (React + Tailwind)

---

## 🛠️ Tech Stack

| Layer       | Tech                      |
|-------------|---------------------------|
| Backend     | Java, Spring Boot, JPA, H2 |
| Frontend    | React, Tailwind CSS       |
| Auth        | JWT + Spring Security     |
| Database    | H2 (In-memory for now)    |

---

## 📦 Project Structure
timetrackr/
├── backend/ (Spring Boot app)
├── frontend/ (React + Vite + Tailwind)


---

## 🔧 Running Locally

### 1. Start Backend

```bash
cd backend
./mvnw spring-boot:run

App runs on http://localhost:8080

2. Start Frontend
cd frontend
npm install
npm run dev

Frontend runs on http://localhost:5173
