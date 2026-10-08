import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { getPartners } from "../services/partnerService";
import type { Partner } from "../types/Partner";

function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPartners() {
      try {
        setLoading(true);
        setError("");
        const data = await getPartners();
        setPartners(data);
      } catch {
        setError("Could not load partners.");
      } finally {
        setLoading(false);
      }
    }

    loadPartners();
  }, []);

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 1, textAlign: "center" }}>
        Our partners
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}
      >
        Trusted by organisations across the region.
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && partners.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          No partners yet.
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {partners
          .filter((partner) => partner.logoUrl)
          .map((partner) => {
            const logo = (
              <Box
                component="img"
                src={partner.logoUrl!}
                alt={partner.name}
                sx={{ height: 60 }}
              />
            );

            return partner.websiteUrl ? (
              <a
                key={partner.id}
                href={partner.websiteUrl}
                target="_blank"
                rel="noreferrer"
              >
                {logo}
              </a>
            ) : (
              <Box key={partner.id}>{logo}</Box>
            );
          })}
      </Box>
    </Box>
  );
}

export default PartnersSection;
