import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
export default function Features() {
  const items = [
    { title: "Voice & Head Control", desc: "Hands-free control with nose/head tracking & voice." },
    { title: "Chat History", desc: "Your chat saved locally — persists between visits." },
    { title: "Accessible UI", desc: "Large controls and high contrast for accessibility." }
  ];
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#23baff", fontWeight: 700 }}>
        Features
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 3 }}>
        {items.map((f) => (
          <Paper key={f.title} sx={{
            p: 3, background: "rgba(255,255,255,0.80)", borderRadius: 10,
            boxShadow: "0 4px 16px #44e3ff44"
          }}>
            <Typography variant="h6" sx={{ color: "#1567a7" }}>{f.title}</Typography>
            <Typography color="text.secondary">{f.desc}</Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
