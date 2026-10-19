import { useQuery } from "@tanstack/react-query";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { isNotFound } from "@/lib/api";
import { AdminPageHeader } from "../../components/admin-page-header";
import { adminProjectQuery } from "../api/project-admin-api";
import { ProjectForm } from "../components/project-form";
import { emptyProjectForm, toFormState } from "../lib/project-form-state";

export function NewProjectPage() {
    return (
        <section>
            <AdminPageHeader title="New project" />
            <ProjectForm initial={emptyProjectForm} projectId={null} />
        </section>
    );
}

export function EditProjectPage({ id }: { id: string }) {
    const { data, isPending, isError, error, refetch } = useQuery(adminProjectQuery(id));

    return (
        <section>
            <AdminPageHeader title={data ? data.title : "Edit project"} />

            {isPending && <Skeleton className="h-96 max-w-2xl border-2 border-border" />}
            {isError && (
                <ErrorState
                    message={isNotFound(error) ? "Project not found." : "Could not load this project."}
                    onRetry={isNotFound(error) ? undefined : () => refetch()}
                />
            )}
            {/* key: form dibuat ulang kalau yang dibuka project lain, state lama tidak terbawa */}
            {data && <ProjectForm key={data.id} initial={toFormState(data)} projectId={data.id} />}
        </section>
    );
}
