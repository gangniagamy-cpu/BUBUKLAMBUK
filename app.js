/* ============================================
   MISI BUBUR LAMBUK — LIVE DASHBOARD APP
   Real-time progress tracking + Admin controls
   ============================================ */

// ==================== STATE ====================
const STATE_KEY = 'buburLambuk_state';
const PRICE_PER_PAX = 5;
const DEFAULT_TARGET_PAX = 2000;
const DEFAULT_START_PAX = 500;
const DEFAULT_LOCATION = 'Taman Melawati';
const DEFAULT_CAMPAIGN_NAME = 'Misi Bubur Lambuk';

let countdownInterval = null;
let audioCtx = null;
let lastDeletedDonor = null;
let undoTimeout = null;

let state = hydrateState(loadState());

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    startCountdown();
    createParticles();
    setupKeyboardShortcuts();
});

// ==================== PERSISTENCE ====================
function loadState() {
    try {
        const raw = localStorage.getItem(STATE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function createDefaultState() {
    const now = new Date();
    return {
        target: DEFAULT_TARGET_PAX,
        startPax: DEFAULT_START_PAX,
        currentPax: DEFAULT_START_PAX,
        donors: [],
        isLive: false,
        distributionAt: getDefaultDistributionAt(now).toISOString(),
        location: DEFAULT_LOCATION,
        campaignName: DEFAULT_CAMPAIGN_NAME,
        createdAt: now.toISOString()
    };
}

function getDefaultDistributionAt(baseDate = new Date()) {
    const target = new Date(baseDate);
    target.setDate(target.getDate() + 1);
    target.setHours(16, 0, 0, 0); // 4:00 PM local
    return target;
}

function toPositiveInt(value, fallback) {
    const num = parseInt(value, 10);
    return Number.isInteger(num) && num > 0 ? num : fallback;
}

function toNonNegativeInt(value, fallback) {
    const num = parseInt(value, 10);
    return Number.isInteger(num) && num >= 0 ? num : fallback;
}

function toIsoDate(value, fallbackIso) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? fallbackIso : parsed.toISOString();
}

function sanitizeDonors(rawDonors = []) {
    if (!Array.isArray(rawDonors)) return [];

    return rawDonors.map((d, i) => {
        const pax = toPositiveInt(d?.pax, 0);
        const cleanName = String(d?.name || '').trim();
        if (!d || !cleanName || pax < 1) return null;
        return {
            id: d.id || Date.now() + i,
            name: cleanName,
            pax,
            ref: String(d.ref || '').trim(),
            time: toIsoDate(d.time, new Date().toISOString()),
            verified: d.verified !== false
        };
    }).filter(Boolean);
}

function recalculateCurrentPax() {
    const donorSum = state.donors.reduce((acc, d) => acc + d.pax, 0);
    state.currentPax = state.startPax + donorSum;
}

function hydrateState(rawState) {
    const defaults = createDefaultState();
    if (!rawState || typeof rawState !== 'object') return defaults;

    const hydrated = {
        ...defaults,
        ...rawState
    };

    hydrated.target = toPositiveInt(hydrated.target, defaults.target);
    hydrated.startPax = toNonNegativeInt(hydrated.startPax, defaults.startPax);
    hydrated.donors = sanitizeDonors(hydrated.donors);
    hydrated.isLive = Boolean(hydrated.isLive);
    hydrated.distributionAt = toIsoDate(hydrated.distributionAt, defaults.distributionAt);
    hydrated.location = String(hydrated.location || '').trim() || defaults.location;
    hydrated.campaignName = String(hydrated.campaignName || '').trim() || defaults.campaignName;
    hydrated.createdAt = toIsoDate(hydrated.createdAt, defaults.createdAt);

    const donorSum = hydrated.donors.reduce((acc, d) => acc + d.pax, 0);
    hydrated.currentPax = hydrated.startPax + donorSum;
    return hydrated;
}

// ==================== RENDER ====================
function renderAll() {
    renderSessionMeta();
    renderProgress();
    renderStats();
    renderDonorFeed();
    renderDonorTable();
    renderLiveBadge();
    checkStorageWarning();
}

function renderSessionMeta() {
    const subtitle = document.getElementById('headerSubtitle');
    const distDate = new Date(state.distributionAt);
    const isValidDate = !Number.isNaN(distDate.getTime());

    if (subtitle && isValidDate) {
        const dateLabel = distDate.toLocaleDateString('ms-MY', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        const startTime = distDate.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' });
        const endDate = new Date(distDate.getTime() + (2 * 60 * 60 * 1000));
        const endTime = endDate.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' });
        subtitle.textContent = `Sedekah ${dateLabel} — ${startTime} - ${endTime} | ${state.location}`;
    }

    const distInput = document.getElementById('distributionInput');
    if (distInput && isValidDate) {
        const localValue = new Date(distDate.getTime() - (distDate.getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 16);
        distInput.value = localValue;
    }

    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
        locationInput.value = state.location || '';
    }
}

function renderProgress() {
    const pax = state.currentPax;
    const target = state.target;
    const percentage = Math.min((pax / target) * 100, 100);
    const circumference = 2 * Math.PI * 88; // r=88
    const offset = circumference - (percentage / 100) * circumference;

    const ring = document.getElementById('progressRing');
    if (ring) {
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = offset;
    }

    animateNumber('progressPax', pax);
    document.getElementById('targetPax').textContent = target.toLocaleString();

    // OVERTIME MODE — target achieved!
    const banner = document.getElementById('targetAchievedBanner');
    const ringWrapper = document.querySelector('.progress-ring-wrapper');
    if (pax >= target && banner) {
        banner.classList.add('active');
        if (ringWrapper) ringWrapper.classList.add('overtime');
    } else if (banner) {
        banner.classList.remove('active');
        if (ringWrapper) ringWrapper.classList.remove('overtime');
    }
}

function renderStats() {
    const pax = state.currentPax;
    const target = state.target;
    const baki = Math.max(target - pax, 0);
    const rm = pax * PRICE_PER_PAX;
    const pct = Math.min(Math.round((pax / target) * 100), 100);

    animateNumber('statTerkumpul', pax);
    animateNumber('statBaki', baki);
    document.getElementById('statRM').textContent = rm.toLocaleString();
    document.getElementById('statPercentage').textContent = pct + '%';
}

function renderDonorFeed() {
    const feed = document.getElementById('donorFeed');
    if (!feed) return;

    if (state.donors.length === 0) {
        feed.innerHTML = '<div class="donor-empty">Belum ada penyumbang baru. Jom jadi yang pertama! 🌟</div>';
        return;
    }

    const recentDonors = [...state.donors].reverse().slice(0, 30);
    feed.innerHTML = recentDonors.map(d => {
        const initials = d.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const time = new Date(d.time).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' });
        return `
      <div class="donor-item">
        <div class="donor-avatar">${initials}</div>
        <div class="donor-info">
          <div class="donor-name">${escapeHtml(d.name)}</div>
          <div class="donor-detail">${time} ${d.ref ? '• ' + escapeHtml(d.ref) : ''}</div>
        </div>
        <div class="donor-pax-badge">${d.pax} PAX</div>
      </div>
    `;
    }).join('');

    feed.scrollTop = 0;
}

function renderDonorTable() {
    const tbody = document.getElementById('donorTableBody');
    if (!tbody) return;

    if (state.donors.length === 0) {
        tbody.innerHTML = '<tr class="table-empty"><td colspan="7">Belum ada rekod</td></tr>';
        return;
    }

    tbody.innerHTML = state.donors.map((d, i) => {
        const time = new Date(d.time).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' });
        return `
      <tr>
        <td>${i + 1}</td>
        <td>${time}</td>
        <td><strong>${escapeHtml(d.name)}</strong></td>
        <td>${d.pax}</td>
        <td>RM${(d.pax * PRICE_PER_PAX).toLocaleString()}</td>
        <td>${escapeHtml(d.ref || '-')}</td>
        <td><span class="status-verified">✅ Verified</span></td>
        <td><button class="btn-delete-donor" onclick="deleteDonor(${d.id})" title="Padam">✕</button></td>
      </tr>
    `;
    }).join('');
}

function renderLiveBadge() {
    const badge = document.getElementById('liveBadge');
    if (badge) {
        badge.classList.toggle('active', state.isLive);
    }
}

// ==================== ADMIN ACTIONS ====================
function selectPackage(pax) {
    const paxInput = document.getElementById('donorPax');
    if (paxInput) {
        paxInput.value = pax;
        paxInput.focus();
        // Highlight the selected package card
        document.querySelectorAll('.pkg-card').forEach(c => c.style.outline = 'none');
        const card = document.querySelector(`.pkg-card[data-pax="${pax}"]`);
        if (card) {
            card.style.outline = '2px solid var(--accent-green)';
            card.style.outlineOffset = '2px';
        }
        // Focus name input
        document.getElementById('donorName')?.focus();
    }
}

function addDonor() {
    const nameEl = document.getElementById('donorName');
    const paxEl = document.getElementById('donorPax');
    const refEl = document.getElementById('donorRef');

    const name = nameEl?.value.trim();
    const pax = parseInt(paxEl?.value);
    const ref = refEl?.value.trim();

    if (!name) {
        showToast('⚠️ Sila masukkan nama penyumbang', 'info');
        nameEl?.focus();
        return;
    }

    if (name.length > 100) {
        showToast('⚠️ Nama terlalu panjang (max 100 aksara)', 'info');
        nameEl?.focus();
        return;
    }

    if (!pax || pax < 1) {
        showToast('⚠️ Sila masukkan jumlah pax', 'info');
        paxEl?.focus();
        return;
    }

    if (pax > 10000) {
        showToast('⚠️ Jumlah pax terlalu besar (max 10,000)', 'info');
        paxEl?.focus();
        return;
    }

    const donor = {
        id: Date.now(),
        name,
        pax,
        ref: ref || '',
        time: new Date().toISOString(),
        verified: true
    };

    state.donors.push(donor);
    recalculateCurrentPax();
    saveState();
    renderAll();

    // Feedback
    showToast(`✅ ${name} — ${pax} pax (RM${(pax * PRICE_PER_PAX).toLocaleString()}) VERIFIED!`, 'success');

    // Sound notification
    playDonationSound(pax);

    // Celebration for big donations
    if (pax >= 20) triggerConfetti();

    // Milestone check
    checkMilestone();

    // Clear inputs
    nameEl.value = '';
    paxEl.value = '';
    refEl.value = '';
    nameEl.focus();

    // Reset package card highlights
    document.querySelectorAll('.pkg-card').forEach(c => c.style.outline = 'none');
}

function updateTarget() {
    const targetEl = document.getElementById('targetInput');
    const startEl = document.getElementById('startPax');

    const newTarget = parseInt(targetEl?.value);
    const newStart = parseInt(startEl?.value);

    if (newTarget && newTarget > 0) {
        state.target = newTarget;
    }

    if (newStart !== undefined && !isNaN(newStart) && newStart >= 0) {
        state.startPax = newStart;
    }

    recalculateCurrentPax();

    saveState();
    renderAll();
    showToast(`🎯 Target: ${state.target} pax | Semasa: ${state.currentPax} pax (RM${(state.currentPax * PRICE_PER_PAX).toLocaleString()})`, 'info');

    targetEl.value = '';
    startEl.value = '';
}

function updateSessionMeta() {
    const distEl = document.getElementById('distributionInput');
    const locationEl = document.getElementById('locationInput');

    const distRaw = distEl?.value;
    const locationRaw = locationEl?.value.trim();

    if (distRaw) {
        const parsed = new Date(distRaw);
        if (!Number.isNaN(parsed.getTime())) {
            state.distributionAt = parsed.toISOString();
        }
    }

    if (locationRaw) {
        state.location = locationRaw;
    }

    saveState();
    renderSessionMeta();
    startCountdown();
    showToast('🗓️ Maklumat sesi agihan berjaya dikemaskini.', 'success');
}

function toggleLive() {
    state.isLive = !state.isLive;
    saveState();
    renderLiveBadge();
    showToast(state.isLive ? '🔴 LIVE MODE AKTIF' : '⚪ LIVE MODE DIMATIKAN', state.isLive ? 'success' : 'info');
}

function resetAll() {
    if (!confirm('⚠️ AMARAN: Ini akan padam SEMUA data termasuk senarai penyumbang. Teruskan?')) return;
    if (!confirm('🔒 PENGESAHAN KEDUA: Betul nak reset? Data tidak boleh dipulihkan.')) return;

    state = createDefaultState();
    saveState();
    renderAll();
    startCountdown();
    showToast('🗑️ Semua data telah direset.', 'info');
}

function exportCSV() {
    if (state.donors.length === 0) {
        showToast('📋 Tiada data untuk diexport.', 'info');
        return;
    }

    const header = 'No,Tarikh Masa (MYT),Timestamp ISO,Nama,Pax,RM,Ref Transaksi,Status\n';
    const escapeCSV = (str) => {
        if (!str) return '""';
        let escaped = String(str).replace(/"/g, '""');
        // Prevent CSV injection by escaping leading +, -, =, @ with a single quote
        if (/^[+\-=@]/.test(escaped)) {
            escaped = "'" + escaped;
        }
        return `"${escaped}"`;
    };

    const rows = state.donors.map((d, i) => {
        const date = new Date(d.time);
        const displayDate = date.toLocaleString('ms-MY', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        return `${i + 1},${escapeCSV(displayDate)},${escapeCSV(date.toISOString())},${escapeCSV(d.name)},${d.pax},${d.pax * PRICE_PER_PAX},${escapeCSV(d.ref || '-')},Verified`;
    }).join('\n');

    const distributionDate = new Date(state.distributionAt);
    const summary = `\n\nRINGKASAN\nKempen,${escapeCSV(state.campaignName)}\nLokasi Agihan,${escapeCSV(state.location)}\nTarikh Agihan (MYT),${escapeCSV(distributionDate.toLocaleString('ms-MY'))}\nJumlah Penyumbang,${state.donors.length}\nJumlah Pax,${state.currentPax}\nJumlah RM,${state.currentPax * PRICE_PER_PAX}\nTarget,${state.target}\nBaki,${Math.max(state.target - state.currentPax, 0)}\nMula Pax,${state.startPax}\nDijana Pada ISO,${escapeCSV(new Date().toISOString())}`;

    const csv = header + rows + summary;
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const distDate = Number.isNaN(distributionDate.getTime()) ? new Date() : distributionDate;
    const fileDate = distDate.toISOString().split('T')[0];
    a.download = `bubur-lambuk-kutipan-${fileDate}-${state.target}pax.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 CSV berjaya dimuat turun!', 'success');
}

// ==================== COUNTDOWN ====================
function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    function update() {
        const targetDate = new Date(state.distributionAt);
        if (Number.isNaN(targetDate.getTime())) {
            state.distributionAt = getDefaultDistributionAt().toISOString();
            saveState();
            renderSessionMeta();
            return;
        }

        const now = new Date();
        const diff = Math.max(targetDate - now, 0);

        if (diff === 0) {
            document.getElementById('cdHours').textContent = '00';
            document.getElementById('cdMinutes').textContent = '00';
            document.getElementById('cdSeconds').textContent = '00';
            const cdDays = document.getElementById('cdDays');
            if (cdDays) cdDays.textContent = '0';
            return;
        }

        const totalHours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const cdDays = document.getElementById('cdDays');
        const cdDaysWrap = document.getElementById('cdDaysWrapper');
        const cdDaysSep = document.getElementById('cdDaysSep');
        if (days > 0 && cdDays && cdDaysWrap) {
            cdDaysWrap.style.display = 'flex';
            if (cdDaysSep) cdDaysSep.style.display = '';
            cdDays.textContent = days;
        } else if (cdDaysWrap) {
            cdDaysWrap.style.display = 'none';
            if (cdDaysSep) cdDaysSep.style.display = 'none';
        }

        document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    countdownInterval = setInterval(update, 1000);
}

// ==================== MILESTONES ====================
function checkMilestone() {
    const pax = state.currentPax;
    const prevPax = pax - (state.donors[state.donors.length - 1]?.pax || 0);
    const firstMilestone = Math.max(100, Math.ceil((state.startPax + 1) / 100) * 100);

    // Dynamically calculate the highest 100-pax milestone crossed
    const crossedMilestone = Math.floor(pax / 100) * 100;

    // Check if we crossed a new 100-pax boundary from the current session baseline
    if (crossedMilestone >= firstMilestone && prevPax < crossedMilestone && pax >= crossedMilestone) {
        const m = crossedMilestone;
        const isTarget = m === state.target;
        const msg = isTarget
            ? `🏆 ALHAMDULILLAH! TARGET ${m} PAX TERCAPAI! ALLAHU AKBAR!`
            : `🎉 ALHAMDULILLAH! ${m} PAX TERCAPAI!`;
        showToast(msg, 'success');
        triggerConfetti();
        if (isTarget) triggerConfetti(); // double confetti for target!
    } else if (pax >= state.target && prevPax < state.target) {
        // Also trigger if we exactly hit or cross target without hitting a clean 100 milestone
        showToast(`🏆 ALHAMDULILLAH! TARGET ${state.target} PAX TERCAPAI! ALLAHU AKBAR!`, 'success');
        triggerConfetti();
        triggerConfetti(); // double confetti for target
    }
}

// ==================== BOOST TO 2000 ====================
function boostTo2000() {
    if (state.target >= 2000) {
        showToast('🎯 Target sudah 2000 pax atau lebih tinggi.', 'info');
        return;
    }
    state.target = 2000;
    saveState();
    renderAll();
    showToast('🔥 TARGET DINAIKKAN KE 2000 PAX! ALLAHU AKBAR!', 'success');
    triggerConfetti();
}

// ==================== SOUND ====================
function playDonationSound(pax) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime;
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (pax >= 50) {
            // Big donor sound — ascending chord
            osc.frequency.value = 523; // C5
            gain.gain.value = 0.15;
            osc.start();
            osc.frequency.linearRampToValueAtTime(784, now + 0.2); // G5
            osc.frequency.linearRampToValueAtTime(1047, now + 0.4); // C6
            gain.gain.linearRampToValueAtTime(0, now + 0.6);
            osc.stop(now + 0.6);
        } else if (pax >= 10) {
            // Medium donor — double beep
            osc.frequency.value = 660;
            gain.gain.value = 0.12;
            osc.start();
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.stop(now + 0.3);
        } else {
            // Small donor — gentle ping
            osc.frequency.value = 880;
            gain.gain.value = 0.08;
            osc.start();
            gain.gain.linearRampToValueAtTime(0, now + 0.15);
            osc.stop(now + 0.15);
        }
    } catch (e) {
        // Audio not supported, skip silently
    }
}

// ==================== ANIMATIONS ====================
function animateNumber(elementId, targetValue) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const current = parseInt(el.textContent.replace(/,/g, '')) || 0;
    if (current === targetValue) return;

    const duration = 800;
    const startTime = performance.now();

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const value = Math.round(current + (targetValue - current) * eased);
        el.textContent = value.toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

// ==================== PARTICLES ====================
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const colors = ['#f59e0b33', '#10b98133', '#8b5cf633', '#f59e0b22'];

    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ==================== CONFETTI ====================
function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#3b82f6', '#ec4899'];

    for (let i = 0; i < 120; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * 200,
            w: Math.random() * 10 + 4,
            h: Math.random() * 6 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 4 + 2,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            opacity: 1
        });
    }

    let frame = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        for (const p of pieces) {
            if (p.opacity <= 0) continue;
            alive = true;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08;
            p.rotation += p.rotSpeed;

            if (frame > 60) p.opacity -= 0.015;
        }

        frame++;
        if (alive && frame < 200) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

// ==================== TOAST ====================
function showToast(message, type = 'info', undoCallback = null) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const msgSpan = document.createElement('span');
    msgSpan.textContent = message;
    toast.appendChild(msgSpan);

    if (undoCallback) {
        const undoBtn = document.createElement('button');
        undoBtn.className = 'toast-undo-btn';
        undoBtn.textContent = '↩️ UNDO';
        undoBtn.onclick = () => {
            undoCallback();
            toast.remove();
        };
        toast.appendChild(undoBtn);
    }

    container.appendChild(toast);

    const duration = undoCallback ? 8000 : 4000;
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==================== KEYBOARD SHORTCUTS ====================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter to add donor
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            addDonor();
        }
        // Ctrl+L to toggle live
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            toggleLive();
        }
        // Ctrl+E to export
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            exportCSV();
        }
    });
}

// ==================== QUICK ADD (Mobile) ====================
function quickAddDonor(pax) {
    const nameEl = document.getElementById('donorName');
    const name = nameEl?.value.trim();

    if (!name) {
        showToast('⚠️ Taip nama dulu, lepas tu tap pax!', 'info');
        nameEl?.focus();
        return;
    }

    if (name.length > 100) {
        showToast('⚠️ Nama terlalu panjang (max 100 aksara)', 'info');
        return;
    }

    const donor = {
        id: Date.now(),
        name: name,
        pax: pax,
        ref: '',
        time: new Date().toISOString(),
        verified: true
    };

    state.donors.push(donor);
    recalculateCurrentPax();
    saveState();
    renderAll();

    playDonationSound(pax);
    checkMilestone();

    if (pax >= 20) triggerConfetti();

    showToast(`✅ ${name} — ${pax} pax (RM${pax * PRICE_PER_PAX})`, 'success');

    nameEl.value = '';
    nameEl.focus();
}

// ==================== DELETE & UNDO ====================
function deleteDonor(id) {
    const donor = state.donors.find(d => d.id === id);
    if (!donor) return;
    if (!confirm(`Padam ${donor.name} (${donor.pax} pax)?`)) return;

    state.donors = state.donors.filter(d => d.id !== id);
    recalculateCurrentPax();
    saveState();
    renderAll();

    lastDeletedDonor = donor;
    showToast(`🗑️ ${donor.name} (${donor.pax} pax) dipadamkan`, 'info', () => {
        restoreDonor(donor);
    });
}

function restoreDonor(donor) {
    if (!donor) return;
    state.donors.push(donor);
    state.donors.sort((a, b) => a.id - b.id);
    recalculateCurrentPax();
    saveState();
    renderAll();
    showToast(`✅ ${donor.name} (${donor.pax} pax) dipulihkan`, 'success');
    lastDeletedDonor = null;
}

// ==================== STORAGE WARNING ====================
function checkStorageWarning() {
    if (state.donors.length > 3000) {
        const warning = document.getElementById('storageWarning');
        if (warning) warning.style.display = 'block';
    }
}

// ==================== UTILS ====================
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
