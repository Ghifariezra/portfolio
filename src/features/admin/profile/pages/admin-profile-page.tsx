import { useQuery } from "@tanstack/react-query";
import { AdminEditGate } from "@/features/admin/components/admin-edit-gate";
import { adminProfileQuery } from "@/features/admin/profile/api/profile-admin-api";
import { ProfileForm } from "@/features/admin/profile/components/profile-form";
import { toProfileForm } from "@/features/admin/profile/lib/profile-form-state";

export function AdminProfilePage() {
    const query = useQuery(adminProfileQuery());

    return (
        <AdminEditGate query={query} entity="profile" title={() => "Profile"}>
            {(data) => <ProfileForm key={data.id} initial={toProfileForm(data)} profileId={data.id} />}
        </AdminEditGate>
    );
}