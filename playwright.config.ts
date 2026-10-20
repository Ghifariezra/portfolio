import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e/specs",
    tsconfig: "./tsconfig.e2e.json",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: [
        ["list"],
        ["html", { open: "never" }],
        ["junit", { outputFile: "test-results/junit.xml" }],
        ["json", { outputFile: "test-results/results.json" }],
    ],
    use: {
        baseURL: "http://localhost:4173",
        trace: "on-first-retry",
    },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
        { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
        { name: "mobile-safari", use: { ...devices["iPhone 15"] } },
    ],
    webServer: {
        command: "pnpm build && pnpm preview --port 4173",
        url: "http://localhost:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
            VITE_API_URL: process.env.VITE_API_URL ?? "https://api.ezdev.xyz",
        },
    },
    timeout: 60_000,
    expect: { timeout: 15_000 },
});
