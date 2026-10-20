import { Paper, Typography } from "@mui/material";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Paper sx={{ p: 3, flex: "1 1 200px" }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 600, my: 0.5 }}>
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {hint}
        </Typography>
      )}
    </Paper>
  );
}

export default StatCard;
