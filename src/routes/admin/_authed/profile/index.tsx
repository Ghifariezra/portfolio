import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/features/admin/lib/admin-head";
import { AdminProfilePage } from "@/features/admin/profile/pages/admin-profile-page";

export const Route = createFileRoute("/admin/_authed/profile/")({
  head: () => adminHead("Profile"),
  component: AdminProfilePage,
});