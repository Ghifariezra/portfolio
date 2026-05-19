# 🚀 Personal Portfolio

Website portofolio yang dibangun menggunakan ekosistem modern React dan dipaketkan dengan Vite. Proyek ini menggunakan arsitektur _Type-Safe_ dengan bantuan ekosistem TanStack dan Zod.

## 💻 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Routing:** TanStack Router
- **State Management:** Zustand (Client-side) + TanStack React Query (Server-side / Data Fetching)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix UI) + animate-ui
- **Forms & Validation:** TanStack Form + Zod
- **Linter & Formatter:** Biome
- **Icons:** Phosphor Icons (@phosphor-icons/react)
- **Fonts:** Fontsource (Inter, JetBrains Mono, Space Grotesk)
- **Networking:** Axios

## 📁 Struktur Proyek

- `/src/components` - Komponen antarmuka (UI) yang ekstensibel dan _reusable_ (termasuk `shadcn`ui\).
- `/src/lib/features` - Domain logika untuk tiap fitur utama (Home, Projects, Notes, Contact).
- `/src/routes` - Definisi halaman (file-based routing). TanStack Router akan membuat file auto-generated \
  outeTree.gen.ts\.
- `/src/utils` - Utilitas pendukung, seperti konfigurasi _logger_ (Pino, dsb) dan pembantu _generic_.

## 🛠️ Scripts / Perintah

Proyek ini menggunakan \pnpm\ sebagai package manager. Tersedia perintah berikut:

- `pnpm dev` - Menjalankan server pengembangan (development).
- `pnpm build` - Kompilasi TypeScript dan build produksi.
- `pnpm preview` - Pratinjau hasil build.
- `pnpm format` - Memformat seluruh kode menggunakan Biome.
- `pnpm lint` - Melakukan pengecekan (linting) kode.
- `pnpm fix` - Membenarkan error _linting_ secara otomatis via Biome.

## 📦 Cara Memulai (Getting Started)

1. Clone repositori ini.
2. Instal pustaka (_dependencies_):
    ```ash
    pnpm install
    ```
3. Jalankan server lokal:
    ```ash
    pnpm dev
    ```
4. Akses melalui browser di http://localhost:5173\.

<!-- ## 📐 Konvensi

Proyek ini menggunakan prinsip _DRY (Don't Repeat Yourself)_ untuk _logic codebase_-nya, penanganan _error_ terpusat, serta standardisasi yang diwajibkan oleh _Biomes_ dan pola arsitektur berbasis fitur (_feature-driven architecture_). -->