import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$characterId/gear")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/$characterId/gear"!</div>;
}
