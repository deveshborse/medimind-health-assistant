// ═══════════════════════════════════════
//   MEDIMIND v2 — All Upgrades
//   bot.js
// ═══════════════════════════════════════

// ── STATE ──
let medications = JSON.parse(localStorage.getItem('medimind_meds') || '[]');
let takenToday  = JSON.parse(localStorage.getItem('medimind_taken_' + todayStr()) || '[]');
let streak      = parseInt(localStorage.getItem('medimind_streak') || '0');
let chatHistory = JSON.parse(localStorage.getItem('medimind_chat') || '[]');
let currentView = 'weekly';

function todayStr() { return new Date().toISOString().slice(0, 10); }

// ══════════════════════════════
// 1. SPLASH SCREEN
// ══════════════════════════════
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
  }, 2000);
});

// ══════════════════════════════
// 2. DYNAMIC GREETING + DATE
// ══════════════════════════════
function updateGreeting() {
  const now  = new Date();
  const hour = now.getHours();
  let greeting, emoji;
  if (hour >= 5 && hour < 12)      { greeting = 'Good morning';   emoji = '🌅'; }
  else if (hour >= 12 && hour < 17) { greeting = 'Good afternoon'; emoji = '☀️'; }
  else if (hour >= 17 && hour < 21) { greeting = 'Good evening';   emoji = '🌆'; }
  else                               { greeting = 'Good night';     emoji = '🌙'; }

  document.getElementById('greetingText').textContent = `${greeting} ${emoji}`;

  const dayNames  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const monthNames= ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dateStr   = `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  document.getElementById('greetingDate').textContent = `${dateStr} — Here's your health summary.`;

  // topbar date
  document.getElementById('dateDisplay').textContent =
    `${dayNames[now.getDay()].slice(0,3)}, ${now.getDate()} ${monthNames[now.getMonth()].slice(0,3)}`;
}
updateGreeting();
setInterval(updateGreeting, 60000);

// ══════════════════════════════
// 3. DARK / LIGHT THEME TOGGLE
// ══════════════════════════════
let isDark = localStorage.getItem('medimind_theme') !== 'light';
applyTheme();

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('themeIcon').className  = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  document.getElementById('themeLabel').textContent = isDark ? 'Dark Mode' : 'Light Mode';
  document.getElementById('splash').style.background = isDark ? '#0f1117' : '#f0f4ff';
}

function toggleTheme() {
  isDark = !isDark;
  localStorage.setItem('medimind_theme', isDark ? 'dark' : 'light');
  applyTheme();
}

// ══════════════════════════════
// 4. NAVIGATION
// ══════════════════════════════
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
    closeSidebar();
  });
});

function switchTab(tab) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');
  const titles = { 'dashboard':'Dashboard','medications':'My Medications','add-med':'Add Medication','assistant':'AI Assistant','insights':'Health Insights' };
  document.getElementById('topbarTitle').textContent = titles[tab] || tab;
  if (tab === 'dashboard')   renderDashboard();
  if (tab === 'medications') renderMedList();
  if (tab === 'insights')    renderInsights();
  if (tab === 'assistant')   initChat();
}

document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('sidebar').classList.add('open'));
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); }

// ══════════════════════════════
// 5. QUICK ADD
// ══════════════════════════════
const QUICK_MEDS = [
  { name:'Paracetamol 500mg',    dose:'1 tablet',   freq:'twice',  time:'08:00', cat:'Pain Relief',    food:'after' },
  { name:'Vitamin D3 1000 IU',   dose:'1 capsule',  freq:'once',   time:'09:00', cat:'Vitamins',        food:'after' },
  { name:'Metformin 500mg',      dose:'1 tablet',   freq:'twice',  time:'08:00', cat:'Diabetes',        food:'after' },
  { name:'Atorvastatin 10mg',    dose:'1 tablet',   freq:'once',   time:'21:00', cat:'Heart',           food:'any'   },
  { name:'Amoxicillin 500mg',    dose:'1 capsule',  freq:'thrice', time:'08:00', cat:'Antibiotic',      food:'after' },
  { name:'Omeprazole 20mg',      dose:'1 capsule',  freq:'once',   time:'07:30', cat:'General',         food:'before'},
  { name:'Levothyroxine 50mcg',  dose:'1 tablet',   freq:'once',   time:'07:00', cat:'Thyroid',         food:'before'},
  { name:'Amlodipine 5mg',       dose:'1 tablet',   freq:'once',   time:'08:00', cat:'Blood Pressure',  food:'any'   },
];

(function buildQuickAdd() {
  document.getElementById('quickAddGrid').innerHTML = QUICK_MEDS.map((m,i) => `
    <button class="quick-add-btn" onclick="quickAdd(${i})">
      <div class="qa-name">💊 ${m.name}</div>
      <div class="qa-info">${m.dose} · ${freqLabel(m.freq)}</div>
    </button>`).join('');
})();

function quickAdd(i) {
  const m = QUICK_MEDS[i];
  document.getElementById('medName').value     = m.name;
  document.getElementById('medDose').value     = m.dose;
  document.getElementById('medFreq').value     = m.freq;
  document.getElementById('medTime1').value    = m.time;
  document.getElementById('medCategory').value = m.cat;
  document.getElementById('medFood').value     = m.food;
  addMedication();
}

// ══════════════════════════════
// 6. ADD MEDICATION
// ══════════════════════════════
function addMedication() {
  const name = document.getElementById('medName').value.trim();
  const dose = document.getElementById('medDose').value.trim();
  const freq = document.getElementById('medFreq').value;
  const time = document.getElementById('medTime1').value;
  const cat  = document.getElementById('medCategory').value;
  const food = document.getElementById('medFood').value;
  const notes= document.getElementById('medNotes').value.trim();
  const msg  = document.getElementById('formMsg');

  if (!name || !dose || !time) {
    msg.className = 'form-msg error';
    msg.textContent = '⚠️ Please fill in Name, Dosage, and Time.';
    return;
  }
  medications.push({ id: Date.now(), name, dose, freq, time, cat, food, notes, addedOn: todayStr() });
  saveMeds();
  msg.className = 'form-msg success';
  msg.textContent = `✅ ${name} added successfully!`;
  clearForm();
  updateStats();
  setTimeout(() => { msg.textContent = ''; }, 3000);
}

function clearForm() {
  ['medName','medDose','medNotes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('medFreq').value     = 'once';
  document.getElementById('medTime1').value    = '';
  document.getElementById('medCategory').value = 'General';
  document.getElementById('medFood').value     = 'after';
}

function saveMeds() { localStorage.setItem('medimind_meds', JSON.stringify(medications)); }

// ══════════════════════════════
// 7. EDIT MEDICATION
// ══════════════════════════════
function openEditModal(id) {
  const med = medications.find(m => m.id === id);
  if (!med) return;
  document.getElementById('editId').value       = id;
  document.getElementById('editName').value     = med.name;
  document.getElementById('editDose').value     = med.dose;
  document.getElementById('editFreq').value     = med.freq;
  document.getElementById('editTime').value     = med.time;
  document.getElementById('editCategory').value = med.cat;
  document.getElementById('editFood').value     = med.food;
  document.getElementById('editNotes').value    = med.notes || '';
  document.getElementById('editModal').classList.add('open');
}

function closeEditModal() { document.getElementById('editModal').classList.remove('open'); }

function saveEdit() {
  const id   = parseInt(document.getElementById('editId').value);
  const idx  = medications.findIndex(m => m.id === id);
  if (idx === -1) return;
  medications[idx] = {
    ...medications[idx],
    name : document.getElementById('editName').value.trim(),
    dose : document.getElementById('editDose').value.trim(),
    freq : document.getElementById('editFreq').value,
    time : document.getElementById('editTime').value,
    cat  : document.getElementById('editCategory').value,
    food : document.getElementById('editFood').value,
    notes: document.getElementById('editNotes').value.trim(),
  };
  saveMeds();
  closeEditModal();
  renderMedList();
  renderDashboard();
}

// ══════════════════════════════
// 8. DASHBOARD RENDER
// ══════════════════════════════
function renderDashboard() {
  updateStats();
  renderSchedule();
  refreshTip();
}

function updateStats() {
  document.getElementById('statTotal').textContent  = medications.length;
  document.getElementById('statTaken').textContent  = takenToday.length;
  document.getElementById('statMissed').textContent = Math.max(0, medications.length - takenToday.length);
  document.getElementById('statStreak').textContent = streak;
}

function renderSchedule() {
  const list  = document.getElementById('scheduleList');
  const badge = document.getElementById('scheduleCount');
  if (medications.length === 0) {
    list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-calendar-plus"></i><p>No medications added yet.<br>Go to <strong>Add Medication</strong> to get started!</p></div>`;
    badge.textContent = '0 doses';
    return;
  }
  badge.textContent = `${medications.length} dose${medications.length !== 1 ? 's' : ''}`;
  list.innerHTML = [...medications].sort((a,b) => a.time.localeCompare(b.time)).map(med => {
    const taken = takenToday.includes(med.id);
    return `<div class="schedule-item ${taken ? 'taken' : ''}">
      <div class="schedule-time">${formatTime(med.time)}</div>
      <div class="schedule-details">
        <div class="schedule-name">${med.name}</div>
        <div class="schedule-sub">${med.dose} · ${catIcon(med.cat)} ${med.cat} · ${foodLabel(med.food)}</div>
      </div>
      ${taken
        ? `<button class="take-btn taken-btn">✓ Taken</button>`
        : `<button class="take-btn" onclick="markTaken(${med.id})">Take Now</button>`}
    </div>`;
  }).join('');
}

function markTaken(id) {
  if (!takenToday.includes(id)) {
    takenToday.push(id);
    localStorage.setItem('medimind_taken_' + todayStr(), JSON.stringify(takenToday));
    if (takenToday.length === medications.length && medications.length > 0) {
      streak++;
      localStorage.setItem('medimind_streak', streak);
    }
    renderSchedule();
    updateStats();
    // Save for missed history
    saveDayRecord();
  }
}

// ── MARK ALL TAKEN ──
function markAllTaken() {
  medications.forEach(med => {
    if (!takenToday.includes(med.id)) takenToday.push(med.id);
  });
  localStorage.setItem('medimind_taken_' + todayStr(), JSON.stringify(takenToday));
  if (medications.length > 0) { streak++; localStorage.setItem('medimind_streak', streak); }
  renderSchedule();
  updateStats();
  saveDayRecord();
  showNotif('All Done! 🎉', 'All medications marked as taken for today!');
}

function saveDayRecord() {
  const records = JSON.parse(localStorage.getItem('medimind_records') || '{}');
  records[todayStr()] = { total: medications.length, taken: takenToday.length };
  localStorage.setItem('medimind_records', JSON.stringify(records));
}

// ══════════════════════════════
// 9. MED LIST RENDER (with search + filter)
// ══════════════════════════════
function renderMedList() {
  const search = (document.getElementById('medSearch')?.value || '').toLowerCase();
  const cat    = document.getElementById('catFilter')?.value || '';
  let filtered = medications.filter(m => {
    const matchSearch = !search || m.name.toLowerCase().includes(search) || m.cat.toLowerCase().includes(search);
    const matchCat    = !cat || m.cat === cat;
    return matchSearch && matchCat;
  });
  const list = document.getElementById('medList');
  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-prescription-bottle-medical"></i><p>${medications.length === 0 ? 'No medications added yet.' : 'No results found for your search.'}</p></div>`;
    return;
  }
  list.innerHTML = filtered.map(med => `
    <div class="med-card">
      <div class="med-icon">${catIcon(med.cat)}</div>
      <div class="med-details">
        <div class="med-name">${med.name}</div>
        <div class="med-meta">
          <span><i class="fa-solid fa-pills"></i> ${med.dose}</span>
          <span><i class="fa-solid fa-clock"></i> ${formatTime(med.time)}</span>
          <span><i class="fa-solid fa-repeat"></i> ${freqLabel(med.freq)}</span>
          <span><i class="fa-solid fa-utensils"></i> ${foodLabel(med.food)}</span>
          <span><i class="fa-solid fa-tag"></i> ${med.cat}</span>
        </div>
        ${med.notes ? `<div style="font-size:12px;color:var(--text-muted);margin-top:4px;">📝 ${med.notes}</div>` : ''}
      </div>
      <div class="med-actions">
        <button class="edit-btn" onclick="openEditModal(${med.id})"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="del-btn"  onclick="deleteMed(${med.id})"><i class="fa-solid fa-trash"></i> Remove</button>
      </div>
    </div>`).join('');
}

function deleteMed(id) {
  if (!confirm('Remove this medication?')) return;
  medications = medications.filter(m => m.id !== id);
  saveMeds();
  renderMedList();
  updateStats();
}

// ══════════════════════════════
// 10. INSIGHTS
// ══════════════════════════════
function renderInsights() {
  const total  = medications.length;
  const taken  = takenToday.length;
  const rate   = total > 0 ? Math.round((taken / total) * 100) : 0;
  document.getElementById('adherenceRate').textContent = rate + '%';
  document.getElementById('bestStreak').textContent    = streak;

  // missed this week
  let weekMissed = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0,10);
    const rec = JSON.parse(localStorage.getItem('medimind_records') || '{}')[key];
    if (rec) weekMissed += Math.max(0, rec.total - rec.taken);
  }
  document.getElementById('totalMissed').textContent = weekMissed;

  renderWeekChart();
  renderMonthGrid();
  renderMissedHistory();
  renderCategoryList();
  document.getElementById('insightText').textContent = generateInsight(rate, streak, total);
}

function switchView(v) {
  currentView = v;
  document.getElementById('btnWeekly').classList.toggle('active', v === 'weekly');
  document.getElementById('btnMonthly').classList.toggle('active', v === 'monthly');
  document.getElementById('weeklyView').style.display  = v === 'weekly'  ? 'block' : 'none';
  document.getElementById('monthlyView').style.display = v === 'monthly' ? 'block' : 'none';
}

function renderWeekChart() {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const now  = new Date();
  document.getElementById('weekChart').innerHTML = Array.from({length:7},(_,i) => {
    const d = new Date(now); d.setDate(now.getDate() - (6-i));
    const dateStr  = d.toISOString().slice(0,10);
    const dayTaken = JSON.parse(localStorage.getItem('medimind_taken_' + dateStr) || '[]');
    const total    = medications.length;
    const pct      = total > 0 ? (dayTaken.length / total) * 100 : 0;
    const cls      = pct >= 100 ? 'full' : pct > 0 ? 'partial' : 'none';
    const h        = Math.max(8, Math.round(pct * 0.9));
    return `<div class="day-bar">
      <div class="bar-fill ${cls}" style="height:${h}px" title="${Math.round(pct)}% taken"></div>
      <div class="day-label">${days[d.getDay()]}</div>
    </div>`;
  }).join('');
}

function renderMonthGrid() {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();
  const days  = new Date(year, month+1, 0).getDate();
  const first = new Date(year, month, 1).getDay();
  const grid  = document.getElementById('monthGrid');
  let html    = '';
  for (let i = 0; i < first; i++) html += `<div class="month-cell future"></div>`;
  for (let d = 1; d <= days; d++) {
    const dateStr  = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayTaken = JSON.parse(localStorage.getItem('medimind_taken_' + dateStr) || '[]');
    const total    = medications.length;
    const isFuture = d > now.getDate();
    let cls;
    if (isFuture)            cls = 'future';
    else if (total === 0)    cls = 'none';
    else if (dayTaken.length >= total) cls = 'full';
    else if (dayTaken.length > 0)      cls = 'partial';
    else                     cls = 'none';
    html += `<div class="month-cell ${cls}" title="${dateStr}">${d}</div>`;
  }
  grid.innerHTML = html;
}

function renderMissedHistory() {
  const container = document.getElementById('missedHistory');
  const records   = JSON.parse(localStorage.getItem('medimind_records') || '{}');
  const missed    = Object.entries(records)
    .filter(([,r]) => r.taken < r.total)
    .sort((a,b) => b[0].localeCompare(a[0]))
    .slice(0, 10);
  if (missed.length === 0) {
    container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-circle-check" style="color:var(--green)"></i><p>No missed medications recorded. Keep it up!</p></div>`;
    return;
  }
  container.innerHTML = missed.map(([date, rec]) => `
    <div class="missed-row">
      <div class="missed-date">${date}</div>
      <div class="missed-name">Missed ${rec.total - rec.taken} of ${rec.total} doses</div>
      <div class="missed-badge">⚠️ Missed</div>
    </div>`).join('');
}

function renderCategoryList() {
  const catMap = {};
  medications.forEach(m => { catMap[m.cat] = (catMap[m.cat] || 0) + 1; });
  const cats    = Object.entries(catMap);
  const catList = document.getElementById('categoryList');
  if (cats.length === 0) {
    catList.innerHTML = `<div class="empty-state"><i class="fa-solid fa-chart-pie"></i><p>Add medications to see insights.</p></div>`;
    return;
  }
  const max = Math.max(...cats.map(c => c[1]));
  catList.innerHTML = cats.map(([cat, count]) => `
    <div class="cat-row">
      <div class="cat-name">${catIcon(cat)} ${cat}</div>
      <div class="cat-bar-bg"><div class="cat-bar-fill" style="width:${(count/max)*100}%"></div></div>
      <div class="cat-count">${count}</div>
    </div>`).join('');
}

function generateInsight(rate, streak, total) {
  if (total === 0) return "Start by adding your medications to get personalized health insights!";
  if (rate === 100) return `🎉 Perfect! You've taken all your medications today. Your ${streak}-day streak shows excellent discipline. Keep it up!`;
  if (rate >= 75)  return `👍 Good job! You've taken ${rate}% of your medications today. Try to complete the remaining doses for a perfect streak!`;
  if (rate >= 50)  return `⚠️ You've taken ${rate}% of today's doses. Missing medications regularly can reduce treatment effectiveness.`;
  if (rate > 0)    return `🔔 You've only taken ${rate}% of today's medications. Please take your remaining doses as prescribed.`;
  return `📋 You have ${total} medication(s) scheduled today. Remember to take them on time!`;
}

// ══════════════════════════════
// 11. AI TIPS
// ══════════════════════════════
const HEALTH_TIPS = [
  "💧 Drink a full glass of water when taking your medications. Staying hydrated improves medication absorption.",
  "⏰ Set alarms for each medication time. Consistency at the same time daily builds a strong habit within 21 days.",
  "🍽️ Never skip meals before taking medications that require food — it protects your stomach lining.",
  "📱 Keep a small pill organizer labeled by day. Visual confirmation reduces double-dosing mistakes.",
  "🌙 Poor sleep weakens your immune system. Aim for 7–8 hours — it works alongside your medications.",
  "🚶 A 30-minute daily walk improves heart health, blood sugar control, and boosts medication effectiveness.",
  "🧘 Stress raises blood pressure and blood sugar. Try 5 minutes of deep breathing every morning.",
  "🍌 Potassium-rich foods like bananas support heart medications. Eat a balanced diet alongside your treatment.",
  "📋 Never stop taking prescribed medications without consulting your doctor, even if you feel better.",
  "☀️ Vitamin D from 15 minutes of morning sunlight supports bone health and overall immunity.",
  "🥗 Avoid grapefruit juice with certain medications — it can increase or decrease drug effectiveness.",
  "💊 Antibiotics must be completed fully, even after symptoms disappear. Stopping early causes resistance.",
  "🦋 Thyroid medications work best on an empty stomach, 30–60 minutes before breakfast.",
  "👁️ Eye drops: tilt head back, pull lower eyelid down gently, and avoid touching the dropper to your eye.",
  "🩺 Monitor your blood pressure at home weekly if you're on BP medication — consistency matters.",
];

let lastTipIndex = -1;
function refreshTip() {
  let idx;
  do { idx = Math.floor(Math.random() * HEALTH_TIPS.length); } while (idx === lastTipIndex);
  lastTipIndex = idx;
  document.getElementById('tipText').textContent = HEALTH_TIPS[idx];
}

// ══════════════════════════════
// 12. NOTIFICATION POPUP
// ══════════════════════════════
function showNotif(title, msg) {
  document.getElementById('notifTitle').textContent = title;
  document.getElementById('notifMsg').textContent   = msg;
  const popup = document.getElementById('notifPopup');
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 4000);
}
function closeNotif() { document.getElementById('notifPopup').classList.remove('show'); }

// Check medication times every minute
function checkReminders() {
  const now  = new Date();
  const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  medications.forEach(med => {
    if (med.time === hhmm && !takenToday.includes(med.id)) {
      showNotif('💊 Medication Reminder', `Time to take ${med.name} — ${med.dose}`);
    }
  });
}
setInterval(checkReminders, 60000);

// ══════════════════════════════
// 13. PRINT SCHEDULE
// ══════════════════════════════
function printSchedule() {
  const now   = new Date();
  const rows  = medications.map(m => `
    <tr>
      <td>${m.name}</td>
      <td>${m.dose}</td>
      <td>${formatTime(m.time)}</td>
      <td>${freqLabel(m.freq)}</td>
      <td>${foodLabel(m.food)}</td>
      <td>${takenToday.includes(m.id) ? '✓ Taken' : '○ Pending'}</td>
    </tr>`).join('');
  document.getElementById('printArea').innerHTML = `
    <div style="font-family:Arial,sans-serif;padding:20px;max-width:700px;margin:auto;">
      <h1 style="color:#00d68f;">MediMind — Daily Schedule</h1>
      <p style="color:#666;">${now.toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <thead>
          <tr style="background:#00d68f;color:#000;">
            <th style="padding:10px;text-align:left;">Medication</th>
            <th>Dose</th><th>Time</th><th>Frequency</th><th>With Food</th><th>Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top:20px;font-size:12px;color:#999;">Printed from MediMind AI Health Assistant · SDG 3: Good Health & Well-being</p>
    </div>`;
  window.print();
}

// ══════════════════════════════
// 14. AI CHAT (expanded KB + history + med suggestions)
// ══════════════════════════════
const KB = [
  { keywords:['side effect','side effects','painkiller','ibuprofen','paracetamol','aspirin'],
    response:`Common side effects of painkillers:\n\n💊 Paracetamol — Generally safe. Overdose can cause liver damage. Do not exceed 4g/day.\n\n💊 Ibuprofen — May cause stomach upset, ulcers, or kidney issues. Always take after meals.\n\n💊 Aspirin — Can cause stomach bleeding. Not for children under 16.\n\n⚠️ Follow prescribed dosage. Consult your doctor if side effects persist.` },
  { keywords:['miss','missed','forget','forgot','skip','skipped','dose'],
    response:`If you missed a dose:\n\n✅ Take it as soon as you remember — if still close to the scheduled time.\n⏭️ If it's almost time for the next dose — skip the missed one. Never double-dose.\n🚫 Never take two doses at once.\n📞 For critical medications (heart, diabetes, BP) — contact your doctor if unsure.\n⏰ Tip: Set two alarms — 15 mins before and at the exact time.` },
  { keywords:['habit','routine','remember','reminder','consistent'],
    response:`How to build a strong medication habit:\n\n1. 📅 Take at the same time every day.\n2. 🔔 Set phone alarms with the medication name.\n3. 💊 Use a pill organizer by day.\n4. 🍽️ Link it to a daily activity (e.g., after breakfast).\n5. 📲 Use MediMind streaks to stay motivated!\n\nResearch shows 21 days builds a habit. Start today!` },
  { keywords:['sleep','insomnia','tired','rest','fatigue'],
    response:`Tips for better sleep:\n\n😴 Aim for 7–8 hours per night.\n📱 Avoid screens 1 hour before bed.\n🌡️ Keep room cool (18–20°C).\n☕ No caffeine after 2 PM.\n🧘 Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s.\n💊 Some medications affect sleep — check with your doctor.` },
  { keywords:['water','hydration','hydrate','drink','fluid'],
    response:`Daily hydration guide:\n\n💧 Recommended: 8–10 glasses (2–2.5 litres) daily.\n🏃 More if you exercise or live in a hot climate.\n💊 Drink a full glass with every medication.\n\n✅ Improves kidney function, blood pressure meds, and energy levels.` },
  { keywords:['food','eat','meal','stomach','grapefruit','avoid'],
    response:`Food and medication interactions:\n\n🍊 Grapefruit — Interferes with 85+ medications including statins. Avoid completely.\n🥛 Dairy — Reduces absorption of some antibiotics. Take 1 hour apart.\n🍃 Leafy greens — High Vitamin K can interfere with blood thinners.\n☕ Caffeine — Increases side effects of some asthma medications.` },
  { keywords:['blood pressure','bp','hypertension','high bp'],
    response:`Managing blood pressure:\n\n🎯 Normal BP: 120/80 mmHg\n⚠️ High BP: 140/90 mmHg or above\n\n🧂 Reduce salt intake (less than 5g/day)\n🏃 30 mins walking daily can lower BP by 5–8 mmHg\n💊 Never skip BP medications, even if you feel fine\n📏 Monitor at home weekly` },
  { keywords:['diabetes','sugar','blood sugar','glucose','insulin','metformin'],
    response:`Diabetes medication tips:\n\n💊 Metformin — Always take with or after meals to prevent nausea.\n💉 Insulin — Store in refrigerator. Never freeze.\n\n🍽️ Eat small meals every 3–4 hours.\n🔢 Target fasting blood sugar: 80–130 mg/dL\n⚠️ Low blood sugar symptoms: dizziness, sweating, shaking. Keep glucose tablets handy.` },
  { keywords:['antibiotic','antibiotics','amoxicillin','azithromycin','resistance'],
    response:`Antibiotic guide:\n\n✅ Complete the full course — even if you feel better.\n❌ Never stop early — remaining bacteria become resistant.\n❌ Never share or use leftover antibiotics.\n\n⏰ Take at evenly spaced times.\n🥛 Some antibiotics are affected by dairy — check with your pharmacist.\n🦠 Antibiotic resistance is a global health crisis.` },
  { keywords:['vitamin','supplement','vitamin d','vitamin b12','iron','calcium'],
    response:`Vitamin & supplement tips:\n\n☀️ Vitamin D3 — Best absorbed with a fatty meal.\n🥩 Vitamin B12 — Important for vegetarians. Take after meals.\n🫐 Iron — Take on empty stomach with Vitamin C. Avoid with calcium.\n🦴 Calcium — Split into smaller doses, twice daily with Vitamin D.\n\n⚠️ Common deficiencies in India: Vitamin D, B12, Iron.` },
  { keywords:['thyroid','levothyroxine','hypothyroid','hyperthyroid'],
    response:`Thyroid medication tips:\n\n🦋 Levothyroxine must be taken on an empty stomach, 30–60 minutes before breakfast.\n⚠️ Never take with calcium, iron, or antacids — they block absorption.\n⏰ Take at the exact same time every day.\n🚫 Never stop without doctor's advice — thyroid levels take weeks to stabilize.\n🧪 Get TSH blood test every 6 months to monitor levels.` },
  { keywords:['eye drop','eyedrop','eye','drops','glaucoma'],
    response:`Eye drops guide:\n\n👁️ Wash hands before applying.\n🛏️ Tilt head back, pull lower eyelid gently to form a pocket.\n💧 Apply 1 drop — don't touch the dropper to your eye or eyelid.\n👀 Close your eye for 1–2 minutes and press the inner corner gently.\n⏱️ Wait 5 minutes between different eye drops.\n🌡️ Store as instructed — some need refrigeration.` },
  { keywords:['fever','cold','flu','temperature','cough','runny nose'],
    response:`Managing fever & cold:\n\n🌡️ Fever above 38.5°C — take paracetamol and stay hydrated.\n💧 Drink 3+ litres of fluid daily during fever.\n🍯 Warm water with honey and ginger soothes a sore throat.\n😴 Rest is the most important medicine for viral infections.\n\n⚠️ See a doctor if:\n→ Fever above 40°C or lasts more than 3 days\n→ Difficulty breathing\n→ Rash appears with fever` },
  { keywords:['exercise','workout','walking','yoga','physical activity'],
    response:`Exercise and medications:\n\n🏃 Benefits of 30 mins daily exercise:\n→ Lowers blood pressure by 5–8 mmHg\n→ Improves blood sugar control\n→ Improves sleep quality\n\n💊 Exercise timing:\n→ Diabetes: avoid exercise when insulin peaks\n→ BP: don't exercise right after taking meds\n→ Asthma: always carry your inhaler` },
  { keywords:['heart','cardiac','cholesterol','statin','atorvastatin'],
    response:`Heart health tips:\n\n💊 Statins: Take at night — liver produces more cholesterol then.\n🍊 Avoid grapefruit completely.\n\n❤️ Heart-healthy habits:\n→ Reduce fried food and red meat\n→ Eat oily fish and nuts (omega-3)\n→ Walk 10,000 steps daily\n→ Quit smoking — #1 preventable heart risk\n\n🎯 Target LDL: below 100 mg/dL` },
  { keywords:['stress','anxiety','mental','depression','worry'],
    response:`Mental health & medication:\n\n🧘 Managing stress:\n→ 4-7-8 breathing technique\n→ 10 minutes of morning sunlight\n→ Limit social media and news\n\n💊 If on mental health medication:\n→ Never stop abruptly — always taper under doctor's guidance\n→ Takes 2–4 weeks for antidepressants to work\n\n📞 iCall India: 9152987821` },
  { keywords:['menu','help','hi','hello','hey','what can you'],
    response:`Hello! 👋 I'm MediMind AI. I can help with:\n\n💊 Medication side effects & interactions\n⚠️ Missed dose guidance\n🦋 Thyroid, Diabetes, Heart, BP medications\n👁️ Eye drops usage\n🤒 Fever & cold management\n😴 Sleep & stress tips\n💧 Hydration & food interactions\n🏃 Exercise & wellness\n\nJust type your question!` },
];

const FALLBACK = [
  "I'm not sure about that. Try asking about side effects, missed doses, diabetes, heart health, or sleep tips!",
  "That's outside my knowledge. I can help with medication guidance, health tips, and wellness advice.",
  "I don't have info on that yet. Try asking about your medications, food interactions, or daily health habits.",
];

function getBotResponse(input) {
  const lower = input.toLowerCase();
  // Check if any medication in user's list matches — give tailored suggestion
  const matchedMed = medications.find(m => lower.includes(m.name.toLowerCase().split(' ')[0]));
  if (matchedMed) {
    const catResponses = {
      'Thyroid': `For ${matchedMed.name}: Take on an empty stomach, 30–60 mins before breakfast. Avoid calcium and iron within 4 hours. Ask me more about thyroid management!`,
      'Diabetes': `For ${matchedMed.name}: Always take with or after meals to avoid nausea. Monitor blood sugar regularly. Ask me about diabetes tips!`,
      'Heart': `For ${matchedMed.name}: Take consistently at night. Avoid grapefruit. Never skip doses. Ask me about heart health tips!`,
      'Blood Pressure': `For ${matchedMed.name}: Take at the same time daily. Monitor your BP weekly at home. Reduce salt intake. Ask me about BP management!`,
      'Antibiotic': `For ${matchedMed.name}: Complete the full course even if you feel better. Take at evenly spaced times. Ask me about antibiotic tips!`,
    };
    if (catResponses[matchedMed.cat]) return catResponses[matchedMed.cat];
  }
  for (const entry of KB) {
    if (entry.keywords.some(kw => lower.includes(kw))) return entry.response;
  }
  return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
}

function initChat() {
  const container = document.getElementById('chatMessages');
  if (container.children.length > 0) return; // already loaded
  // Load saved history or show welcome
  if (chatHistory.length > 0) {
    chatHistory.forEach(msg => appendMsgRaw(msg.text, msg.role));
  } else {
    appendMsgRaw(`Hi! I'm your MediMind AI Health Assistant 👋\n\nI can help you with:\n• Medication reminders & information\n• Side effects & precautions\n• General health & wellness tips\n• Dosage guidance\n\nWhat would you like to know?`, 'bot');
  }
  // Add medication-specific suggestions
  if (medications.length > 0) {
    const cats = [...new Set(medications.map(m => m.cat))];
    cats.slice(0,3).forEach(cat => {
      const suggestions = {
        'Thyroid': `🦋 Tips for ${medications.find(m=>m.cat==='Thyroid')?.name}`,
        'Diabetes': `🩺 Tips for ${medications.find(m=>m.cat==='Diabetes')?.name}`,
        'Heart': `❤️ Tips for ${medications.find(m=>m.cat==='Heart')?.name}`,
        'Blood Pressure': `🔵 Tips for ${medications.find(m=>m.cat==='Blood Pressure')?.name}`,
      };
      if (suggestions[cat]) {
        const btn = document.createElement('button');
        btn.textContent = suggestions[cat];
        btn.onclick = () => sendQuick(suggestions[cat]);
        document.getElementById('quickReplies').appendChild(btn);
      }
    });
  }
}

function clearChat() {
  chatHistory = [];
  localStorage.removeItem('medimind_chat');
  document.getElementById('chatMessages').innerHTML = '';
  initChat();
}

function sendQuick(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg   = input.value.trim();
  if (!msg) return;
  appendMsg(msg, 'user');
  input.value = '';
  const typingId = 'typing-' + Date.now();
  appendTyping(typingId);
  setTimeout(() => {
    removeTyping(typingId);
    appendMsg(getBotResponse(msg), 'bot');
  }, 700 + Math.random() * 600);
}

function appendMsg(text, role) {
  appendMsgRaw(text, role);
  chatHistory.push({ text, role });
  if (chatHistory.length > 40) chatHistory = chatHistory.slice(-40);
  localStorage.setItem('medimind_chat', JSON.stringify(chatHistory));
}

function appendMsgRaw(text, role) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `
    <div class="msg-avatar"><i class="fa-solid fa-${role==='bot'?'robot':'user'}"></i></div>
    <div class="msg-bubble">${text.replace(/\n/g,'<br>')}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function appendTyping(id) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot'; div.id = id;
  div.innerHTML = `<div class="msg-avatar"><i class="fa-solid fa-robot"></i></div><div class="msg-bubble typing-bubble"><span></span><span></span><span></span></div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}
function removeTyping(id) { const el = document.getElementById(id); if (el) el.remove(); }

// ══════════════════════════════
// HELPERS
// ══════════════════════════════
function formatTime(t) {
  if (!t) return '';
  const [h,m] = t.split(':');
  const hour = parseInt(h);
  return `${hour%12||12}:${m} ${hour>=12?'PM':'AM'}`;
}
function freqLabel(f) { return {once:'Once daily',twice:'Twice daily',thrice:'3x daily',weekly:'Weekly'}[f]||f; }
function foodLabel(f) { return {after:'After meal',before:'Before meal',any:'Anytime'}[f]||f; }
function catIcon(cat) {
  return {'Heart':'❤️','Diabetes':'🩺','Blood Pressure':'🔵','Vitamins':'✨','Pain Relief':'💊','Antibiotic':'🦠','Mental Health':'🧘','Thyroid':'🦋','Eye Drops':'👁️','General':'💉'}[cat]||'💊';
}

// ── INIT ──
renderDashboard();
