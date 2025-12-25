👁️ Eye-Controlled Multilingual AI Chatbot

An accessibility-focused, hands-free AI chatbot that allows users to interact using head movements, voice commands, and multilingual text/voice output.
This project combines Artificial Intelligence, Computer Vision, Speech Processing, and Modern Web Technologies to create an inclusive and intelligent conversational system.

🌟 Project Overview

The Eye-Controlled Multilingual AI Chatbot is designed to remove dependency on traditional input devices like keyboards, mice, or touchscreens.
Users can navigate, click, speak, and listen to AI responses entirely hands-free, making the system especially useful for people with physical disabilities, elderly users, and accessibility-focused environments.

The chatbot supports multilingual conversations, voice input/output, real-time weather information, and AI-powered responses, all controlled using head movements detected via webcam.

🧠 Core Concept

Traditional chatbots require manual interaction. This project eliminates that limitation by enabling:

🎯 Cursor movement using head position

⏱️ Auto-click using dwell time

🎤 Speech-based input

🔊 Multilingual AI responses with voice output

The chatbot can answer general questions, provide assistance, and fetch real-time weather data while speaking in the user’s selected language.

👀 Head & Gaze-Based Interaction System

The system uses MediaPipe FaceMesh to detect facial landmarks from the webcam feed.
Instead of directly tracking eye gaze, the nose tip landmark is used because it is more stable and reliable.

🔄 How It Works

Webcam captures live video frames

MediaPipe FaceMesh detects 468 facial landmarks

Nose coordinates are extracted

Cursor position is calculated based on head movement

Exponential smoothing reduces jitter

Cursor moves smoothly across the screen

When the cursor stays on a clickable element for 1 second, an automatic click is triggered

🧭 Users Can

Navigate menus

Scroll pages

Click buttons

Open chatbot sections

➡️ All without using a mouse or keyboard

🎤 Voice Input & Output System
🗣️ Voice Input (Speech-to-Text)

Uses Web Speech Recognition API

Converts spoken words into text

Automatically sends text to the chatbot

Language adapts dynamically (English, Hindi, Tamil, etc.)

🔊 Voice Output (Text-to-Speech)

Uses Speech Synthesis API

AI responses are spoken aloud

Speech language changes based on user selection

Supports multiple accents and languages

This makes the chatbot usable even for visually impaired users.

🌍 Multilingual AI Chatbot

The chatbot supports multiple languages, including:

🇺🇸 English

🇮🇳 Hindi

🇮🇳 Tamil

🇪🇸 Spanish

🇫🇷 French

🇩🇪 German

🇰🇷 Korean

🇯🇵 Japanese (extendable)

🌐 How Multilingual Support Works

User selects preferred language

AI is instructed to respond in that language

Text-to-speech uses language-specific voices

Weather responses are automatically translated

🤖 AI Response System (Google Gemini)

The chatbot uses Google Gemini Generative AI to produce intelligent, context-aware responses.

✨ Features

Context-aware conversations

Natural language understanding

Human-like, polite responses

Prompt-engineered for clarity and safety

🎭 Personality Modes

😊 Friendly

👨‍💻 Developer

📚 Study Helper

💙 Mental Health Supporter

😂 Funny Mode

☁️ Real-Time Weather Assistant

The chatbot can answer queries such as:

“Weather in Chennai today”

“Temperature in London tomorrow”

“Will it rain in Paris on 2025-01-01?”

🌦️ Weather Workflow

City name extracted using pattern matching

Coordinates fetched using Open-Meteo Geocoding API

Weather data retrieved from Open-Meteo Forecast API

Weather codes converted to human-readable descriptions

Output translated into selected language

Response spoken using Text-to-Speech

💾 Chat Memory & Auto-Scroll

Chat history stored using LocalStorage

Messages persist after page refresh

Chat auto-scrolls to the latest message

Clear chat option available

This ensures a smooth and hands-free chatting experience.

🧩 System Architecture
🖥️ Frontend

React + Vite

Material UI for modern UI

React Router for navigation

🤖 AI Layer

Google Gemini API

👁️ Computer Vision

MediaPipe FaceMesh

🎙️ Speech Processing

Web Speech Recognition API

Speech Synthesis API

🌐 External APIs

Open-Meteo Weather API

⚠️ Challenges Faced and How They Were Handled
🎯 Head Tracking Instability

Raw facial landmark data caused shaky cursor movement. This was solved by applying smoothing logic to gradually update cursor positions, resulting in smooth and stable control.

🖱️ Accidental Auto-Clicks

The cursor initially clicked non-interactive elements. Auto-click functionality was restricted only to explicitly allowed interactive elements, ensuring controlled navigation.

📜 Auto-Scroll Issues

Chat messages did not scroll automatically. This was fixed by programmatically updating the scroll position whenever new messages were added.

🔊 Multilingual Voice Output Problems

Speech synthesis defaulted to English. Proper language-to-voice mapping was introduced to ensure correct pronunciation for all supported languages.

🌍 Language Scalability

Hardcoded language options limited growth. A dynamic language mapping system was implemented, making it easy to add new languages.

🚧 React Routing Errors

A blank screen occurred due to multiple router definitions. The routing architecture was restructured to ensure a single root router.

🎙️ Voice Recognition Reliability

Speech recognition failed intermittently. Language-specific recognition handling and proper lifecycle management improved accuracy and stability.

🌦️ Weather API Failures

Invalid city names caused errors. Validation and fallback messages were added for better user experience.

⚡ Performance vs Accessibility

Running webcam, AI, and speech simultaneously was resource-intensive. Performance was optimized through efficient state management and reduced re-renders.

🚀 Why This Project Is Unique

✔ Eye / head-controlled navigation
✔ Fully hands-free chatbot interaction
✔ Multilingual AI with voice output
✔ Accessibility-first design
✔ Real-time external data integration
✔ Combines AI + Computer Vision + Speech

🎯 Real-World Applications

Assistive technology for physically challenged users

Smart AI kiosks

Hands-free educational assistants

Healthcare chat systems

Smart home voice assistants

Accessibility research projects

🔮 Future Enhancements

Eye-blink based click detection

Emotion recognition

Offline speech support

Chat export (PDF / Email)

User profile personalization

AI-based health diagnostics integration

🏁 Conclusion

This project demonstrates how AI, computer vision, and speech technologies can be combined to create an inclusive, intelligent, and human-centered system.
It reflects strong problem-solving skills and is highly suitable for internship evaluations, academic projects, and innovation showcases.
