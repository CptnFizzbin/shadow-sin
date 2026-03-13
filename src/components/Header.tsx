import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from '@tanstack/react-router';

export default function Header () {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexShrink: 0, fontWeight: 700 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ShadowSIN 4e
          </Link>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 3 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button color="inherit" size="small">Home</Button>
          </Link>
          <Link to="/about" style={{ textDecoration: 'none' }}>
            <Button color="inherit" size="small">About</Button>
          </Link>
          <Button
            color="inherit"
            size="small"
            href="https://tanstack.com/router/latest/docs"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
