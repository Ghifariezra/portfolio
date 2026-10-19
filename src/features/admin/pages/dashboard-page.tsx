import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { adminAppsQuery } from "../apps/api/app-admin-api";
import { adminCertificationsQuery } from "../certifications/api/certification-admin-api";
import type { ADMIN_NAV_ITEMS } from "../components/admin-nav-items";
import { AdminPageHeader } from "../components/admin-page-header";
import { adminCvVariantsQuery } from "../cv/api/cv-variant-admin-api";
import { adminEducationListQuery } from "../education/api/education-admin-api";
import { adminExperiencesQuery } from "../experiences/api/experience-admin-api";
import { adminProjectsQuery } from "../projects/api/project-admin-api";
import { adminSkillsQuery } from "../skills/api/skill-admin-queries";

type NavTarget = (typeof ADMIN_NAV_ITEMS)[number]["to"];

interface ResourceCardProps {
    to: NavTarget;
    title: string;
    isPending: boolean;
    isError: boolean;
    /** Ringkasan satu baris, mis. "5 total, 4 visible". */
    summary?: string;
}

function ResourceCard({ to, title, isPending, isError, summary }: ResourceCardProps) {
    return (
        <Link
            to={to}
            className="flex flex-col gap-2 border-2 border-border bg-card p-5 transition-transform hover:-translate-y-0.5 hover:shadow-brutal dark:hover:shadow-none"
        >
            <h2 className="font-heading text-lg font-semibold">{title}</h2>
            {isPending && <Skeleton className="h-4 w-1/2" />}
            {isError && <p className="text-sm text-destructive">Could not load.</p>}
            {summary && <p className="font-mono text-xs text-muted-foreground">{summary}</p>}
        </Link>
    );
}

const visibilitySummary = (items?: { is_visible: boolean }[]) =>
    items ? `${items.length} total, ${items.filter((i) => i.is_visible).length} visible` : undefined;

export function DashboardPage() {
    const projects = useQuery(adminProjectsQuery());
    const apps = useQuery(adminAppsQuery());
    const experiences = useQuery(adminExperiencesQuery());
    const education = useQuery(adminEducationListQuery());
    const certifications = useQuery(adminCertificationsQuery());
    const skills = useQuery(adminSkillsQuery());
    const cv = useQuery(adminCvVariantsQuery());

    const defaultCv = cv.data?.find((v) => v.is_default);

    return (
        <section>
            <AdminPageHeader
                title="Dashboard"
                description="Kelola data portfolio. Perubahan baru tampil di website setelah cache publik habis, biasanya beberapa menit."
            />

            <div className="grid gap-5 sm:grid-cols-2">
                <ResourceCard
                    to="/admin/projects"
                    title="Projects"
                    isPending={projects.isPending}
                    isError={projects.isError}
                    summary={visibilitySummary(projects.data)}
                />
                <ResourceCard
                    to="/admin/apps"
                    title="Apps"
                    isPending={apps.isPending}
                    isError={apps.isError}
                    summary={visibilitySummary(apps.data)}
                />
                <ResourceCard
                    to="/admin/experiences"
                    title="Experience"
                    isPending={experiences.isPending}
                    isError={experiences.isError}
                    summary={visibilitySummary(experiences.data)}
                />
                <ResourceCard
                    to="/admin/education"
                    title="Education"
                    isPending={education.isPending}
                    isError={education.isError}
                    summary={visibilitySummary(education.data)}
                />
                <ResourceCard
                    to="/admin/certifications"
                    title="Certifications"
                    isPending={certifications.isPending}
                    isError={certifications.isError}
                    summary={visibilitySummary(certifications.data)}
                />
                <ResourceCard
                    to="/admin/skills"
                    title="Skills"
                    isPending={skills.isPending}
                    isError={skills.isError}
                    summary={visibilitySummary(skills.data)}
                />
                <ResourceCard
                    to="/admin/cv"
                    title="CV"
                    isPending={cv.isPending}
                    isError={cv.isError}
                    summary={
                        cv.data
                            ? `${cv.data.length} variants${defaultCv ? `, default: ${defaultCv.name}` : ", no default yet"}`
                            : undefined
                    }
                />
            </div>

            <EmptyState className="mt-8">Profil dan pengaturan lain menyusul dengan pola yang sama.</EmptyState>
        </section>
    );
}
