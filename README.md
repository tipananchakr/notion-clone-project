# Motion - Notion Clone

Motion เป็นโปรเจกต์ Notion clone สำหรับเรียนรู้การทำ full-stack web app ด้วย **Next.js App Router**, **Convex**, **Clerk**, **BlockNote** และ **EdgeStore** โดยมี workflow หลักคือ login, สร้างเอกสารแบบลำดับชั้น, เขียน note, ใส่ icon/cover, ค้นหา, ย้ายลงถังขยะ และ publish note เป็น public preview link

## Tech Stack

| ส่วน | เทคโนโลยี |
| --- | --- |
| Framework | Next.js 16, React 19, TypeScript |
| Styling / UI | Tailwind CSS 4, shadcn/ui, Radix UI, lucide-react |
| Authentication | Clerk |
| Backend / Database | Convex |
| Editor | BlockNote |
| File Upload | EdgeStore, react-dropzone |
| State / Hooks | Zustand, next-themes, usehooks-ts |
| Feedback | sonner toast |

## Features

- **Authentication**: สมัครสมาชิก, เข้าสู่ระบบ และออกจากระบบผ่าน Clerk
- **Protected workspace**: route ในกลุ่ม `(main)` ตรวจสอบ session ด้วย `useConvexAuth` และ redirect กลับหน้าแรกเมื่อยังไม่ login
- **Marketing page**: หน้า landing สำหรับผู้ใช้ที่ยังไม่ได้เข้าสู่ระบบ
- **Document tree**: สร้างเอกสารหลักและ sub-document แบบ nested tree ใน sidebar
- **Realtime data**: อ่าน/เขียนข้อมูลผ่าน Convex query และ mutation
- **Rich text editor**: เขียนเนื้อหาด้วย BlockNote และบันทึก content เป็น JSON string
- **Title editing**: แก้ชื่อเอกสารแบบ inline พร้อม fallback เป็น `Untitled`
- **Icon picker**: เพิ่ม, เปลี่ยน และลบ emoji icon ของเอกสาร
- **Cover image**: upload, เปลี่ยน และลบ cover image ผ่าน EdgeStore
- **Image upload in editor**: upload ไฟล์จาก editor ไปยัง EdgeStore
- **Search command**: ค้นหาเอกสารด้วย command dialog และเปิดด้วย `Ctrl/Cmd + K`
- **Resizable sidebar**: sidebar ปรับความกว้างได้, collapse ได้ และปรับ behavior บน mobile
- **Trash system**: archive เอกสาร, แสดงรายการในถังขยะ, restore และ delete ถาวร
- **Recursive archive/restore**: เมื่อลบหรือกู้คืน parent document จะจัดการ child documents ต่อเนื่อง
- **Publish / unpublish**: publish note เป็น public preview link และ copy URL ได้
- **Read-only public preview**: route `/preview/[documentId]` แสดงเฉพาะเอกสารที่ publish และยังไม่ถูก archive
- **Dark / light / system theme**: ตั้งค่า appearance ผ่าน `next-themes`
- **Loading and error states**: skeleton loading, spinner, toast และ not-found/error page

## Project Structure

```txt
.
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                    # หน้า landing page
│   │   ├── layout.tsx                  # layout ของ public marketing area
│   │   └── _components/                # Navbar, hero, logo, footer
│   ├── (main)/
│   │   ├── layout.tsx                  # protected workspace layout
│   │   ├── _components/                # sidebar, navbar, document tree, trash, publish
│   │   └── (routes)/documents/
│   │       ├── page.tsx                # หน้า documents หลักหลัง login
│   │       └── [documentId]/page.tsx   # หน้า editor ของ document
│   ├── (public)/(route)/preview/
│   │   └── [documentId]/page.tsx       # public read-only preview page
│   ├── api/edgestore/
│   │   └── [...edgestore]/route.ts     # EdgeStore API handler
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── layout.tsx                      # root providers และ global modals
│   └── globals.css
├── components/
│   ├── modals/                         # cover image, confirm, settings modal
│   ├── providers/                      # Convex + Clerk provider, theme provider
│   ├── ui/                             # shadcn/ui components
│   ├── upload/                         # upload helper components
│   ├── editor.tsx                      # BlockNote editor wrapper
│   ├── cover.tsx                       # document cover image
│   ├── toolbar.tsx                     # title, icon, cover actions
│   ├── search-command.tsx              # command palette search
│   └── mode-toggle.tsx                 # theme switcher
├── convex/
│   ├── schema.ts                       # database schema
│   ├── documents.ts                    # document queries/mutations
│   ├── auth.config.ts                  # Clerk auth config for Convex
│   └── _generated/                     # generated Convex types/API
├── hooks/
│   ├── use-cover-image.tsx             # Zustand state ของ cover modal
│   ├── use-search.tsx                  # Zustand state ของ search dialog
│   ├── use-setting.tsx                 # Zustand state ของ settings modal
│   ├── use-origin.tsx                  # origin helper สำหรับ publish URL
│   └── use-scroll-top.tsx
├── lib/
│   ├── edgestore.ts                    # type-safe EdgeStore client provider
│   ├── edgestore-file.ts               # helper สำหรับลบไฟล์จาก URL
│   └── utils.ts                        # utility เช่น cn()
├── public/                             # static assets
├── package.json
├── next.config.ts
├── tsconfig.json
└── components.json                     # shadcn/ui config
```

## Main Routes

| Route | คำอธิบาย |
| --- | --- |
| `/` | หน้า marketing/landing |
| `/documents` | หน้า workspace หลักหลัง login |
| `/documents/[documentId]` | หน้าแก้ไข document |
| `/preview/[documentId]` | public preview ของ document ที่ publish แล้ว |
| `/api/edgestore/[...edgestore]` | API route สำหรับ EdgeStore upload/delete |

## Data Model

ตารางหลักคือ `documents` ใน `convex/schema.ts`

| Field | Type | คำอธิบาย |
| --- | --- | --- |
| `title` | `string` | ชื่อเอกสาร |
| `userId` | `string` | Clerk user id ของเจ้าของเอกสาร |
| `isArchived` | `boolean` | สถานะอยู่ใน trash หรือไม่ |
| `parentDocument` | optional document id | id ของ parent document สำหรับ nested tree |
| `content` | optional `string` | JSON string ของ BlockNote content |
| `coverImage` | optional `string` | URL ของ cover image |
| `icon` | optional `string` | emoji icon |
| `isPublished` | `boolean` | สถานะเผยแพร่แบบ public |

Indexes:

- `by_user`: query เอกสารตามผู้ใช้
- `by_user_parent`: query document tree ตามผู้ใช้และ parent document

## Convex Functions

ไฟล์ `convex/documents.ts` รวม query และ mutation หลักของเอกสาร

| Function | Type | หน้าที่ |
| --- | --- | --- |
| `create` | mutation | สร้าง document หรือ sub-document |
| `getSidebar` | query | โหลด document tree สำหรับ sidebar |
| `getById` | query | โหลด document สำหรับเจ้าของ |
| `getPublishedById` | query | โหลด public document ที่ publish แล้ว |
| `getSearch` | query | โหลด documents สำหรับ command search |
| `getTrash` | query | โหลด documents ที่ถูก archive |
| `update` | mutation | อัปเดต title, content, icon, cover, publish status |
| `archive` | mutation | archive document และ children |
| `restore` | mutation | restore document และ children |
| `remove` | mutation | ลบ document ถาวร |
| `removeIcon` | mutation | ลบ icon |
| `removeCoverImage` | mutation | ลบ cover image reference |

## Prerequisites

- บัญชี Clerk
- บัญชี Convex
- บัญชี/credentials ของ EdgeStore สำหรับ file upload

## Environment Variables

สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์

```env
# Convex
CONVEX_DEPLOYMENT=dev:<your-deployment-name>
NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://<your-deployment>.convex.site

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>

# EdgeStore
EDGE_STORE_ACCESS_KEY=<your-edgestore-access-key>
EDGE_STORE_SECRET_KEY=<your-edgestore-secret-key>
```

หมายเหตุ: ค่า `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL` และ `NEXT_PUBLIC_CONVEX_SITE_URL` มักถูกสร้าง/อัปเดตเมื่อรัน `npx convex dev`

## Setup

ติดตั้ง dependencies

```bash
npm install
```

ตั้งค่า Clerk สำหรับ Convex

1. สร้าง application ใน Clerk Dashboard
2. สร้าง JWT template ชื่อ `convex`
3. นำ issuer URL ไปใส่ใน `convex/auth.config.ts`

```ts
export default {
  providers: [
    {
      domain: "https://<your-clerk-subdomain>.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
```

รัน Convex dev server

```bash
npx convex dev
```

รัน Next.js dev server อีก terminal หนึ่ง

```bash
npm run dev
```

เปิดแอปที่ `http://localhost:3000`

## Scripts

| Command | คำอธิบาย |
| --- | --- |
| `npm run dev` | รัน Next.js development server |
| `npm run build` | build production |
| `npm run start` | รัน production build |
| `npm run lint` | ตรวจ lint ด้วย ESLint |
| `npx convex dev` | รัน Convex dev และ sync functions |
| `npx convex deploy` | deploy Convex ไป production |