import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
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
        skills: "Skills",
        certifications: "Certifications",
        projects: "Projects",
        present: "Present",
        grade: "Grade",
        issued: "Issued",
        expires: "Expires",
        tech: "Technologies",
    },
    id: {
        summary: "Ringkasan",
        experience: "Pengalaman Kerja",
        education: "Pendidikan",
        skills: "Keahlian",
        certifications: "Sertifikasi",
        projects: "Proyek",
        present: "Sekarang",
        grade: "Nilai",
        issued: "Terbit",
        expires: "Berlaku hingga",
        tech: "Teknologi",
    },
} as const;

type Labels = Record<keyof (typeof LABELS)["en"], string>;
const labelsFor = (locale: string): Labels => (locale === "id" ? LABELS.id : LABELS.en);

const SKILL_CATEGORY_LABEL: Record<string, string> = {
    language: "Languages",
    framework: "Frameworks",
    testing: "Testing",
    practice: "Practices",
    database: "Databases",
    devops: "DevOps",
    data: "Data",
    ai: "AI",
    design: "Design",
    other: "Other",
};

type Part = string | null | undefined | false;
const join = (parts: Part[], separator = " | ") => parts.filter(Boolean).join(separator);
const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

/** Tanda hubung biasa (bukan en dash) supaya aman dibaca parser ATS lama. */
function monthRange(start: string | null, end: string | null, present: string): string | null {
    if (!start) return null;
    return `${formatMonth(start)} - ${end ? formatMonth(end) : present}`;
}

// Satu kolom, font standar (Helvetica bawaan PDF), hitam di atas putih, tanpa gambar/ikon/tabel.
const styles = StyleSheet.create({
    page: {
        paddingTop: 36,
        paddingBottom: 36,
        paddingHorizontal: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        lineHeight: 1.4,
        color: "#000000",
    },
    name: { fontFamily: "Helvetica-Bold", fontSize: 20 },
    headline: { fontSize: 11, marginTop: 2 },
    contact: { marginTop: 4, fontSize: 9.5 },
    section: { marginTop: 12 },
    heading: {
        fontFamily: "Helvetica-Bold",
        fontSize: 11,
        textTransform: "uppercase",
        borderBottomWidth: 1,
        borderBottomColor: "#000000",
        paddingBottom: 2,
        marginBottom: 6,
    },
    entry: { marginBottom: 7 },
    title: { fontFamily: "Helvetica-Bold" },
    meta: { fontSize: 9.5, color: "#333333" },
    line: { marginTop: 2, fontSize: 9.5 },
    bulletRow: { flexDirection: "row", marginTop: 1.5 },
    bullet: { width: 10 },
    bulletText: { flex: 1 },
});

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <View style={styles.section}>
            <Text style={styles.heading} minPresenceAhead={48}>
                {title}
            </Text>
            {children}
        </View>
    );
}

function Bullets({ items }: { items: readonly string[] }) {
    return (
        <>
            {items.map((item) => (
                <View key={item} style={styles.bulletRow} wrap={false}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                </View>
            ))}
        </>
    );
}

function Tech({ label, items }: { label: string; items: readonly string[] }) {
    if (items.length === 0) return null;
    return (
        <Text style={styles.line}>
            {label}: {items.join(", ")}
        </Text>
    );
}

export function CvPdfDocument({ cv }: { cv: CvDocument }) {
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

    const skillGroups = Object.entries(cv.skills);

    return (
        <Document title={`${basics.full_name} - CV`} author={basics.full_name}>
            <Page size="A4" style={styles.page}>
                {/* Nama dan kontak di badan halaman (bukan header/footer): beberapa ATS mengabaikan header/footer. */}
                <Text style={styles.name}>{basics.full_name}</Text>
                {basics.headline && <Text style={styles.headline}>{basics.headline}</Text>}
                {contact && <Text style={styles.contact}>{contact}</Text>}

                {basics.summary && (
                    <Section title={t.summary}>
                        <Text>{basics.summary}</Text>
                    </Section>
                )}

                {cv.experiences.length > 0 && (
                    <Section title={t.experience}>
                        {cv.experiences.map((e) => (
                            <View key={e.id} style={styles.entry}>
                                <Text style={styles.title}>{e.position}</Text>
                                <Text style={styles.meta}>
                                    {join([e.company, e.location, monthRange(e.start_date, e.end_date, t.present)])}
                                </Text>
                                {e.summary && <Text style={styles.line}>{e.summary}</Text>}
                                <Bullets items={e.bullets} />
                                <Tech label={t.tech} items={e.skills} />
                            </View>
                        ))}
                    </Section>
                )}

                {cv.projects.length > 0 && (
                    <Section title={t.projects}>
                        {cv.projects.map((p) => {
                            const link = p.repo_url ?? p.live_url;
                            return (
                                <View key={p.id} style={styles.entry}>
                                    <Text style={styles.title}>{p.title}</Text>
                                    <Text style={styles.meta}>
                                        {join([
                                            link && displayUrl(link),
                                            monthRange(p.start_date, p.end_date, t.present),
                                        ])}
                                    </Text>
                                    {p.description && <Text style={styles.line}>{p.description}</Text>}
                                    <Bullets items={p.bullets} />
                                    <Tech label={t.tech} items={p.skills} />
                                </View>
                            );
                        })}
                    </Section>
                )}

                {cv.education.length > 0 && (
                    <Section title={t.education}>
                        {cv.education.map((e) => (
                            <View key={e.id} style={styles.entry} wrap={false}>
                                <Text style={styles.title}>{e.program}</Text>
                                <Text style={styles.meta}>
                                    {join([
                                        e.institution,
                                        e.location,
                                        monthRange(e.start_date, e.end_date, t.present),
                                        e.grade && `${t.grade} ${e.grade}`,
                                    ])}
                                </Text>
                                {e.summary && <Text style={styles.line}>{e.summary}</Text>}
                                <Bullets items={e.bullets} />
                            </View>
                        ))}
                    </Section>
                )}

                {skillGroups.length > 0 && (
                    <Section title={t.skills}>
                        {skillGroups.map(([category, names]) => (
                            <Text key={category} style={styles.line}>
                                <Text style={styles.title}>{SKILL_CATEGORY_LABEL[category] ?? category}: </Text>
                                {names.join(", ")}
                            </Text>
                        ))}
                    </Section>
                )}

                {cv.certifications.length > 0 && (
                    <Section title={t.certifications}>
                        {cv.certifications.map((c) => (
                            <View key={c.id} style={styles.entry} wrap={false}>
                                <Text>
                                    <Text style={styles.title}>{c.name}</Text>
                                    {` - ${c.issuer}`}
                                </Text>
                                <Text style={styles.meta}>
                                    {join([
                                        c.issued_date && `${t.issued} ${formatMonth(c.issued_date)}`,
                                        c.expires_date && `${t.expires} ${formatMonth(c.expires_date)}`,
                                        c.credential_id && `ID ${c.credential_id}`,
                                    ])}
                                </Text>
                            </View>
                        ))}
                    </Section>
                )}
            </Page>
        </Document>
    );
}
