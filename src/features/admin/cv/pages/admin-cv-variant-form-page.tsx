import { useQuery } from "@tanstack/react-query";
import { AdminEditGate } from "../../components/admin-edit-gate";
import { AdminPageHeader } from "../../components/admin-page-header";
import { adminCvVariantQuery } from "../api/cv-variant-admin-api";
import { CvPreview } from "../components/cv-preview";
import { CvVariantForm } from "../components/cv-variant-form";
import { emptyCvForm, toCvForm } from "../lib/cv-form-state";

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
                    <CvPreview id={data.id} />
                </>
            )}
        </AdminEditGate>
    );
}
