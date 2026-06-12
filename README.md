# 🚀 Personal Portfolio

Website portofolio yang dibangun menggunakan ekosistem modern React dan dipaketkan dengan Vite. Proyek ini menggunakan arsitektur **Type-Safe** secara menyeluruh dengan bantuan ekosistem TanStack dan skema validasi Zod.

## 💻 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Routing:** TanStack Router (File-based routing)
- **State Management:** Zustand 5 (Client-side) + TanStack React Query 5 (Server-side / Data Fetching)
- **Styling:** Tailwind CSS v4, `next-themes` (Dark Mode), dan `tailwind-merge`
- **UI Components:** shadcn (Radix UI) + `tw-animate-css`
- **Icons & Animations:** Phosphor Icons, Lucide React, dan Motion
- **Visual & Editors:** React Flow (`xyflow/react`), BlockNote (Rich Text Editor), Shiki (Syntax Highlighting), React Markdown (`remark-gfm`)
- **Forms & Validation:** TanStack Form + Zod
- **Networking & Security:** Axios, XSS sanitization (`xss`)
- **Testing:** Vitest 4 + React Testing Library (`jsdom`)
- **Linter & Formatter:** Biome
- **Fonts:** Fontsource (Inter, JetBrains Mono, Space Grotesk)

## 🚄 Struktur Proyek

Proyek ini disusun secara modular dengan memisahkan wilayah UI dengan *Business Logic*.

- `/src/components` - Komponen antarmuka (UI) ekstensibel (mencakup `shadcn`, `blocknote`, `animate-ui` dan `react-flow`).
- `/src/hooks` - Custom hooks React yang digunakan lintas fitur.
- `/src/lib/actions` - Aksi/fungsi terisolasi (Server/Client side).
- `/src/lib/features` - Domain logika untuk tiap fitur utama (Home, Projects, Notes, Contact, Dashboard, Admin, Auth, dll).
- `/src/lib/schemas` - Skema validasi terpusat menggunakan Zod.
- `/src/lib/services` - Singleton services untuk pemanggilan API dan pengelolaan fetcher.
- `/src/lib/stores` - State management global/klien di luar Query menggunakan Zustand.
- `/src/routes` - Definisi halaman secara *folder-based routing* via TanStack Router.
- `/src/utils` - Utilitas pendukung, seperti fungsi security XSS, middleware, dan tools logger.
- `/test` - File test unit terkait utility fungsi maupun validasi schema.

## 🛠️ Scripts / Perintah

Proyek ini menggunakan `pnpm`. Tersedia perintah berikut:

### Development & Build
- `pnpm dev` - Menjalankan server pengembangan.
- `pnpm build` - Kompilasi TypeScript dan build *production*.
- `pnpm preview` - Membuka pratinjau hasil build secara lokal.

### Code Quality (Linting & Formatting)
- `pnpm check` - Menjalankan linter, formatter, dan validasi standar kode sesuai Biome.
- `pnpm lint` - Mengecek error standar penulisan secara spesifik.
- `pnpm format` - Memformat ulang (*write*) file yang tidak sesuai aturan.
- `pnpm fix` - Melakukan *auto-fix* terhadap masalah linting.

### Testing
- `pnpm test` - Menjalankan *unit testing* menggunakan Vitest pada mode watch.
- `pnpm test:run` - Menjalankan testing keseluruhan dalam satu kali putaran (single-run).
- `pnpm test:ui` - Membuka UI antarmuka interaktif yang memudahkan debugging tes.

## 📔 Cara Memulai (Getting Started)

1. Clone repositori ini.
2. Instal semua *dependencies*:
   ```bash
   pnpm install
   ```
3. Jalankan development server:
   ```bash
   pnpm dev
   ```
4. Buka akses melalui browser di `http://localhost:5173`.

## 📒 Konvensi & Pola Desain

Kode pada portofolio dan *core logical services* mengusung gaya penulisan *DRY (Don't Repeat Yourself)* untuk meminimalisasi redudansi. Selain itu, proyek patuh pada Singleton pattern untuk API Services, error handling secara memusat, serta mewajibkan isolasi tanggungjawab baik pada *actions*, *services*, *features*, *schemas*, maupun *stores*.