import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Programs", to: "/programs" },
  { label: "Career Paths", to: "/career-paths" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AppBar color="secondary" position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Andalusia Academy
        </Typography>

        {/* Desktop: buttons in a row */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          {NAV_LINKS.map((link) => (
            <Button key={link.to} color="inherit" component={Link} to={link.to}>
              {link.label}
            </Button>
          ))}
        </Box>

        {/* Mobile: menu icon */}
        <IconButton
          color="inherit"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <List sx={{ width: 240 }}>
          {NAV_LINKS.map((link) => (
            <ListItemButton
              key={link.to}
              component={Link}
              to={link.to}
              onClick={() => setMenuOpen(false)}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
