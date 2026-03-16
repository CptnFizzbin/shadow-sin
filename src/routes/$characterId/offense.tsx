import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$characterId/offense")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/$characterId/offense"!</div>;
}
