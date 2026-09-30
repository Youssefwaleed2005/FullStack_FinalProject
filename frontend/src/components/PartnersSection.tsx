import { Box, Typography } from "@mui/material";
import type { Partner } from "../types/Partner";

const partners: Partner[] = [
  {
    id: 1,
    name: "Microsoft",
    logoUrl: "https://placehold.co/160x60",
    websiteUrl: "https://microsoft.com",
  },
  {
    id: 2,
    name: "Oracle",
    logoUrl: "https://placehold.co/160x60",
    websiteUrl: "https://oracle.com",
  },
  {
    id: 3,
    name: "IBM",
    logoUrl: "https://placehold.co/160x60",
    websiteUrl: "https://ibm.com",
  },
  {
    id: 4,
    name: "Cisco",
    logoUrl: "https://placehold.co/160x60",
    websiteUrl: "https://cisco.com",
  },
];

function PartnersSection() {
  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" sx={{ mb: 1, textAlign: "center" }}>
        Our partners
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}
      >
        Trusted by organisations across the region.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {partners.map((partner) => (
          <Box
            key={partner.id}
            component="img"
            src={partner.logoUrl}
            alt={partner.name}
            sx={{ height: 60 }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default PartnersSection;
