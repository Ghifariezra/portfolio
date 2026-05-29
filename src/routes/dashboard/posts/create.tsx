import { createFileRoute } from '@tanstack/react-router'
import { RouteComponent } from '@/lib/features/dashboard/posts/create'

export const Route = createFileRoute('/dashboard/posts/create')({
  component: RouteComponent,
})