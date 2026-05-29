import { RouteComponent } from '@/lib/features/dashboard/posts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/posts/')({
  component: RouteComponent,
})