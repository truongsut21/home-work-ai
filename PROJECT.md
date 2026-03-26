# Bài tập 1: Xây dựng AI Chatbot "Cô Minh English"

## 1. Tổng quan dự án

Xây dựng một ứng dụng AI Chatbot đóng vai **"Cô Minh"** – một giáo viên tiếng Anh hài hước, hay trêu chọc học viên. Chatbot sử dụng streaming để tương tác thời gian thực, ghi nhớ 20 tin nhắn gần nhất để duy trì ngữ cảnh hội thoại.

## 2. Công nghệ sử dụng (Tech Stack)

| Thành phần       | Công nghệ                              |
| ---------------- | -------------------------------------- |
| **Framework**    | Next.js (App Router)                   |
| **AI SDK**       | Vercel AI SDK v6 (hoặc bản mới nhất)  |
| **UI Component** | Ant Design (Antd)                      |
| **Lưu trữ**     | Local State (quản lý 20 câu thoại gần nhất) |

## 3. Cấu trúc Giao diện (Layout)

### Sidebar (Menu bên trái)
- Danh sách các bài tập.
- Mục tiêu chính: Menu "Cô Minh English".

### Main Content (Bên phải)
- Khung chat hiển thị tin nhắn (Chat Window).
- Ô nhập liệu và nút gửi (Input & Send button).

## 4. Cấu hình AI (System Prompt)

- **Vai trò:** Giáo viên tiếng Anh tên "Cô Minh".
- **Đối tượng tương tác:** Học viên.
- **Tính cách / Văn phong:**
  - Hài hước, "nhây", hay trêu chọc học viên để tạo không khí vui vẻ.
  - Sử dụng đan xen tiếng Anh và tiếng Việt để hướng dẫn.
- **Cơ chế hoạt động:** Chatbot tương tác thời gian thực (Streaming).

## 5. Logic Xử lý (Core Logic)

### Quản lý ngữ cảnh (Context Window)
- AI phải ghi nhớ tối đa **20 tin nhắn gần nhất** (bao gồm cả nội dung của User và AI) trong mỗi lượt gửi yêu cầu (Request).
- Sử dụng mảng `messages` từ `useChat` hook của Vercel AI SDK và giới hạn độ dài bằng `slice(-20)`.

## 6. Cấu trúc thư mục dự án (theo Feature-driven Architecture)

```text
src/
├── app/
│   ├── layout.tsx                  # Root layout (AntdProvider, metadata)
│   ├── page.tsx                    # Trang chủ (redirect hoặc landing)
│   └── api/
│       └── chat/
│           └── route.ts            # API Route xử lý chat streaming
│
├── features/
│   └── chat/
│       ├── components/
│       │   ├── chat-window.tsx     # Khung hiển thị tin nhắn
│       │   ├── message-bubble.tsx  # Bong bóng tin nhắn (user/assistant)
│       │   └── chat-input.tsx      # Ô nhập liệu + nút gửi
│       ├── constants/
│       │   └── system-prompt.ts    # System prompt cho "Cô Minh"
│       ├── hooks/
│       │   └── use-chat-messages.ts # Hook quản lý messages (slice -20)
│       └── types/
│           └── index.ts            # Types cho Message, ChatConfig...
│
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx             # Sidebar menu bên trái
│   │   └── main-layout.tsx         # Layout chính (Sidebar + Content)
│   └── providers/
│       └── antd-provider.tsx       # Ant Design ConfigProvider + Theme
│
├── lib/
│   └── ai.ts                      # Khởi tạo AI model (OpenAI, Google, etc.)
│
└── types/
    └── index.ts                    # Global types
```

## 7. Mục tiêu học tập

- Làm quen với việc cấu hình **System Prompt** để định hình tính cách AI.
- Thực hành quản lý **Chat History** (Context window) trong ứng dụng thực tế.
- Kết hợp **Vercel AI SDK** với một thư viện UI phổ biến (Ant Design).
