---
name: nextjs-senior-architecture
description: Áp dụng kiến trúc Next.js App Router chuẩn senior (Feature-driven / Modular)
---

# Hướng dẫn áp dụng kiến trúc Next.js App Router chuẩn senior

Kỹ năng này giúp tổ chức source code cho dự án Next.js theo mô hình Feature-driven architecture (Modular), cực kỳ tối ưu cho các dự án quy mô lớn. 

## Nguyên Tắc Cốt Lõi (Core Principles)
1. **App Router là Dummy Router**: Thư mục `src/app` CHỈ chịu trách nhiệm định tuyến (routing), bảo vệ route và lắp ráp các thành phần. KHÔNG chèn business logic, queries database hay logic xử lý quá phức tạp vào đây.
2. **Feature-Driven Design**: Tổ chức code theo tên của từng "Tính Năng" (Domain/Feature) độc lập thay vì gom tất cả các file có chung kiểu thiết kế (như toàn bộ controllers vào 1 chỗ, hay components vào 1 chỗ).
3. **RSC First**: Mặc định hướng về React Server Components (RSC) để tối ưu payload. Chỉ đẩy directive `"use client"` tới sát rìa UI (tại component cha nhỏ nhất đòi hỏi tương tác).

## Cấu Trúc Khuyến Nghị

```text
src/
├── app/                    # App Router, Layouts, Loading, Error boundaries.
├── components/             # Shared UI components (Cấu hình shadcn/ui, Core layout, Buttons...)
├── features/               # Các Feature Domains, nơi chứa bộ não thực sự của app.
│   └── [feature-name]/
│       ├── components/     # Các components phục vụ riêng cho UI của tính năng này
│       ├── actions/        # Server Actions ("use server") dùng để mutate dữ liệu
│       ├── services/       # Giao tiếp với Database, ORMs, Data Fetchers hoặc External APIs
│       ├── hooks/          # React hooks phục vụ local logic của tính năng
│       ├── schemas/        # Zod Schemas để validate DTOs, Forms
│       ├── store/          # Zustand slices hoặc Redux/Reducers
│       └── types/          # TypeScript definitions riêng cho tính năng
├── lib/                    # Cài đặt thư viện: `prisma.ts`, `redis.ts`, `stripe.ts`
├── utils/                  # Hàm tiện ích chung (Helpers)
├── hooks/                  # Global React hooks
└── types/                  # Global Typescript Types
```

## Các Bước Thực Hành Cho Agent

Khi bạn được yêu cầu xây dựng một hệ thống Next.js theo chuẩn này, hãy tuân theo các bước sau:

### 1. Phân Tích Tính Năng (Domain Separation)
Trước khi tạo file mới, hãy phân định nó thuộc về "Feature" nào. Ví dụ: đang làm về giỏ hàng -> `features/cart`, về xác thực -> `features/auth`.

### 2. Scaffold (dựng khung) tính năng
Nhanh chóng tạo ra cấu trúc cây thư mục cần thiết trong `src/features/<tên-tính-năng>`.

### 3. Quy Ước Viết Mã (Coding Conventions) 
- **Validation**: Mọi requests đi qua API routes hay Server Actions ĐỀU phải được sanitize và parse thông qua `zod` schema (từ thư mục `schemas` của tính năng đó). 
- **Services (DAL - Data Access Layer)**: Đặt các queries tới DB thông qua Prisma/Drizzle ở bên trong `services/`.
- **Server Actions**: Phục vụ việc submit form thay vì dùng React Query / Fetch thủ công.

### Ví Dụ: Tạo Trang Liệt Kê Người Dùng
- Viết `src/features/users/services/get-users.ts` để đọc từ DB.
- Viết `src/features/users/components/user-list.tsx` để render list (có thể `"use client"` nếu cần state nhảy trang).
- Vào bề mặt Routing: gọi service `getUsers()` tại `src/app/users/page.tsx` (RSC) và pass data qua attribute cho `<UserList />`.
