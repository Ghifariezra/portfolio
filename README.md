# 🚀 Personal Portfolio

Website portofolio full-stack dengan **dashboard admin**, blog/notes berbasis rich-text, direktori aplikasi dengan metrik Microsoft Store, dan halaman aktivitas GitHub. Dibangun dengan ekosistem React modern dan arsitektur **type-safe** end-to-end (TanStack + Zod).

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-2-60A5FA?logo=biome&logoColor=white)

## ✨ Fitur

### Halaman publik
- **Home** — hero, featured projects, sertifikasi (dikelompokkan dengan collapsible), ringkasan GitHub.
- **Projects & Notes** — daftar dan halaman detail per slug, dengan konten rich-text yang dirender aman (XSS-sanitized).
- **Apps** — direktori aplikasi dengan metrik lifetime dari Microsoft Store.
- **GitHub** — grafik kontribusi, feed aktivitas yang bisa difilter, dan repo paling aktif.
- **Contact** — form validasi dengan TanStack Form + Zod.
- Desain neo-brutalist, navbar responsif untuk mobile, dark mode, dan halaman 404 kustom.

### Reader konten (blog & project)
Konten BlockNote dirender dengan blok khusus:
- Diagram **ERD / React Flow** dengan auto-layout (dagre)
- **File tree** interaktif
- Embed **Google Colab / GitHub Gist**
- Preview **PDF** dan **Google Slides** (termasuk deteksi link Slides langsung)
- Syntax highlighting dengan **Shiki**, markdown dengan `react-markdown` + `remark-gfm`

### Dashboard admin
Terproteksi login (`/auth/admin`), berisi modul:

| Modul | Fungsi |
|---|---|
| Overview | Ringkasan analitik |
| Posts | CRUD blog dengan rich-text editor (BlockNote), upload gambar, tag |
| Projects | CRUD project, tag, kolaborator, gambar |
| Apps | Kelola direktori aplikasi dan tag |
| Collaborators | Kolaborator beserta link |
| Taxonomies | Kategori dan tag |
| Settings | Profil, skills, dan sertifikat |

Konten dapat dikunci/dibuka (lock/unlock), dan jadwal (schedules) dikelola dari API yang sama.

## 💻 Tech Stack

| Area | Teknologi |
|---|---|
| Framework | React 19, TypeScript 6 |
| Bundler | Vite 8 (+ `@vitejs/plugin-react`) |
| Routing | TanStack Router (file-based, auto code-splitting) |
| Data | TanStack React Query 5 (server state), Zustand 5 (client state), Axios |
| Form & validasi | TanStack Form, Zod 4 |
| Styling | Tailwind CSS v4, `tw-animate-css`, `next-themes` |
| UI | shadcn (Radix UI), animate-ui, Phosphor Icons, Lucide, Motion |
| Editor & visual | BlockNote, Shiki, React Flow (`@xyflow/react`) + dagre, React Markdown |
| Keamanan | Sanitasi XSS (`xss`), auth store dengan Zustand |
| Testing | Vitest 4, React Testing Library, jsdom |
| Kualitas kode | Biome 2 (lint + format + organize imports) |
| CI/CD | GitHub Actions → GitHub Pages |

## 🏗️ Arsitektur

Frontend ini berpasangan dengan **API terpisah** (`portfolio-api`: Hono di Cloudflare Workers dengan Supabase). Tanggung jawab dipisah per lapisan:

```
Route (TanStack Router)
  └─ Feature (src/lib/features)       ← komposisi halaman
       └─ Hook (src/lib/hooks)        ← logika UI + form
            └─ Action (src/lib/actions)   ← React Query: query keys, useQuery/useMutation, invalidasi
                 └─ Service (src/lib/services) ← singleton pemanggil API (Axios)
                      └─ Schema (src/lib/schemas) ← validasi Zod
```

### Strategi cache & invalidasi

Supaya perubahan di dashboard langsung terlihat:

- **Client:** setiap mutation konten memanggil `invalidateContent()` (`src/lib/actions/invalidate.ts`) yang me-refetch list dashboard dan semua query halaman publik (kecuali data GitHub).
- **API (dashboard):** endpoint GET yang dipakai dashboard mengirim `Cache-Control: no-store`.
- **API (publik):** response di-cache di edge dengan `s-maxage` dan `max-age=0`, lalu cache dibersihkan otomatis setiap ada operasi tulis (purge-on-write).

## 🚄 Struktur Proyek

```
src/
├── components/
│   ├── animate-ui/     # primitives & komponen animasi
│   ├── contact/        # bagian form kontak
│   ├── settings/       # section profil, skills, sertifikat
│   ├── shared/         # navbar, footer, reader, blok embed (PDF, Slides, Gist, ERD, file tree)
│   └── ui/             # komponen dasar (shadcn) & rich-text editor
├── hooks/              # custom hooks lintas fitur
├── lib/
│   ├── actions/        # React Query actions + query keys (+ invalidate.ts)
│   ├── features/       # domain tiap fitur (home, projects, notes, apps, github, contact, dashboard, admin)
│   ├── hooks/          # hooks per domain (use-blog, use-project, use-apps, ...)
│   ├── schemas/        # skema Zod
│   ├── services/       # singleton API services
│   └── stores/         # Zustand (auth)
├── routes/             # definisi route (folder-based, TanStack Router)
└── utils/              # xss, middleware (Axios), logger
test/                   # actions, services, schemas, stores, utils
```

## 🛠️ Scripts

Proyek ini memakai **pnpm**.

| Perintah | Fungsi |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Type-check (`tsc -b`) + build production |
| `pnpm preview` | Pratinjau hasil build |
| `pnpm check` | Lint + format + organize imports (Biome) |
| `pnpm lint` | Linter saja |
| `pnpm format` | Format ulang file |
| `pnpm fix` | Auto-fix masalah Biome |
| `pnpm test` | Vitest (watch mode) |
| `pnpm test:run` | Vitest sekali jalan (dipakai CI) |
| `pnpm test:ui` | UI interaktif Vitest |

## 📔 Memulai

1. Clone repositori, lalu install dependency:
   ```bash
   pnpm install
   ```
2. Buat file `.env` dan isi alamat API:
   ```env
   VITE_API_URL=<alamat-api-kamu>/api/v1
   ```
3. Jalankan development server:
   ```bash
   pnpm dev
   ```
4. Buka `http://localhost:5173`.

## 🧪 Testing

Test mencakup lapisan **actions, services, schemas, stores, dan utils** (39 file test) dengan Vitest + jsdom + React Testing Library. Hook React Query diuji bersama perilaku invalidasinya, jadi perubahan pada strategi cache langsung tertangkap.

```bash
pnpm test:run
```

## ⚡ Performa & SEO

- **Code splitting terarah:** chunk terpisah untuk editor, markdown, React Flow, router, query, ikon, UI, dan state; ditambah auto code-splitting dari TanStack Router.
- **Build bersih:** `console.*` dan `logger.*` (non-error) dihapus saat production lewat opsi `pure` esbuild.
- **Tree-shaking aman:** modul dengan side-effect global (font, `@xyflow`, BlockNote) dipertahankan.
- **Sitemap dinamis:** `vite-plugin-sitemap` mengambil slug project dan blog dari API saat build, lalu membuat `sitemap.xml` dan `robots.txt` (route `/auth/admin` dan `/dashboard` dikecualikan).
- **Metadata SEO:** title, description, Open Graph, dan Twitter Cards per route.

## 🚢 CI/CD

Setiap push ke `main` menjalankan pipeline GitHub Actions:

1. **test** — `pnpm test:run`
2. **build** — `pnpm build` (membaca `VITE_API_URL` dari repository variables), lalu `404.html` disalin dari `index.html` agar routing SPA bekerja
3. **deploy** — publikasi ke GitHub Pages

Build hanya berjalan kalau test lolos.

## 📒 Konvensi

- **Biome** sebagai satu-satunya linter + formatter: indentasi tab, tanda kutip ganda, import otomatis terurut, dan `noUnusedImports`/`noUnusedVariables` sebagai error.
- **Singleton service** untuk semua pemanggilan API; error handling terpusat di middleware Axios.
- **Pemisahan tanggung jawab** ketat antara route, feature, hook, action, service, schema, dan store.
- **DRY:** logika invalidasi cache dipusatkan di `invalidateContent()` alih-alih disalin per mutation.
- **Commit** mengikuti Conventional Commits (`feat`, `fix`, `test`, `chore`, `style`, ...).