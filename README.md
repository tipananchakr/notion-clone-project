# Motion — Notion Clone

โปรเจกต์ clone แนว Notion สำหรับเรียนรู้ full-stack ด้วย **Next.js**, **Convex** (backend + database แบบ real-time) และ **Clerk** (authentication)

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI | React 19, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com/) |
| Auth | [Clerk](https://clerk.com/) |
| Backend / DB | [Convex](https://www.convex.dev/) |
| อื่น ๆ | next-themes, sonner, lucide-react, usehooks-ts |

## Features

- **Authentication** — สมัคร / เข้าสู่ระบบ / ออกจากระบบ ผ่าน Clerk
- **Route protection** — พื้นที่ `(main)` ตรวจสอบ session ด้วย `useConvexAuth` แล้ว redirect ไปหน้า marketing ถ้ายังไม่ login
- **Sidebar ปรับขนาดได้** — ลากขอบเพื่อ resize, collapse บน mobile
- **เอกสาร (Documents)** — สร้าง note และ sub-document แบบ tree ใน sidebar
- **Dark / Light mode** — สลับธีมได้ (next-themes)

## Structure

```
app/
  (marketing)/              # หน้า landing, sign-in
  (main)/                   # layout หลัง login + sidebar
    _components/
      navigation.tsx        # sidebar + resize
      document-list.tsx     # tree ของ documents
    (routes)/documents/     # หน้าเอกสารหลัก
components/
  providers/
    convex-provider.tsx     # Clerk + Convex
    theme-provider.tsx
convex/
  schema.ts                 # ตาราง documents
  documents.ts              # getSidebar, create
  auth.config.ts            # ผูก Clerk กับ Convex
```

## Prerequisites

- บัญชี [Clerk](https://dashboard.clerk.com/)
- บัญชี [Convex](https://dashboard.convex.dev/)

## การตั้งค่า

### 1. Clone และติดตั้ง dependencies

```bash
git clone <repository-url>
cd notion-clone-project
npm install
```

### 2. สร้างแอป Clerk

1. สร้าง Application ใน [Clerk Dashboard](https://dashboard.clerk.com/)
2. คัดลอก **Publishable key** และ **Secret key**
3. สร้าง JWT template ชื่อ `convex` ตาม [Convex + Clerk docs](https://docs.convex.dev/auth/clerk) — จำเป็นสำหรับ `ctx.auth` ใน Convex

### 3. เชื่อม Convex กับ Clerk

1. รัน `npx convex dev` ครั้งแรก (ดู [วิธี Run](#วิธี-run-development)) เพื่อสร้าง deployment
2. แก้ `convex/auth.config.ts` ให้ `domain` ตรงกับ Clerk issuer ของคุณ  
   (Clerk Dashboard → Configure → JWT Templates → template `convex` → Issuer URL)

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

### 4. สร้างไฟล์ environment

สร้าง `.env.local` ที่ root โปรเจกต์ (ไฟล์นี้อยู่ใน `.gitignore`)

```env
# สร้าง/อัปเดตอัตโนมัติเมื่อรัน `npx convex dev`
CONVEX_DEPLOYMENT=dev:<your-deployment-name>

NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://<your-deployment>.convex.site

# Clerk — คัดลอกจาก https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
```

| ตัวแปร | ใช้ที่ไหน | หมายเหตุ |
|--------|-----------|----------|
| `CONVEX_DEPLOYMENT` | Convex CLI | ระบุ deployment ที่ `convex dev` ใช้ |
| `NEXT_PUBLIC_CONVEX_URL` | Next.js client | URL ของ Convex deployment |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Convex | มักถูกเติมโดย `convex dev` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Browser (Clerk) | ค่า public |
| `CLERK_SECRET_KEY` | Server-side Clerk | เก็บเป็นความลับ |

## วิธี Run (Development)


**เทอร์มินัล 1 — Convex**

```bash
npx convex dev
```

**เทอร์มินัล 2 — Next.js**

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

| Route | คำอธิบาย |
|-------|----------|
| `/` | หน้า marketing + sign in |
| `/documents` | หลัง login — สร้าง note, sidebar |

## Scripts

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `npm run dev` | Next.js development server |
| `npm run build` | Build สำหรับ production |
| `npm run start` | รัน production build |
| `npm run lint` | ESLint |
| `npx convex dev` | Convex dev + sync functions |
| `npx convex deploy` | Deploy Convex ไป production |
| `npx convex docs` | เปิดเอกสาร Convex |