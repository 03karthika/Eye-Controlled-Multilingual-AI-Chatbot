// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box, Container, Paper, TextField, IconButton,
  Typography, Button, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import StopIcon from "@mui/icons-material/Stop";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const ACCENT = "#23baff";

const speechLangMap = {
  en: "en-US", hi: "hi-IN", ta: "ta-IN", es: "es-ES",
  fr: "fr-FR", de: "de-DE", ko: "ko-KR", ja: "ja-JP", zh: "zh-CN"
};

function mapWeatherCode(code) {
  const map = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
    55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Light snow", 73: "Moderate snow", 75: "Heavy snow",
    80: "Rain showers", 81: "Heavy rain showers", 95: "Thunderstorm"
  };
  return map[code] || `Code ${code}`;
}
function formatDateLocal(dateStr, tz) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      timeZone: tz, dateStyle: "medium", timeStyle: "short"
    });
  } catch {
    return dateStr;
  }
}
async function getWeather(city, when = "current") {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0)
      return `❌ I couldn't find "${city}".`;
    const { latitude, longitude, name, country, timezone } = geoData.results[0];

    if (when === "tomorrow" || /^\d{4}-\d{2}-\d{2}$/.test(when)) {
      const targetDate = when === "tomorrow"
        ? new Date(Date.now() + 24 * 3600 * 1000)
        : new Date(when);
      const dateStr = targetDate.toISOString().slice(0, 10);
      const dailyRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=${encodeURIComponent(timezone)}&start_date=${dateStr}&end_date=${dateStr}`
      );
      const dailyData = await dailyRes.json();
      const wcode = dailyData?.daily?.weathercode?.[0];
      const tmax = dailyData?.daily?.temperature_2m_max?.[0];
      const tmin = dailyData?.daily?.temperature_2m_min?.[0];
      return `Weather for ${name}, ${country} on ${dateStr}:\nTemperature: ${tmin}°C → ${tmax}°C\nCondition: ${mapWeatherCode(wcode)}`;
    }

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m&timezone=${encodeURIComponent(timezone)}`
    );
    const weatherData = await weatherRes.json();
    const cw = weatherData.current_weather;
    const humidityHourly = weatherData.hourly?.relativehumidity_2m;
    const times = weatherData.hourly?.time;
    let humidity = "N/A";
    if (humidityHourly && times && cw?.time) {
      const idx = times.indexOf(cw.time); if (idx >= 0) humidity = humidityHourly[idx] + "%";
    }
    const localTime = formatDateLocal(cw.time, timezone);
    return `Weather in ${name}, ${country}:\nTime: ${localTime}\nTemperature: ${cw.temperature}°C\nCondition: ${mapWeatherCode(cw.weathercode)}\nHumidity: ${humidity}\nWind: ${cw.windspeed} m/s`;
  } catch {
    return "⚠️ Weather service temporarily unavailable.";
  }
}

export default function Chatbot() {
  const [messages, setMessages] = useState(() =>
    JSON.parse(localStorage.getItem("chatHistory")) || [
      { sender: "bot", text: "Welcome! Ask me anything — health or weather." }
    ]
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [personality, setPersonality] = useState("Normal");
  const [language, setLanguage] = useState("en");
  const recognitionRef = useRef(null);
  const messagesBoxRef = useRef(null);

  useEffect(() => { localStorage.setItem("chatHistory", JSON.stringify(messages)); }, [messages]);
  useEffect(() => {
    if (messagesBoxRef.current)
      messagesBoxRef.current.scrollTo({
        top: messagesBoxRef.current.scrollHeight,
        behavior: "smooth"
      });
  }, [messages, loading]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      sendMessage(text);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const handleVoiceStart = () => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = speechLangMap[language] || "en-US";
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const stopSpeech = () => { window.speechSynthesis?.cancel(); };
  const clearChat = () => {
    setMessages([
      { sender: "bot", text: "Chat cleared. Ask again!" }
    ]);
    localStorage.removeItem("chatHistory");
  };

  // Speak in the selected language, using fallback for TTS
  const speak = (text) => {
    if (!text) return;
    const langCode = speechLangMap[language] || "en-US";
    if ("speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      const hasVoice = voices.some(v => v.lang.startsWith(langCode.split("-")[0]));
      if (hasVoice) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = langCode;
        window.speechSynthesis.speak(u);
        return;
      }
    }
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language}&client=tw-ob`;
    const audio = new Audio(ttsUrl);
    audio.play().catch(e => {});
  };

  const sendMessage = async (text) => {
    if (!text?.trim()) return;
    setMessages(p => [...p, { sender: "user", text }]);
    setInput(""); setLoading(true);

    // Weather detection (works in ANY language!)
    const weatherPattern = /(weather|temperature|rain|climate|hot|cold|வானிலை|मौसम|天气|날씨|天気|clima|temps|temps|tempo)\s*(?:in)?\s*([a-zA-Z\u0B80-\u0BFF\u0900-\u097F\u4e00-\u9fff\u3130-\u318F\u3040-\u309F\u30A0-\u30FF\s'-]+)?\s*(today|tomorrow|\d{4}-\d{2}-\d{2}|இன்று|நாளை|आज|कल)?/i;
    const match = text.match(weatherPattern);
    if (match && match[2]) {
      const city = match[2].trim();
      const when = (match[3] || "current").toLowerCase();
      let weatherText = await getWeather(city, when);
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        // Always translate reply to the selected language.
        const translated = await model.generateContent(
          `Translate this to ${language}:\n${weatherText}`
        );
        weatherText = translated.response.text();
      }
      setMessages(p => [...p, { sender: "bot", text: weatherText }]);
      speak(weatherText);
      setLoading(false);
      return;
    }

    if (!genAI) {
      const fallback = "⚠ Gemini API not set. I can only answer weather.";
      setMessages(p => [...p, { sender: "bot", text: fallback }]);
      speak(fallback);
      setLoading(false);
      return;
    }
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      // Instruct Gemini to always reply in the selected language.
      const replyGen = await model.generateContent(
        `You are a ${personality} assistant. Reply in ${language} for ALL messages (even if question is in another language).\n"${text}"\nKeep response natural, helpful, not apologetic.`
      );
      const reply = replyGen.response.text();
      setMessages(p => [...p, { sender: "bot", text: reply }]);
      speak(reply);
    } catch (err) {
      setMessages(p => [...p, { sender: "bot", text: "⚠ AI Error — try again." }]);
    }
    setLoading(false);
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      background: "radial-gradient(circle at top,#eaf6ff 0%,#c8e8fa 100%)"
    }}>
      <Container maxWidth="lg" sx={{ pt: 3, pb: 6, flex: 1 }}>
        <Paper elevation={10} sx={{
          borderRadius: 4,
          overflow: "hidden",
          height: "calc(100vh - 110px)",
          display: "flex",
          flexDirection: "column",
          boxShadow: `0 12px 60px ${ACCENT}33,0 2px 24px #2aa9ff22`
        }}>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", p: 2,
            background: `linear-gradient(90deg, #e7f3fc, ${ACCENT}11)`
          }}>
            <Typography variant="h6"
              sx={{ color: "#12a9ef", fontWeight: 700 }}>
              💬 AI Health & Weather Assistant
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <FormControl variant="filled" sx={{ minWidth: 160 }}>
                <InputLabel sx={{ color: "#12a9ef" }}>Personality</InputLabel>
                <Select value={personality}
                  onChange={e => setPersonality(e.target.value)}
                  sx={{ color: "#12a9ef" }}>
                  <MenuItem value="Normal">Normal Assistant</MenuItem>
                  <MenuItem value="Friendly">Friendly Buddy 😄</MenuItem>
                  <MenuItem value="Tamil">Tamil-only Mode</MenuItem>
                  <MenuItem value="Developer">Developer Mode 👨‍💻</MenuItem>
                  <MenuItem value="Study Helper">Study Helper</MenuItem>
                  <MenuItem value="Mental Health">Mental Health Supporter</MenuItem>
                  <MenuItem value="Funny">Funny Sarcasm Mode 😎</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="filled" sx={{ minWidth: 140 }}>
                <InputLabel sx={{ color: "#12a9ef" }}>Language</InputLabel>
                <Select value={language}
                  onChange={e => setLanguage(e.target.value)}
                  sx={{ color: "#12a9ef" }}>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">Hindi</MenuItem>
                  <MenuItem value="ta">Tamil</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                  <MenuItem value="ko">Korean</MenuItem>
                  <MenuItem value="ja">Japanese</MenuItem>
                  <MenuItem value="zh">Chinese</MenuItem>
                </Select>
              </FormControl>
              <Button
                onClick={() => { }}
                sx={{ bgcolor: ACCENT, color: "#fff", fontWeight: 600 }}
                data-allow-gaze="true">
                ✨ Daily Challenge
              </Button>
              <Button
                onClick={() => { }}
                sx={{ bgcolor: "#00f1c7", color: "#000", fontWeight: 600 }}
                data-allow-gaze="true">
                🧠 Simplify
              </Button>
              <Button
                onClick={clearChat}
                startIcon={<DeleteSweepIcon />}
                sx={{
                  color: ACCENT, borderColor: ACCENT,
                  border: "1px solid", fontWeight: 600
                }}
                data-allow-gaze="true"
              >
                Clear
              </Button>
            </Box>
          </Box>
          <Box
            ref={messagesBoxRef}
            className="chat-messages"
            sx={{
              flex: 1, overflowY: "auto", p: 3,
              background: "rgba(240,250,255,.75)",
              borderRadius: 7,
              fontFamily: "inherit"
            }}
          >
            {messages.map((m, i) => (
              <Box key={i}
                sx={{
                  display: "flex",
                  justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
                  mb: 2
                }}>
                <Box sx={{
                  maxWidth: "78%",
                  px: 3, py: 1.5, borderRadius: 3,
                  background: m.sender === "user"
                    ? `linear-gradient(90deg, ${ACCENT}, #97e7ff)`
                    : "#eaf6ff",
                  color: m.sender === "user" ? "#fff" : "#222",
                  boxShadow: m.sender === "user"
                    ? `0 8px 30px ${ACCENT}55`
                    : "none"
                }}>
                  <Typography variant="body1"
                    sx={{ whiteSpace: "pre-wrap" }}>
                    {m.text}
                  </Typography>
                </Box>
              </Box>
            ))}
            {loading && <Typography color="gray">AI is typing...</Typography>}
          </Box>
          <Box sx={{
            display: "flex", gap: 1, p: 2, alignItems: "center",
            background: "#e7f3fc", borderRadius: 2
          }}>
            <TextField
              fullWidth value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask health or weather... e.g. 'weather in London tomorrow'"
              variant="filled"
              InputProps={{
                sx: {
                  borderRadius: 2,
                  background: "#f6fcff",
                  color: "#111",
                  fontFamily: "inherit",
                  boxShadow: "none"
                }
              }}
            />
            <IconButton onClick={handleVoiceStart}
              sx={{
                bgcolor: listening ? "error.main" : "primary.main",
                color: "#fff"
              }} data-allow-gaze="true"
            ><MicIcon /></IconButton>
            <IconButton
              onClick={() => sendMessage(input)}
              sx={{ bgcolor: ACCENT, color: "#fff" }}
              data-allow-gaze="true"
            ><SendIcon /></IconButton>
            <IconButton
              onClick={stopSpeech}
              sx={{ bgcolor: "#888", color: "#fff" }}
              data-allow-gaze="true"
            ><StopIcon /></IconButton>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
