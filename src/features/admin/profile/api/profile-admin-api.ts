import { queryOptions } from "@tanstack/react-query";
import { adminProfileSchema } from "@/features/admin/profile/schemas/admin-profile.schema";
import { adminGet, adminRequest } from "@/lib/api";

// Profil single-row (tanpa :id), jadi tidak memakai createAdminResource.
// Key diawali ["admin"], sehingga ikut di-invalidate oleh useRefreshAfterWrite.
export const profileKeys = { admin: ["admin", "profile"] as const };

export const adminProfileQuery = () =>
    queryOptions({
        queryKey: profileKeys.admin,
        queryFn: ({ signal }) => adminGet("/profile", adminProfileSchema, signal),
    });

/** PATCH /admin/profile. Server memakai strictObject dan minimal satu field. */
export const updateProfile = (payload: object) => adminRequest("PATCH", "/profile", adminProfileSchema, payload);