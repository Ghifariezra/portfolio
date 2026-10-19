/** Tambah halaman admin baru di sini setelah route-nya dibuat; sidebar merender dari daftar ini. */
export const ADMIN_NAV_ITEMS = [
    { to: "/admin", label: "Dashboard", exact: true },
    { to: "/admin/projects", label: "Projects", exact: false },
    { to: "/admin/apps", label: "Apps", exact: false },
    { to: "/admin/experiences", label: "Experience", exact: false },
    { to: "/admin/education", label: "Education", exact: false },
    { to: "/admin/certifications", label: "Certifications", exact: false },
    { to: "/admin/skills", label: "Skills", exact: false },
    { to: "/admin/cv", label: "CV", exact: false },
] as const;
