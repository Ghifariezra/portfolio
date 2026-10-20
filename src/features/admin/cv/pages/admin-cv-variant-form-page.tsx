import { useQuery } from "@tanstack/react-query";
import { AdminEditGate } from "@/features/admin/components/admin-edit-gate";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminCvVariantQuery } from "@/features/admin/cv/api/cv-variant-admin-api";
import { CvAdminDownload } from "@/features/admin/cv/components/cv-admin-download";
import { CvPreview } from "@/features/admin/cv/components/cv-preview";
import { CvVariantForm } from "@/features/admin/cv/components/cv-variant-form";
import { emptyCvForm, toCvForm } from "@/features/admin/cv/lib/cv-form-state";

export function NewCvVariantPage() {
    return (
        <section>
            <AdminPageHeader title="New CV variant" />
            <CvVariantForm initial={emptyCvForm} variantId={null} />
        </section>
    );
}

export function EditCvVariantPage({ id }: { id: string }) {
    const query = useQuery(adminCvVariantQuery(id));

    return (
        <AdminEditGate query={query} entity="CV variant" title={(v) => v.name}>
            {(data) => (
                <>
                    <CvVariantForm key={data.id} initial={toCvForm(data)} variantId={data.id} />
                    <CvAdminDownload id={data.id} />
                    <CvPreview id={data.id} />
                </>
            )}
        </AdminEditGate>
    );
}
