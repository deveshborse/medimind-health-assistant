# 💊 MediMind — AI Health Assistant

> **SDG 3: Good Health & Well-being**  
> An AI-powered medication tracker and health assistant built with HTML, CSS & JavaScript.

![MediMind Banner](https://img.shields.io/badge/MediMind-AI%20Health%20Assistant-00d68f?style=for-the-badge&logo=heart&logoColor=white)
![SDG 3](https://img.shields.io/badge/SDG%203-Good%20Health%20%26%20Well--being-4CAF50?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🌐 Live Demo

🔗 **[https://yourusername.github.io/medimind-health-assistant/](https://yourusername.github.io/medimind-health-assistant/)**

> *(Replace `yourusername` with your actual GitHub username)*

---

## 📌 Problem Statement

Millions of people — especially elderly patients and those with chronic conditions — miss their medications daily due to forgetfulness, lack of tracking, and poor health awareness. According to WHO, medication non-adherence causes **125,000 deaths annually** and accounts for **10–25% of hospitalizations**.

**MediMind** solves this by providing a free, always-available AI-powered health assistant that tracks medications, sends reminders, and answers health questions — right in the browser.

---

## 🎯 SDG Alignment

**SDG Goal 3 — Good Health & Well-being**  
Target 3.8: Achieve universal health coverage and access to quality healthcare.

MediMind addresses the gap in affordable, accessible health management tools for individuals who cannot afford personal healthcare assistants or smart devices.

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

## 🚀 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medimind-health-assistant.git
   ```

2. **Open the project folder**
   ```bash
   cd medimind-health-assistant
   ```

3. **Open `index.html` in your browser**
   ```bash
   # Just double-click index.html
   # Or use VS Code Live Server extension
   ```

No installation or setup required. Works entirely in the browser.

---

## 📱 How to Deploy on GitHub Pages

1. Push all files to a **public** GitHub repository
2. Go to **Settings → Pages**
3. Set Source to **Deploy from branch → main → / (root)**
4. Click **Save**
5. Your live link will be: `https://yourusername.github.io/repo-name/`

---

## 🤖 How the AI Works

MediMind uses a **keyword-based intent matching system** — no external AI API required.

```
User Input
    ↓
Convert to lowercase
    ↓
Loop through Knowledge Base (16 topics)
    ↓
Check if any keyword matches input
    ↓
Match found? → Return topic response + suggestions
No match?   → Return fallback message
```

The Knowledge Base covers 16 health topics with medically accurate information. Responses are also personalized based on the user's added medications — if you've added Metformin, the bot gives diabetes-specific tips automatically.

---

## 💾 Data Storage

All data is stored **locally in the browser** using `localStorage`:

| Key | Data |
|-----|------|
| `medimind_meds` | All medications |
| `medimind_taken_YYYY-MM-DD` | Doses taken per day |
| `medimind_streak` | Current streak count |
| `medimind_chat` | Chat history |
| `medimind_records` | Daily adherence records |
| `medimind_theme` | Dark/light preference |

No data is sent to any server. Completely private and offline-capable.

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

---

## 👨‍💻 Author

**Devesh Borse**  
GitHub: [@deveshborse](https://github.com/deveshborse)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Font Awesome](https://fontawesome.com) — Icons
- [Google Fonts](https://fonts.google.com) — Inter & Sora typefaces
- [GitHub Pages](https://pages.github.com) — Free hosting
- [WHO](https://www.who.int) — Health data and medication adherence statistics
- **Lenovo & BharatCares** — Capstone Project Assignment

---

<div align="center">
  <strong>Built with ❤️ for SDG 3 — Good Health & Well-being</strong><br>
  <em>MediMind AI Health Assistant — Capstone Project</em>
</div>
