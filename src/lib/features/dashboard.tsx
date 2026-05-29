import {
	Bell,
	FolderOpen,
	Gear, // Import icon untuk Settings
	// Image as ImageIcon,
	Moon, // Import icon untuk Media (diberi alias agar tidak bentrok)
	NotePencil, // Import icon untuk Posts
	SignOut,
	SquaresFour,
	Sun,
	Tag,
	Users, // Import icon untuk Taxonomies
} from "@phosphor-icons/react";
import { Link, Outlet } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar";
import { ThemeToggler } from "@/components/animate-ui/primitives/effects/theme-toggler";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthStore } from "../stores/auth.store";

export function RouteComponent() {
	const { handleLogout, isLoggingOut } = useAuth();
	const { theme, resolvedTheme, setTheme } = useTheme();
	const profile = useAuthStore((state) => state.profile);

	return (
		<SidebarProvider>
			<div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
				{/* ================= SIDEBAR ================= */}
				<Sidebar className="w-64 border-r-2 dark:border-r border-border bg-card dark:bg-[#101415] z-40 flex flex-col h-screen">
					<SidebarHeader className="p-4 pt-6 border-b-2 dark:border-b border-border">
						<div className="flex items-center gap-4">
							<img
								alt="Admin Avatar"
								src={profile?.image || "https://github.com/ghifariezra.png"}
								className="w-12 h-12 rounded border-2 dark:border border-border object-cover"
							/>
							<div>
								<h1 className="font-heading text-lg font-bold leading-none text-foreground">
									{profile?.fullname || "Admin Console"}
								</h1>
								<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
									{profile?.role || "System Architect"}
								</p>
							</div>
						</div>
					</SidebarHeader>

					<SidebarContent className="p-4 flex-1 overflow-y-auto">
						<SidebarMenu className="gap-2">
							{/* OVERVIEW / DASHBOARD */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="w-full flex items-center gap-3 px-3 py-2 font-mono font-medium rounded-md border-2 border-transparent transition-all"
								>
									<Link
										to="/dashboard"
										activeProps={{
											className:
												"bg-secondary text-secondary-foreground font-bold shadow-brutal-sm dark:shadow-none dark:border-border hover:opacity-90",
										}}
										inactiveProps={{
											className:
												"text-muted-foreground hover:bg-muted hover:text-foreground dark:border-transparent dark:hover:border-border",
										}}
										activeOptions={{ exact: true }}
									>
										<SquaresFour size={20} weight="fill" />
										<span className="uppercase text-xs tracking-wider">
											Overview
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* PROJECTS */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="w-full flex items-center gap-3 px-3 py-2 font-mono font-medium rounded-md border-2 border-transparent transition-all"
								>
									<Link
										to="/dashboard/projects" // Ganti sesuai dengan routing yang sebenarnya
										activeProps={{
											className:
												"bg-secondary text-secondary-foreground font-bold shadow-brutal-sm dark:shadow-none dark:border-border hover:opacity-90",
										}}
										inactiveProps={{
											className:
												"text-muted-foreground hover:bg-muted hover:text-foreground dark:border-transparent dark:hover:border-border",
										}}
									>
										<FolderOpen size={20} weight="regular" />
										<span className="uppercase text-xs tracking-wider">
											Projects
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* POSTS */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="w-full flex items-center gap-3 px-3 py-2 font-mono font-medium rounded-md border-2 border-transparent transition-all"
								>
									<Link
										to="/dashboard/posts/"
										activeProps={{
											className:
												"bg-secondary text-secondary-foreground font-bold shadow-brutal-sm dark:shadow-none dark:border-border hover:opacity-90",
										}}
										inactiveProps={{
											className:
												"text-muted-foreground hover:bg-muted hover:text-foreground dark:border-transparent dark:hover:border-border",
										}}
									>
										<NotePencil size={20} weight="regular" />
										<span className="uppercase text-xs tracking-wider">
											Posts
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* TAXONOMIES (KATEGORI & TAGS) - TAMBAHAN BARU */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="w-full flex items-center gap-3 px-3 py-2 font-mono font-medium rounded-md border-2 border-transparent transition-all"
								>
									<Link
										to="/dashboard/taxonomies"
										activeProps={{
											className:
												"bg-secondary text-secondary-foreground font-bold shadow-brutal-sm dark:shadow-none dark:border-border hover:opacity-90",
										}}
										inactiveProps={{
											className:
												"text-muted-foreground hover:bg-muted hover:text-foreground dark:border-transparent dark:hover:border-border",
										}}
									>
										<Tag size={20} weight="regular" />
										<span className="uppercase text-xs tracking-wider">
											Taxonomies
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* MEDIA */}
							{/* <SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="w-full flex items-center gap-3 px-3 py-2 font-mono font-medium rounded-md border-2 border-transparent transition-all"
								>
									<Link
										to="/dashboard/media" // Ganti sesuai dengan routing yang sebenarnya
										activeProps={{
											className:
												"bg-secondary text-secondary-foreground font-bold shadow-brutal-sm dark:shadow-none dark:border-border hover:opacity-90",
										}}
										inactiveProps={{
											className:
												"text-muted-foreground hover:bg-muted hover:text-foreground dark:border-transparent dark:hover:border-border",
										}}
									>
										<ImageIcon size={20} weight="regular" />
										<span className="uppercase text-xs tracking-wider">
											Media
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem> */}

							{/* COLLABORATORS - TAMBAHAN BARU */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="w-full flex items-center gap-3 px-3 py-2 font-mono font-medium rounded-md border-2 border-transparent transition-all"
								>
									<Link
										to="/dashboard/collaborators"
										activeProps={{
											className:
												"bg-secondary text-secondary-foreground font-bold shadow-brutal-sm dark:shadow-none dark:border-border hover:opacity-90",
										}}
										inactiveProps={{
											className:
												"text-muted-foreground hover:bg-muted hover:text-foreground dark:border-transparent dark:hover:border-border",
										}}
									>
										<Users size={20} weight="regular" />
										<span className="uppercase text-xs tracking-wider">
											Collaborators
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* SETTINGS */}
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="w-full flex items-center gap-3 px-3 py-2 font-mono font-medium rounded-md border-2 border-transparent transition-all"
								>
									<Link
										to="/dashboard/settings" // Ganti sesuai dengan routing yang sebenarnya
										activeProps={{
											className:
												"bg-secondary text-secondary-foreground font-bold shadow-brutal-sm dark:shadow-none dark:border-border hover:opacity-90",
										}}
										inactiveProps={{
											className:
												"text-muted-foreground hover:bg-muted hover:text-foreground dark:border-transparent dark:hover:border-border",
										}}
									>
										<Gear size={20} weight="regular" />
										<span className="uppercase text-xs tracking-wider">
											Settings
										</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarContent>

					<SidebarFooter className="p-4 border-t-2 dark:border-t border-border mt-auto">
						<button
							onClick={() => handleLogout()}
							disabled={isLoggingOut}
							className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive font-mono font-medium rounded-md border-2 border-transparent cursor-pointer dark:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							type="button"
						>
							<SignOut size={20} weight="regular" />
							<span className="uppercase text-xs tracking-wider">
								{isLoggingOut ? "Logging out..." : "Logout"}
							</span>
						</button>
					</SidebarFooter>
				</Sidebar>

				{/* ================= MAIN CONTENT AREA ================= */}
				<main className="flex-1 flex flex-col h-screen overflow-y-auto bg-background dark:bg-[#101415]">
					{/* Topbar */}
					<header className="sticky top-0 z-30 bg-background/90 dark:bg-[#101415]/90 backdrop-blur-sm border-b-2 dark:border-b border-border px-8 h-16 flex items-center justify-between">
						<div className="flex items-center gap-2 text-muted-foreground text-sm font-mono font-medium uppercase tracking-widest">
							<SidebarTrigger className="-ml-2 mr-2" />
							<span className="text-foreground">/</span>
							<span className="text-primary font-bold">Workspace</span>
						</div>
						<div className="flex items-center gap-4">
							<button
								type="button"
								className="text-muted-foreground hover:text-primary hover:bg-muted p-2 rounded-md border-2 dark:border border-transparent hover:border-border dark:hover:border-border transition-all"
							>
								<Bell size={20} weight="regular" />
							</button>
							<ThemeToggler
								theme={(theme as "light" | "dark" | "system") ?? "system"}
								resolvedTheme={(resolvedTheme as "light" | "dark") ?? "light"}
								setTheme={setTheme}
								direction="ltr"
							>
								{({ resolved, toggleTheme }) => (
									<Button
										variant="ghost"
										size="icon"
										aria-label="Toggle Dark Mode"
										className="rounded-md border border-transparent hover:border-border hover:bg-accent cursor-pointer"
										onClick={() =>
											toggleTheme(resolved === "dark" ? "light" : "dark")
										}
									>
										{resolved === "dark" ? (
											<Sun size={20} />
										) : (
											<Moon size={20} />
										)}
									</Button>
								)}
							</ThemeToggler>
						</div>
					</header>

					{/* Konten Halaman Anak */}
					<Outlet />
				</main>
			</div>
		</SidebarProvider>
	);
}
