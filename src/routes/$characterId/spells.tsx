import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$characterId/spells')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$characterId/spells"!</div>
}
