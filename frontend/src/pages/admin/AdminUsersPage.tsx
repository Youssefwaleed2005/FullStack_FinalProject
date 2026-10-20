import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import CreateInstructorDialog from "../../components/admin/CreateInstructorDialog";
import { getApiErrorMessage } from "../../services/api";
import { getAdminUsers, setUserStatus } from "../../services/adminService";
import type { AdminUser } from "../../types/Admin";
import { formatDate } from "../../utils/formatDate";

const ROLES = ["Learner", "Instructor"] as const;

function AdminUsersPage() {
  const [tab, setTab] = useState(0);
  const role = ROLES[tab];

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createKey, setCreateKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await getAdminUsers({ role, search: search || undefined }));
      setError("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load users."));
    } finally {
      setLoading(false);
    }
  }, [role, search]);

  useEffect(() => {
    load();
  }, [load]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  async function toggleStatus(user: AdminUser) {
    const action = user.isActive ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} ${user.fullName}?`))
      return;

    setBusyId(user.id);
    try {
      const updated = await setUserStatus(user.id, !user.isActive);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setError(getApiErrorMessage(err, `Could not ${action} this user.`));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h4">Manage users</Typography>
        {role === "Instructor" && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setCreateKey((k) => k + 1);
              setCreateOpen(true);
            }}
          >
            Add instructor
          </Button>
        )}
      </Box>

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        textColor="secondary"
        indicatorColor="secondary"
        sx={{ mb: 2 }}
      >
        <Tab label="Learners" />
        <Tab label="Instructors" />
      </Tabs>

      {/* Search */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ display: "flex", gap: 1, mb: 2 }}
      >
        <TextField
          size="small"
          label="Search name or email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 400, bgcolor: "background.paper" }}
        />
        <Button type="submit" variant="outlined" color="secondary">
          Search
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : users.length === 0 ? (
        <Typography sx={{ color: "text.secondary" }}>
          No users found.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone / Country</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="center">
                  {role === "Learner" ? "Active enrollments" : "Courses taught"}
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {u.fullName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {u.email}
                      {u.specialization ? ` · ${u.specialization}` : ""}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {[u.phoneNumber, u.country].filter(Boolean).join(" · ") ||
                      "-"}
                  </TableCell>
                  <TableCell>{formatDate(u.createdAt)}</TableCell>
                  <TableCell align="center">
                    {role === "Learner" ? u.activeEnrollments : u.coursesTaught}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={u.isActive ? "Active" : "Deactivated"}
                      color={u.isActive ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      color={u.isActive ? "error" : "success"}
                      disabled={busyId === u.id}
                      onClick={() => toggleStatus(u)}
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateInstructorDialog
        key={createKey}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          load();
        }}
      />
    </Container>
  );
}

export default AdminUsersPage;
