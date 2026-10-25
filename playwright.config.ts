import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
    testDir: "./tests/e2e/specs",
    tsconfig: "./tsconfig.e2e.json",
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 1 : 0,
    workers: isCI ? 2 : undefined,
    reporter: isCI
        ? [["github"], ["html", { open: "never" }], ["junit", { outputFile: "test-results/junit.xml" }]]
        : [["list"], ["html", { open: "never" }]],
    use: {
        baseURL: "http://localhost:4173",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
        { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
        { name: "mobile-safari", use: { ...devices["iPhone 15"] } },
    ],
    webServer: {
        // di CI, dist/ datang dari artifact job build
        command: isCI ? "pnpm preview --port 4173 --strictPort" : "pnpm build && pnpm preview --port 4173",
        url: "http://localhost:4173",
        reuseExistingServer: !isCI,
        timeout: 60_000,
        env: {
            VITE_API_URL: process.env.VITE_API_URL ?? "https://api.ezdev.xyz",
        },
    },
    timeout: 30_000,
    expect: { timeout: 10_000 },
});
