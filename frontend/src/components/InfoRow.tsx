import { Box, Typography } from "@mui/material";

type InfoRowProps = {
  label: string;
  value: string | null;
};

// One "label: value" line in an information box (hidden if the value is empty)
function InfoRow({ label, value }: InfoRowProps) {
  if (!value) return null;
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 1 }}
    >
      <Typography sx={{ color: "text.secondary" }}>{label}</Typography>
      <Typography sx={{ textAlign: "right" }}>{value}</Typography>
    </Box>
  );
}

export default InfoRow;
