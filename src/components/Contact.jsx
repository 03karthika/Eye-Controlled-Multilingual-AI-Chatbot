import React, { useState } from "react";
import { Container, Typography, Paper, TextField, Button, Alert } from "@mui/material";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else throw new Error("Failed to send");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <Container sx={{
      py: 8, textAlign: "center", color: "#222", minHeight: "100vh",
      background: "linear-gradient(180deg,#eaf6ff 0%,#f5faff 80%)",
      display: "flex", flexDirection: "column", alignItems: "center"
    }}>
      <Typography variant="h4" gutterBottom sx={{
        mb: 3, color: "#23baff", fontWeight: 700,
        textShadow: "0 0 10px #00eaff, 0 0 20px #00eaff"
      }}>
        📩 Contact Us
      </Typography>
      <Paper sx={{
        p: 4, maxWidth: 500, width: "100%", borderRadius: "24px",
        background: "rgba(255,255,255,0.75)", color: "#222",
        boxShadow: "0 2px 38px #45e9ff23"
      }}>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Your Name" name="name" value={form.name}
            onChange={handleChange} required sx={{ mb: 2, input: { color: "#222" }, label: { color: "#888" } }}
            data-allow-gaze="true" />
          <TextField fullWidth label="Email" name="email" type="email" value={form.email}
            onChange={handleChange} required sx={{ mb: 2, input: { color: "#222" }, label: { color: "#888" } }}
            data-allow-gaze="true" />
          <TextField fullWidth label="Message" name="message" multiline rows={4} value={form.message}
            onChange={handleChange} required sx={{ mb: 3, input: { color: "#222" }, label: { color: "#888" } }}
            data-allow-gaze="true" />
          <Button type="submit" variant="contained" fullWidth data-allow-gaze="true"
            sx={{
              bgcolor: "#16e5bc", color: "#222", fontWeight: "bold",
              borderRadius: "14px", "&:hover": { bgcolor: "#00bcd4" }
            }}>Send Message</Button>
        </form>
        {status === "success" && (
          <Alert severity="success" sx={{ mt: 2 }}>
            ✅ Message sent successfully!
          </Alert>
        )}
        {status === "error" && (
          <Alert severity="error" sx={{ mt: 2 }}>
            ❌ Failed to send. Try again later.
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
