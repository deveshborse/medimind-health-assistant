# 💊 MediMind — AI Health Assistant

Good Health & Well-being
> An AI-powered medication tracker and health assistant built with HTML, CSS & JavaScript.

---

## 🌐 Live Demo

🔗(https://deveshborse.github.io/medimind-health-assistant/)**

---

## 📌 Problem Statement

Millions of people — especially elderly patients and those with chronic conditions — miss their medications daily due to forgetfulness, lack of tracking, and poor health awareness. According to WHO, medication non-adherence causes **125,000 deaths annually** and accounts for **10–25% of hospitalizations**.

**MediMind** solves this by providing a free, always-available AI-powered health assistant that tracks medications, sends reminders, and answers health questions — right in the browser.

---

## ✨ Features

### 📊 Dashboard
- Dynamic greeting (Good Morning / Afternoon / Evening / Night)
- Live date and day display
- Stats: Total medications, Taken today, Missed today, Streak
- Today's medication schedule with Take Now buttons
- Mark All Taken in one click
- AI Health Tip with refresh button
- Print daily schedule

### 💊 My Medications
- View all added medications with full details
- Search by name or category
- Filter by medication category
- Edit any medication (name, dose, time, category)
- Remove medications

### ➕ Add Medication
- Add custom medications with name, dose, frequency, time, category, food instructions, and notes
- 8 Quick Add presets (Paracetamol, Metformin, Vitamin D3, Atorvastatin, etc.)

### 🤖 AI Assistant
- Chat-based health Q&A (no API key required)
- 16 topic knowledge base covering:
  - Side effects of painkillers
  - Missed dose guidance
  - Blood pressure & diabetes management
  - Thyroid medication tips
  - Eye drops usage
  - Fever & cold remedies
  - Sleep, hydration, exercise, mental health
  - Antibiotic resistance awareness
- Personalized suggestions based on your added medications
- Chat history saved across sessions
- Clear chat option

### 📈 Health Insights
- Weekly adherence bar chart
- Monthly calendar heatmap
- Missed medication history log
- Medication category breakdown
- AI-generated personalized insight

### 🎨 UI / UX
- Dark Mode & Light Mode toggle
- Splash screen on load
- Browser notification popup for medication reminders
- Fully responsive (mobile + desktop)
- Smooth animations and transitions

---

## 🗂️ Project Structure

```
medimind-health-assistant/
│
├── index.html      # Main UI — all tabs, modals, sidebar, layout
├── style.css       # All styling — dark/light theme, responsive design
├── bot.js          # All logic — KB, intent matching, localStorage, reminders
└── README.md       # Project documentation
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 | Structure, layout, modals, chat UI |
| CSS3 | Theming, animations, responsive grid |
| JavaScript (ES6) | Bot logic, intent matching, localStorage |
| Font Awesome 6 | Icons throughout the UI |
| Google Fonts (Inter + Sora) | Typography |
| GitHub Pages | Free static site hosting |

> ⚡ No frameworks. No API keys. No backend. Fully free and open source.

---

## 🔮 Future Scope

- **Voice input** using Web Speech API for hands-free interaction
- **WhatsApp / Telegram bot** integration for messaging platform reminders
- **Multi-language support** — Hindi, Marathi for wider accessibility
- **Student login** with personalized profiles and medication history
- **OpenAI / Claude API integration** for truly intelligent NLP responses
- **College ERP integration** for real-time health record access
- **Analytics dashboard** for doctors to monitor patient adherence
- **Mobile app** (React Native) for push notifications



<div align="center">
  <strong>Built with ❤️ for SDG 3 — Good Health & Well-being</strong><br>
  <em>MediMind AI Health Assistant — Capstone Project</em>
</div>
