# 📘 SpendBook – Personal Finance / Banking Mini System

---

# 📌 Mục lục

- [Tính năng chính](#-tính-năng-chính)
- [Kiến trúc & Thiết kế hiệu năng](#-kiến-trúc--thiết-kế-hiệu-năng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [Luồng hoạt động hệ thống](#-luồng-hoạt-động-hệ-thống)
- [Docker & Docker Compose](#-docker--docker-compose)
- [Unit Test Postman](#-unit-test-postman)

---

# 🚀 Tính năng chính

## 🔐 Xác thực & phân quyền
- Đăng ký / đăng nhập bằng **JWT**
- User chỉ xem dữ liệu của chính mình
- Dễ dàng mở rộng sang OAuth2 / Social Login

## 👛 Quản lý Ví
- Tạo – sửa ví (tiền mặt, ngân hàng, ví điện tử…)
- Lưu số dư đầu kỳ + số dư hiện tại

## 🗂 Danh mục Thu / Chi
- Tự tạo danh mục với emoji icon
- Loại: **INCOME / EXPENSE**

## 💸 Giao dịch
- Tạo giao dịch thu/chi, kiểm tra số dư
- Lịch sử giao dịch:
  - Lọc: Thu / Chi / Tất cả
  - Sắp xếp: mới nhất / cũ nhất
  - **Cursor Pagination** + Load More (tối ưu cho 10M+ bản ghi)

## 📊 Báo cáo & Biểu đồ
- Chọn ví + khoảng thời gian (preset hoặc tùy chỉnh)
- Tính toán:
  - Số dư đầu kỳ
  - Tổng thu / Tổng chi
  - Số dư cuối kỳ
- Biểu đồ:
  - Theo **ngày** nếu range nhỏ  
  - Theo **tháng** nếu range lớn

## 📄 Xuất Excel (Streaming)
- ExcelJS Streaming + Mongo Cursor → xuất **hàng triệu dòng**
- Không chiếm RAM
- File gồm:
  - Header thông tin ví
  - Summary thu/chi
  - Danh sách giao dịch theo khoảng thời gian


# 🏗 Kiến trúc & Thiết kế hiệu năng

## 🧱 Công nghệ sử dụng

| Backend | Frontend | Khác |
|--------|----------|-------|
| Node.js + TypeScript | React + TypeScript | Docker |
| Express | Vite | ExcelJS Streaming |
| MongoDB + Mongoose | Ant Design | Cursor Pagination |
| JWT Auth | Ant Design Plots | ESLint + Prettier |

---

## 🗄 Mô hình dữ liệu chính

### `Wallet`
Index tối ưu:
{ userId: 1 }

### `Transaction`
Index tối ưu để query hàng triệu record:
{ userId: 1, walletId: 1, date: -1 }
{ date: 1 }


### `DailyWalletSummary`
Bảng tổng hợp giúp báo cáo chỉ cần đọc **vài chục dòng**, không phải quét hàng triệu giao dịch.

---

## ⚡ Tối ưu hiệu năng

- ✔ **Cursor Pagination** (không dùng skip/limit)
- ✔ **Daily Summary** giảm tải cho báo cáo
- ✔ **Excel Streaming** → không giữ file trong RAM
- ✔ **Mongo Indexing chuẩn** theo userId, walletId, date
- ✔ Chưa thiết kế được **multi-tenant** để mở rộng theo chiều ngang

---

# 🗂 Cấu trúc thư mục

backend/
    src/
        middlewares/
        modules/
            auth/
            wallets/
            categories/
            transactions/
            reports/
            excel/
    app.ts
    server.ts

frontend/
    src/
        api/
        components/
        contexts/
        pages/


---

# ⚙ Cài đặt & Chạy dự án

## 4.1. Yêu cầu
- Node.js ≥ 18  
- MongoDB local hoặc Docker  
- npm / yarn  

---

# 4.2. Backend

## 🔽 Clone & cài đặt
git clone <repo>
cd backend
npm install
📝 Tạo file .env

PORT=4000
MONGO_URI=mongodb://localhost:27017/spendbook
JWT_SECRET=super-secret-key

CLIENT_URL=http://localhost:5173
NODE_ENV=development
▶ Chạy backend
Dev:

npm run dev
Build:

npm run build
npm run start
Backend chạy tại:
👉 http://localhost:4000/api

🔌 Endpoint chính
Auth
POST /api/auth/login

POST /api/auth/register

Wallet
GET /api/wallets

POST /api/wallets

Category
GET /api/categories

POST /api/categories

Transaction
POST /api/transactions

GET /api/transactions/history

Report
GET /api/reports/statement

GET /api/reports/chart

Excel Export
GET /api/excel/statement

4.3. Frontend
🔽 Cài đặt

cd ../frontend
npm install
📝 Tạo file .env

VITE_API_URL=http://localhost:4000/api
▶ Chạy frontend

npm run dev
👉 Mặc định chạy tại: http://localhost:5173

🔄 Luồng hoạt động hệ thống
5.1. Ghi giao dịch
FE gọi transactionApi.create

BE:

Validate

Create transaction

Update ví

Update Daily Summary

FE:

Toast success

Reset form

Load lại bằng cursor pagination

5.2. Báo cáo
FE gọi:

/reports/statement
/reports/chart
5.3. Xuất Excel
FE gọi:

/excel/statement?walletId=...&from=...&to=...
BE dùng:

ExcelJS Streaming

Mongo cursor
→ xuất hàng triệu dòng mượt mà

🐳 Docker & Docker Compose
docker-compose.yml

version: "3.9"

services:
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    env_file:
      - ./backend/.env
    environment:
      - MONGO_URI=mongodb://mongo:27017/spendbook
    ports:
      - "4000:4000"
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    env_file:
      - ./frontend/.env
    environment:
      - VITE_API_URL=http://backend:4000/api
    ports:
      - "5173:4173"
    depends_on:
      - backend

volumes:
  mongo_data:
Chạy:

docker compose up --build
🧪 Unit Test Postman
File nằm trong repo:

unitest-backend.json
Cách chạy:
Mở Postman → Import

Chọn unitest-backend.json

Set môi trường:

BASE_URL = http://localhost:4000/api

TOKEN = <jwt>

Chạy toàn bộ collection để test API