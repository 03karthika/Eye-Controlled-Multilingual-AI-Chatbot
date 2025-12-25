import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";

export default function Home() {
  return (
    <Container
      sx={{
        py: { xs: 6, md: 10 },
        textAlign: "center",
        color: "#222",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(180deg, #eaf6ff 0%, #f5faff 80%)"
      }}
    >
      <Typography variant="h3"
        sx={{
          mb: 2, fontWeight: "bold", color: "#23baff",
          textShadow: "0 0 13px #00eaff, 0 0 28px #b7e5fa"
        }}>
        AI Health Assistant 🤖
      </Typography>
      <Typography sx={{
        maxWidth: "700px", mb: 6, color: "#222",
        fontSize: { xs: "1rem", md: "1.2rem" }, lineHeight: 1.6, opacity: 0.8
      }}>
        Experience hands-free control with head & nose tracking and voice.  
        Get personalized health, weather, and insights — in your preferred language.
      </Typography>
      <Box sx={{
        display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center"
      }}>
        <Button id="start-btn" href="/chatbot" variant="contained" data-allow-gaze="true"
          sx={{
            minWidth: 220, height: 100, fontSize: "1.15rem",
            background: "linear-gradient(135deg, #a5f3fc, #38bdf8)", color: "#111",
            fontWeight: "bold", borderRadius: "22px",
            boxShadow: "0 8px 30px #0891b233", textShadow: "0 0 6px #fff",
            "&:hover": { boxShadow: "0 0 60px #0ea5e9dd", transform: "scale(1.06)" }
          }}>💬 Chatbot</Button>
        <Button href="/features" variant="contained" data-allow-gaze="true"
          sx={{
            minWidth: 220, height: 100,
            background: "linear-gradient(135deg, #fdc4ff, #fe77b8)", color: "#111",
            fontWeight: "bold", borderRadius: "22px", fontSize: "1.15rem",
            boxShadow: "0 8px 30px #e44bd033", textShadow: "0 0 6px #fff",
            "&:hover": { boxShadow: "0 0 60px #fb45acd9", transform: "scale(1.06)" }
          }}>🌟 Features</Button>
        <Button href="/contact" variant="contained" data-allow-gaze="true"
          sx={{
            minWidth: 220, height: 100, background: "linear-gradient(135deg, #ffea00, #ffe0b0)",
            color: "#222", fontWeight: "bold", borderRadius: "22px", fontSize: "1.15rem",
            boxShadow: "0 8px 30px #ffe40033", textShadow: "0 0 6px #fff6",
            "&:hover": { boxShadow: "0 0 60px #ffd900cc", transform: "scale(1.06)" }
          }}>📞 Contact</Button>
      </Box>
    </Container>
  );
}
