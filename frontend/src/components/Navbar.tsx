import { useState } from "react";
import type { MouseEvent } from "react";
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
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Programs", to: "/programs" },
  { label: "Career Paths", to: "/career-paths" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const ACCOUNT_LINKS = [
  { label: "My learning", to: "/my-enrollments" },
  { label: "My applications", to: "/applications" },
  { label: "My payments", to: "/my-payments" },
  { label: "My profile", to: "/profile" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : "";

  function openAccountMenu(event: MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closeAccountMenu() {
    setAnchorEl(null);
  }

  function goTo(path: string) {
    closeAccountMenu();
    setMenuOpen(false);
    navigate(path);
  }

  function handleLogout() {
    closeAccountMenu();
    setMenuOpen(false);
    logout();
    navigate("/");
  }

  return (
    <AppBar color="secondary" position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Andalusia Academy
        </Typography>

        {/* Desktop links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          {NAV_LINKS.map((link) => (
            <Button key={link.to} color="inherit" component={Link} to={link.to}>
              {link.label}
            </Button>
          ))}
        </Box>

        {/* Account control — swaps between Log in and the avatar menu */}
        <Box sx={{ display: { xs: "none", md: "flex" }, ml: 1 }}>
          {isAuthenticated ? (
            <>
              <Tooltip title={`${user?.firstName} ${user?.lastName}`}>
                <IconButton
                  onClick={openAccountMenu}
                  size="small"
                  aria-label="Account menu"
                >
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "primary.main",
                      color: "secondary.main",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {initials}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeAccountMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem disabled sx={{ opacity: "1 !important" }}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.roles.join(", ")}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                {ACCOUNT_LINKS.map((link) => (
                  <MenuItem key={link.to} onClick={() => goTo(link.to)}>
                    {link.label}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/login"
            >
              Log in
            </Button>
          )}
        </Box>

        {/* Mobile */}
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

          <Divider sx={{ my: 1 }} />

          {isAuthenticated ? (
            <>
              <ListItemButton disabled sx={{ opacity: "1 !important" }}>
                <ListItemText
                  primary={`${user?.firstName} ${user?.lastName}`}
                  secondary={user?.roles.join(", ")}
                />
              </ListItemButton>

              {ACCOUNT_LINKS.map((link) => (
                <ListItemButton
                  key={link.to}
                  component={Link}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              ))}

              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Log out" />
              </ListItemButton>
            </>
          ) : (
            <>
              <ListItemButton
                component={Link}
                to="/login"
                onClick={() => setMenuOpen(false)}
              >
                <ListItemText primary="Log in" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/register"
                onClick={() => setMenuOpen(false)}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
