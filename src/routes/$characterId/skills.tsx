import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$characterId/skills')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$characterId/skills"!</div>
}
