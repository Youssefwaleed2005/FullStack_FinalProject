import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import StatCard from "../../components/StatCard";
import { getApiErrorMessage } from "../../services/api";
import { getAdminDashboard } from "../../services/adminService";
import type { AdminDashboard } from "../../types/Admin";
import { formatDateTime } from "../../utils/formatDate";
import { PAYMENT_STATUS_COLORS } from "../../utils/statusLabels";

function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAdminDashboard()
      .then((d) => {
        if (active) setData(d);
      })
      .catch((err) => {
        if (active)
          setError(getApiErrorMessage(err, "Could not load the dashboard."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error || "Something went wrong."}</Alert>
      </Container>
    );
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
          mb: 3,
        }}
      >
        <Typography variant="h4">Admin dashboard</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            component={Link}
            to="/admin/users"
            variant="outlined"
            color="secondary"
          >
            Users
          </Button>
          <Button
            component={Link}
            to="/admin/courses"
            variant="outlined"
            color="secondary"
          >
            Courses
          </Button>
          <Button
            component={Link}
            to="/admin/payments"
            variant="outlined"
            color="secondary"
          >
            Payments
          </Button>
        </Box>
      </Box>

      {/* People & catalog */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <StatCard label="Learners" value={data.learnerCount} />
        <StatCard label="Instructors" value={data.instructorCount} />
        <StatCard
          label="Courses"
          value={data.courseCount}
          hint={`${data.openCourseCount} open for enrollment`}
        />
        <StatCard label="Programs" value={data.programCount} />
      </Box>

      {/* Enrollment & money */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
        <StatCard
          label="Active enrollments"
          value={data.activeEnrollmentCount}
        />
        <StatCard
          label="Pending applications"
          value={data.pendingApplicationCount}
          hint="Applied but not paid yet"
        />
        <StatCard
          label="Total revenue"
          value={`${data.totalRevenue.toLocaleString()} EGP`}
        />
        <StatCard
          label="This month"
          value={`${data.revenueThisMonth.toLocaleString()} EGP`}
        />
      </Box>

      {/* Recent payments */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6">Recent payments</Typography>
        <Button component={Link} to="/admin/payments" color="secondary">
          View all
        </Button>
      </Box>

      {data.recentPayments.length === 0 ? (
        <Typography sx={{ color: "text.secondary" }}>
          No payments yet.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>For</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.recentPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {p.studentName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {p.studentEmail}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {p.targetType}: {p.targetTitle}
                  </TableCell>
                  <TableCell align="right">
                    {p.amount.toLocaleString()} {p.currency}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={p.status}
                      color={PAYMENT_STATUS_COLORS[p.status]}
                    />
                  </TableCell>
                  <TableCell>
                    {formatDateTime(p.paidAt ?? p.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default AdminDashboardPage;
