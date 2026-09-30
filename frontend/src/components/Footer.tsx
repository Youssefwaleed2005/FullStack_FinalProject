import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "secondary.main  ",
        p: 3,
        mt: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="body1">Andalusia Academy</Typography>
      <Typography variant="body2">Youssef Waleed || Salma Sherif</Typography>
    </Box>
  );
}

export default Footer;
