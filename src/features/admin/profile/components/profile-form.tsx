import { Link } from "@tanstack/react-router";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { FormField } from "@/components/ui/form-field";
import { inputClass } from "@/components/ui/form-styles";
import { FormFooter } from "@/features/admin/components/form-footer";
import { useResourceForm } from "@/features/admin/lib/use-resource-form";
import { updateProfile } from "@/features/admin/profile/api/profile-admin-api";
import { type ProfileFormState, toProfilePayload } from "@/features/admin/profile/lib/profile-form-state";

interface ProfileFormProps {
    initial: ProfileFormState;
    profileId: string;
}

export function ProfileForm({ initial, profileId }: ProfileFormProps) {
    // Profil selalu sudah ada (single-row), jadi tidak ada langkah "create" dan tidak ada redirect setelah simpan.
    const { form, set, submit, savedId, partial, errors, mutation } = useResourceForm({
        initial,
        id: profileId,
        onSaved: () => {},
        save: ({ form: values }) => updateProfile(toProfilePayload(values)),
    });

    return (
        <form onSubmit={submit} className="flex max-w-2xl flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Full name *" htmlFor="full_name" error={errors.full_name}>
                    <input
                        id="full_name"
                        required
                        value={form.full_name}
                        onChange={(e) => set("full_name", e.target.value)}
                        aria-invalid={!!errors.full_name}
                        className={inputClass}
                    />
                </FormField>
                <FormField
                    label="Headline"
                    htmlFor="headline"
                    hint="Default untuk semua CV. Bisa ditimpa lewat Target role di tiap varian CV."
                    error={errors.headline}
                >
                    <input
                        id="headline"
                        value={form.headline}
                        onChange={(e) => set("headline", e.target.value)}
                        aria-invalid={!!errors.headline}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <FormField
                label="Summary"
                htmlFor="summary"
                hint="Default untuk semua CV. Bisa ditimpa lewat Summary di tiap varian CV."
                error={errors.summary}
            >
                <textarea
                    id="summary"
                    rows={5}
                    value={form.summary}
                    onChange={(e) => set("summary", e.target.value)}
                    aria-invalid={!!errors.summary}
                    className={inputClass}
                />
            </FormField>

            <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="Email *" htmlFor="email" error={errors.email}>
                    <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        aria-invalid={!!errors.email}
                        className={inputClass}
                    />
                </FormField>
                <FormField
                    label="Phone"
                    htmlFor="phone"
                    hint="Tidak pernah dikirim endpoint publik. Hanya muncul di PDF yang diunduh dari admin."
                    error={errors.phone}
                >
                    <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        aria-invalid={!!errors.phone}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
                <FormField label="City" htmlFor="city" error={errors.city}>
                    <input
                        id="city"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                        aria-invalid={!!errors.city}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Region" htmlFor="region" error={errors.region}>
                    <input
                        id="region"
                        value={form.region}
                        onChange={(e) => set("region", e.target.value)}
                        aria-invalid={!!errors.region}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Country *" htmlFor="country" error={errors.country}>
                    <input
                        id="country"
                        required
                        value={form.country}
                        onChange={(e) => set("country", e.target.value)}
                        aria-invalid={!!errors.country}
                        className={inputClass}
                    />
                </FormField>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <FormField label="LinkedIn URL" htmlFor="linkedin_url" error={errors.linkedin_url}>
                    <input
                        id="linkedin_url"
                        type="url"
                        value={form.linkedin_url}
                        onChange={(e) => set("linkedin_url", e.target.value)}
                        aria-invalid={!!errors.linkedin_url}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="GitHub URL" htmlFor="github_url" error={errors.github_url}>
                    <input
                        id="github_url"
                        type="url"
                        value={form.github_url}
                        onChange={(e) => set("github_url", e.target.value)}
                        aria-invalid={!!errors.github_url}
                        className={inputClass}
                    />
                </FormField>
                <FormField
                    label="Website URL"
                    htmlFor="website_url"
                    hint="Mis. https://ezdev.xyz. Tampil di header CV."
                    error={errors.website_url}
                >
                    <input
                        id="website_url"
                        type="url"
                        value={form.website_url}
                        onChange={(e) => set("website_url", e.target.value)}
                        aria-invalid={!!errors.website_url}
                        className={inputClass}
                    />
                </FormField>
                <FormField label="Avatar URL" htmlFor="avatar_url" error={errors.avatar_url}>
                    <input
                        id="avatar_url"
                        type="url"
                        value={form.avatar_url}
                        onChange={(e) => set("avatar_url", e.target.value)}
                        aria-invalid={!!errors.avatar_url}
                        className={inputClass}
                    />
                </FormField>
            </div>

            {mutation.isSuccess && (
                <p role="status" className="font-mono text-xs text-muted-foreground">
                    Profile saved.
                </p>
            )}

            <FormFooter
                error={mutation.error}
                partial={partial}
                pending={mutation.isPending}
                submitLabel={savedId ? "Save changes" : "Save profile"}
                cancel={
                    <Link to="/admin" className={brutalButtonClass("card")}>
                        Back to dashboard
                    </Link>
                }
            />
        </form>
    );
}
