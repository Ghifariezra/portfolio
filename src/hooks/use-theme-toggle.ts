import { useTheme } from "next-themes";

/** Hook bersama untuk berpindah light/dark. `resolvedTheme` sudah memperhitungkan preferensi sistem. */
export function useThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return {
        isDark,
        toggleTheme: () => setTheme(isDark ? "light" : "dark"),
    };
}
