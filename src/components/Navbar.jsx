import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, AppBar, Toolbar, Button, Typography } from "@mui/material";

export default function Navbar({ trackOn, setTrackOn }) {
  const location = useLocation();
  const links = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/chatbot", label: "Chatbot" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <AppBar position="sticky" sx={{
      background: "linear-gradient(90deg,#f1f8ff,#c2e7ff)", py: 0.5,
      boxShadow: "0 2px 24px #2aa9ff22"
    }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component={Link} to="/"
          sx={{
            textDecoration: "none", color: "#2FC1FF",
            fontWeight: 700, fontFamily: "Poppins, 'SF Pro Display', Inter, Arial"
          }}>AI Health</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {links.map(l => (
            <Button key={l.to} component={Link}
              to={l.to} data-allow-gaze="true" className="nav-link"
              sx={{
                color: location.pathname === l.to ? "#00c2ff" : "#222",
                mx: 0.5, px: 2, borderRadius: 3,
                background: "rgba(255,255,255,0.12)",
                fontWeight: 700, fontFamily: "inherit",
                "&:hover": { background: "rgba(240,248,255,0.65)" }
              }}>
              {l.label}
            </Button>
          ))}
          <Button id="tracker-toggle" onClick={() => setTrackOn(!trackOn)}
            sx={{
              ml: 2, px: 2, borderRadius: "18px",
              background: trackOn ? "#ff1744" : "#16e5bc",
              color: "#fff", fontWeight: 700, fontFamily: "inherit",
              boxShadow: "0 2px 12px #16e5bc33",
              "&:hover": { background: trackOn ? "#ff4564" : "#2af5cf" }
            }}>
            {trackOn ? "🛑 Stop Tracking" : "🎯 Start Tracking"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
