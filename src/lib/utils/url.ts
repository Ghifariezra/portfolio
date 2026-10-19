/** Nilai dari GitHub (mis. homepage) tidak divalidasi API, jadi cek skemanya sebelum dipakai sebagai href. */
export const isHttpUrl = (value: string | null | undefined): value is string =>
    !!value && /^https?:\/\//i.test(value);
