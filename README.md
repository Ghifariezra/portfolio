# 🚀 Personal Portfolio

Website portofolio yang dibangun menggunakan ekosistem modern React dan dipaketkan dengan Vite. Proyek ini menggunakan arsitektur *Type-Safe* dengan bantuan ekosistem TanStack dan Zod.

## 💻 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Routing:** TanStack Router (File & Route-based routing)
- **State Management:** Zustand (Client-side) + TanStack React Query (Server-side / Data Fetching)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix UI) + animate-ui
- **Icons & Animations:** Phosphor Icons, Lucide React, Motion (Framer)
- **Visual & Editors:** React Flow (@xyflow/react), BlockNote (Rich Text Editor), Shiki (Syntax Highlighting)
- **Forms & Validation:** TanStack Form + Zod
- **Networking & Security:** Axios, XSS sanitization
- **Linter & Formatter:** Biome
- **Fonts:** Fontsource (Inter, JetBrains Mono, Space Grotesk)

## 📁 Struktur Proyek

- \/src/components\ - Komponen antarmuka (UI) yang ekstensibel (termasuk \shadcn/ui\, \locknote\, dan \eact-flow\).
- \/src/lib/actions\ - Server/Client actions terisolasi.
- \/src/lib/features\ - Domain logika untuk tiap fitur utama (Home, Projects, Notes, Contact, Dashboard, Admin, Auth).
- \/src/lib/schemas\ - Skema validasi menggunakan Zod.
- \/src/lib/services\ - Singleton services (mis. API calls) terpusat.
- \/src/lib/stores\ - State management (di luar TanStack Query) menggunakan Zustand.
- \/src/routes\ - Definisi halaman secara *folder-based routing / file-based routing* via TanStack Router (\outeTree.gen.ts\).
- \/src/utils\ - Utilitas pendukung, seperti middleware, dan XSS security utilities.

## 🛠️ Scripts / Perintah

Proyek ini menggunakan \pnpm\ sebagai package manager. Tersedia perintah berikut:

- \pnpm dev\ - Menjalankan server pengembangan (development).
- \pnpm build\ - Kompilasi TypeScript dan build produksi.
- \pnpm preview\ - Pratinjau hasil build.
- \pnpm format\ - Memformat seluruh kode menggunakan Biome.
- \pnpm lint\ - Melakukan pengecekan (linting) kode.
- \pnpm fix\ - Membenarkan error *linting* secara otomatis via Biome.

## 📦 Cara Memulai (Getting Started)

1. Clone repositori ini.
2. Instal pustaka (*dependencies*):
   \\\ash
   pnpm install
   \\\
3. Jalankan server lokal:
   \\\ash
   pnpm dev
   \\\
4. Akses melalui browser di \http://localhost:5173\.

## 📐 Konvensi

Proyek ini menggunakan prinsip *DRY (Don't Repeat Yourself)* untuk *logic codebase*-nya, penanganan *error* terpusat, serta standardisasi arsitektural yang mewajibkan isolasi pada *actions*, *services*, *schemas*, *stores*, dan fitur. 
