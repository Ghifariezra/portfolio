import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Fragment, type ReactNode } from "react";
import type { CvDocument } from "@/features/cv/schemas/cv.schema";
import { formatMonth } from "@/lib/utils";

// ATS membaca teks PDF apa adanya. Tanpa ini, react-pdf memenggal kata dengan tanda hubung di akhir baris
// ("Auto-" / "mation"), dan itu merusak pencocokan keyword.
Font.registerHyphenationCallback((word) => [word]);

const LABELS = {
    en: {
        summary: "Summary",
        experience: "Experience",
        education: "Education",
        training: "Training",
        skills: "Skills",
        certifications: "Certifications",
        projects: "Projects",
        present: "Present",
        grade: "Grade",
        issued: "Issued",
        expires: "Expires",
    },
    id: {
        summary: "Ringkasan",
        experience: "Pengalaman Kerja",
        education: "Pendidikan",
        training: "Pelatihan",
        skills: "Keahlian",
        certifications: "Sertifikasi",
        projects: "Proyek",
        present: "Sekarang",
        grade: "Nilai",
        issued: "Terbit",
        expires: "Berlaku hingga",
    },
} as const;

type Labels = Record<keyof (typeof LABELS)["en"], string>;
const labelsFor = (locale: string): Labels => (locale === "id" ? LABELS.id : LABELS.en);

// Urutan key di sini = urutan default kategori di CV (yang paling relevan untuk QA di atas).
const SKILL_CATEGORY_LABEL: Record<string, string> = {
    testing: "Testing",
    practice: "Practices",
    language: "Languages",
    devops: "DevOps",
    framework: "Frameworks",
    database: "Databases",
    ai: "AI",
    data: "Data",
    design: "Design",
    other: "Other",
};

const SKILL_CATEGORY_ORDER = Object.keys(SKILL_CATEGORY_LABEL);

// Kategori yang tidak ada di `order` otomatis jatuh ke paling bawah.
const rankIn = (order: readonly string[], category: string) => {
    const i = order.indexOf(category);
    return i === -1 ? order.length : i;
};

export type SectionKey =
    | "summary"
    | "experience"
    | "projects"
    | "education"
    | "training"
    | "skills"
    | "certifications";

/** Opsi render per varian CV. Semua opsional; tanpa opsi, hasilnya sama seperti sebelumnya. */
export interface CvRenderOptions {
    /** Urutan section. Section yang tidak disebut tidak ditampilkan. */
    sections?: SectionKey[];
    /** Whitelist sekaligus urutan kategori skill. Kosong = semua kategori, urutan default. */
    skillCategories?: string[];
    /** Batas bullet per entry (experience, project, education, training). */
    maxBullets?: number;
    /** Sembunyikan credential ID di sertifikasi. */
    hideCredentialId?: boolean;
}

const DEFAULT_SECTIONS: SectionKey[] = [
    "summary",
    "experience",
    "projects",
    "education",
    "training",
    "skills",
    "certifications",
];

/** Preset siap pakai. Contoh: <CvPdfDocument cv={cv} options={CV_PRESETS.qaIntern} /> */
export const CV_PRESETS = {
    qaIntern: {
        sections: ["summary", "skills", "projects", "training", "experience", "education", "certifications"],
        skillCategories: ["testing", "practice", "language", "devops", "database"],
        maxBullets: 4,
    },
    fullStack: {
        sections: ["summary", "experience", "projects", "skills", "education", "training", "certifications"],
        skillCategories: ["language", "framework", "database", "devops", "ai", "testing"],
    },
} satisfies Record<string, CvRenderOptions>;

type Part = string | null | undefined | false;
const join = (parts: Part[], separator = " | ") => parts.filter(Boolean).join(separator);
const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

/**
 * Tanda hubung biasa (bukan en dash) supaya aman dibaca parser ATS lama.
 * Kalau bulan awal dan akhir sama (mis. kursus sebulan), tampilkan satu bulan saja.
 */
function monthRange(start: string | null, end: string | null, present: string): string | null {
    if (!start) return null;
    const from = formatMonth(start);
    if (!end) return `${from} - ${present}`;
    const to = formatMonth(end);
    return from === to ? from : `${from} - ${to}`;
}

type CvEducation = CvDocument["education"][number];

// Selain "training" (termasuk nilai tak dikenal dari API) dianggap pendidikan formal.
const isTraining = (e: CvEducation) => e.kind === "training";

// Satu kolom, font standar (Helvetica bawaan PDF), hitam di atas putih, tanpa gambar/ikon/tabel.
// lineHeight ditulis eksplisit di setiap style yang fontSize-nya beda dari body: lineHeight di `page`
// diwariskan ke anak-anaknya, dan tanpa ini nama (20pt) mendapat tinggi baris body sehingga menimpa headline.
const styles = StyleSheet.create({
    page: {
        paddingTop: 32,
        paddingBottom: 32,
        paddingHorizontal: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        lineHeight: 1.35,
        color: "#000000",
    },
    name: { fontFamily: "Helvetica-Bold", fontSize: 20, lineHeight: 1.2 },
    headline: { fontSize: 11, lineHeight: 1.3, marginTop: 2 },
    contact: { marginTop: 4, fontSize: 9.5, lineHeight: 1.35 },
    // Jarak di atas blok: `blockFirst` = awal section (setelah judul section), `block` = entry berikutnya.
    blockFirst: { marginTop: 10 },
    block: { marginTop: 6 },
    heading: {
        fontFamily: "Helvetica-Bold",
        fontSize: 11,
        lineHeight: 1.2,
        textTransform: "uppercase",
        borderBottomWidth: 1,
        borderBottomColor: "#000000",
        paddingBottom: 2,
        marginBottom: 5,
    },
    title: { fontFamily: "Helvetica-Bold" },
    meta: { fontSize: 9.5, lineHeight: 1.35, color: "#333333" },
    line: { marginTop: 2, fontSize: 9.5, lineHeight: 1.35 },
    // Bullet menjorok ke dalam dan sedikit berjarak dari deskripsi di atasnya.
    bulletRow: { flexDirection: "row", marginTop: 1, paddingLeft: 8 },
    bulletRowFirst: { flexDirection: "row", marginTop: 3, paddingLeft: 8 },
    bullet: { width: 10 },
    bulletText: { flex: 1 },
});

function Heading({ title }: { title: string }) {
    return <Text style={styles.heading}>{title}</Text>;
}

function BulletRow({ text, first = false }: { text: string; first?: boolean }) {
    return (
        <View style={first ? styles.bulletRowFirst : styles.bulletRow} wrap={false}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{text}</Text>
        </View>
    );
}

interface EntryProps {
    /** Judul section; hanya diisi pada entry pertama di section tersebut. */
    heading?: string;
    title: string;
    meta: string;
    summary?: string | null;
    bullets: readonly string[];
}

/**
 * Satu entry = beberapa blok yang semuanya anak langsung <Page>, tanpa pembungkus:
 *   1. blok kepala (judul section kalau ada, judul, meta, deskripsi, bullet pertama): tidak pernah terbelah
 *   2. satu baris per bullet berikutnya: tidak pernah terbelah
 * Dengan begitu halaman hanya bisa putus DI ANTARA blok, tidak pernah di dalam sebuah wrapper bersarang.
 * Struktur bersarang yang terbelah (wrapper yang bisa terpotong berisi blok wrap={false}) bikin teks
 * di react-pdf bertumpuk saat batas halaman jatuh di tengah entry.
 */
function Entry({ heading, title, meta, summary, bullets }: EntryProps) {
    const [firstBullet, ...restBullets] = bullets;
    return (
        <>
            <View style={heading ? styles.blockFirst : styles.block} wrap={false}>
                {heading ? <Heading title={heading} /> : null}
                <Text style={styles.title}>{title}</Text>
                {meta ? <Text style={styles.meta}>{meta}</Text> : null}
                {summary ? <Text style={styles.line}>{summary}</Text> : null}
                {firstBullet ? <BulletRow text={firstBullet} first /> : null}
            </View>
            {restBullets.map((text, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: daftar statis; teks bullet bisa kembar
                <BulletRow key={`${i}-${text}`} text={text} />
            ))}
        </>
    );
}

export function CvPdfDocument({ cv, options = {} }: { cv: CvDocument; options?: CvRenderOptions }) {
    const t = labelsFor(cv.variant.locale);
    const { basics } = cv;

    const contact = join([
        basics.email,
        basics.phone,
        basics.location,
        basics.linkedin_url && displayUrl(basics.linkedin_url),
        basics.github_url && displayUrl(basics.github_url),
        basics.website_url && displayUrl(basics.website_url),
    ]);

    const limit = (bullets: readonly string[]) => (options.maxBullets ? bullets.slice(0, options.maxBullets) : bullets);

    // Whitelist + urutan kategori skill; tanpa opsi, pakai semua kategori dengan urutan default.
    const categoryOrder = options.skillCategories ?? SKILL_CATEGORY_ORDER;
    const skillGroups = Object.entries(cv.skills)
        .filter(([category]) => !options.skillCategories || options.skillCategories.includes(category))
        .sort(([a], [b]) => rankIn(categoryOrder, a) - rankIn(categoryOrder, b));

    // Satu data, dua section: pendidikan formal dan training/bootcamp (urutan dari API dipertahankan).
    const formal = cv.education.filter((e) => !isTraining(e));
    const training = cv.education.filter(isTraining);

    const educationMeta = (e: CvEducation) =>
        join([
            e.institution,
            e.location,
            monthRange(e.start_date, e.end_date, t.present),
            e.grade && `${t.grade} ${e.grade}`,
        ]);

    // Satu section = satu entri. Fragment tidak membuat View baru, jadi semua blok tetap
    // anak langsung <Page> (penting supaya page break tidak membuat teks bertumpuk).
    const blocks: Record<SectionKey, ReactNode> = {
        summary: basics.summary ? (
            <View style={styles.blockFirst} wrap={false}>
                <Heading title={t.summary} />
                <Text>{basics.summary}</Text>
            </View>
        ) : null,

        experience: cv.experiences.map((e, i) => (
            <Entry
                key={e.id}
                heading={i === 0 ? t.experience : undefined}
                title={e.position}
                meta={join([e.company, e.location, monthRange(e.start_date, e.end_date, t.present)])}
                summary={e.summary}
                bullets={limit(e.bullets)}
            />
        )),

        projects: cv.projects.map((p, i) => {
            const link = p.repo_url ?? p.live_url;
            return (
                <Entry
                    key={p.id}
                    heading={i === 0 ? t.projects : undefined}
                    title={p.title}
                    meta={join([link && displayUrl(link), monthRange(p.start_date, p.end_date, t.present)])}
                    summary={p.description}
                    bullets={limit(p.bullets)}
                />
            );
        }),

        education: formal.map((e, i) => (
            <Entry
                key={e.id}
                heading={i === 0 ? t.education : undefined}
                title={e.program}
                meta={educationMeta(e)}
                summary={e.summary}
                bullets={limit(e.bullets)}
            />
        )),

        training: training.map((e, i) => (
            <Entry
                key={e.id}
                heading={i === 0 ? t.training : undefined}
                title={e.program}
                meta={educationMeta(e)}
                summary={e.summary}
                bullets={limit(e.bullets)}
            />
        )),

        skills: skillGroups.map(([category, names], i) => (
            <View key={category} style={i === 0 ? styles.blockFirst : undefined} wrap={false}>
                {i === 0 ? <Heading title={t.skills} /> : null}
                <Text style={styles.line}>
                    <Text style={styles.title}>{SKILL_CATEGORY_LABEL[category] ?? category}: </Text>
                    {names.join(", ")}
                </Text>
            </View>
        )),

        certifications: cv.certifications.map((c, i) => (
            <View key={c.id} style={i === 0 ? styles.blockFirst : styles.block} wrap={false}>
                {i === 0 ? <Heading title={t.certifications} /> : null}
                <Text>
                    <Text style={styles.title}>{c.name}</Text>
                    {` - ${c.issuer}`}
                </Text>
                <Text style={styles.meta}>
                    {join([
                        c.issued_date && `${t.issued} ${formatMonth(c.issued_date)}`,
                        c.expires_date && `${t.expires} ${formatMonth(c.expires_date)}`,
                        !options.hideCredentialId && c.credential_id && `ID ${c.credential_id}`,
                    ])}
                </Text>
            </View>
        )),
    };

    return (
        <Document title={`${basics.full_name} - CV`} author={basics.full_name}>
            <Page size="A4" style={styles.page}>
                {/* Nama dan kontak di badan halaman (bukan header/footer): beberapa ATS mengabaikan header/footer. */}
                <Text style={styles.name}>{basics.full_name}</Text>
                {basics.headline && <Text style={styles.headline}>{basics.headline}</Text>}
                {contact && <Text style={styles.contact}>{contact}</Text>}

                {(options.sections ?? DEFAULT_SECTIONS).map((key) => (
                    <Fragment key={key}>{blocks[key]}</Fragment>
                ))}
            </Page>
        </Document>
    );
}