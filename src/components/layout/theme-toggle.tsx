import { Moon, Sun } from "@/components/ui/icons";
import { useThemeToggle } from "@/hooks/use-theme-toggle";

export function ThemeToggle() {
    const { toggleTheme } = useThemeToggle();

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="cursor-pointer border-2 border-transparent p-1.5 hover:border-border hover:bg-accent"
        >
            {/* Dua ikon + variant dark: supaya tidak ada flicker sebelum tema terbaca */}
            <Sun size={18} className="hidden dark:block" />
            <Moon size={18} className="dark:hidden" />
        </button>
    );
}
