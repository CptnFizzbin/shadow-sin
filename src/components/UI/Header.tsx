import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";
import { CharacterStoreContext } from "#/components/Character/CharacterStoreProvider.tsx";

const linkStyle = { textDecoration: "none", color: "inherit" };

export default function Header() {
	const playerStore = useContext(CharacterStoreContext);
	const [characterName, setCharacterName] = useState<string | null>(null);

	useEffect(() => {
		if (playerStore) {
			const { unsubscribe } = playerStore.subscribe((state) => {
				setCharacterName(state.profile.alias);
			});

			return () => unsubscribe();
		}
	}, [playerStore]);

	return (
		<AppBar position="sticky" color="default" elevation={0}>
			<Toolbar sx={{ gap: 2, justifyContent: "space-between" }}>
				<Typography variant="h5" component="div">
					<Link to="/" style={linkStyle}>
						{characterName ?? "ShadowSIN 4e"}
					</Link>
				</Typography>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						flexWrap: "wrap",
					}}
				>
					<Link to="/" style={linkStyle}>
						<Button color="inherit" size="small">
							Roster
						</Button>
					</Link>
				</Box>
			</Toolbar>
		</AppBar>
	);
}
