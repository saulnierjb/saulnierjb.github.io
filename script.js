// ============================
// Email Obfuscation (click-to-reveal)
// ============================
document.addEventListener('DOMContentLoaded', function () {
    const e = 'c2F1bG5pZXJqZWFuYmFwdGlzdGVAZ21haWwuY29t';
    function decode() { return atob(e); }

    // Hero button — opens mailto
    document.querySelectorAll('[data-email]').forEach(function (el) {
        el.addEventListener('click', function handler(ev) {
            ev.preventDefault();
            var addr = decode();
            el.href = 'mailto:' + addr;
            el.removeEventListener('click', handler);
            window.location.href = 'mailto:' + addr;
        });
    });

    // Contact button — reveal + copy to clipboard
    document.querySelectorAll('[data-email-copy]').forEach(function (el) {
        var revealed = false;
        el.addEventListener('click', function (ev) {
            ev.preventDefault();
            var addr = decode();
            if (!revealed) {
                el.textContent = addr;
                revealed = true;
            }
            navigator.clipboard.writeText(addr).then(function () {
                var tip = document.createElement('span');
                tip.className = 'copy-tooltip';
                tip.textContent = 'Email copied!';
                el.style.position = 'relative';
                el.appendChild(tip);
                setTimeout(function () { tip.remove(); }, 1500);
            });
        });
    });
});

// ============================
// Scroll Animations (IntersectionObserver)
// ============================
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// ============================
// Dark Mode Toggle
// ============================
const toggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check saved preference or system preference
const saved = localStorage.getItem('theme');
if (saved) {
    html.setAttribute('data-theme', saved);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
}

toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    drawCanvas(); // redraw with new colors
});

// ============================
// Background Canvas — Floating Rod-Shaped Bacteria
// ============================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let bacteria = [];
const BACTERIA_COUNT = 28;

function generateBacteria() {
    bacteria = [];
    for (let i = 0; i < BACTERIA_COUNT; i++) {
        const length = 18 + Math.random() * 24;
        const isDividing = Math.random() < 0.2;
        bacteria.push({
            x: Math.random(),
            y: Math.random(),
            angle: Math.random() * Math.PI * 2,
            length: length,
            width: 5 + Math.random() * 3,
            // Slow drift + gentle rotation
            vx: (Math.random() - 0.5) * 0.00002,
            vy: (Math.random() - 0.5) * 0.00002,
            vAngle: (Math.random() - 0.5) * 0.0002,
            isDividing: isDividing,
            divisionProgress: isDividing ? 0.3 + Math.random() * 0.5 : 0,
            opacity: 0.4 + Math.random() * 0.5,
        });
    }
}

function drawBacterium(x, y, angle, length, width, isDividing, divisionProgress, opacity, fillColor, strokeColor) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha = opacity;

    const r = width / 2;
    const halfLen = length / 2;

    // Main rod body with rounded caps
    ctx.beginPath();
    ctx.moveTo(-halfLen + r, -r);
    ctx.lineTo(halfLen - r, -r);
    ctx.arc(halfLen - r, 0, r, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(-halfLen + r, r);
    ctx.arc(-halfLen + r, 0, r, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Division septum (pinch in the middle)
    if (isDividing) {
        const pinch = divisionProgress * r * 0.7;
        ctx.beginPath();
        ctx.moveTo(0, -r + pinch);
        ctx.lineTo(0, r - pinch);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Slight pinch shape on the outline
        ctx.beginPath();
        ctx.ellipse(0, -r, 1.5, pinch, 0, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0, r, 1.5, pinch, 0, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
}

function drawCanvas() {
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    ctx.clearRect(0, 0, w, h);

    const style = getComputedStyle(document.documentElement);
    const fillColor = style.getPropertyValue('--color-canvas-dot').trim();
    const strokeColor = style.getPropertyValue('--color-canvas-line').trim();

    bacteria.forEach((b) => {
        drawBacterium(
            b.x * w,
            b.y * h,
            b.angle,
            b.length,
            b.width,
            b.isDividing,
            b.divisionProgress,
            b.opacity,
            fillColor,
            strokeColor
        );
    });
}

function animate() {
    bacteria.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.angle += b.vAngle;
        // Wrap around edges
        if (b.x < -0.05) b.x = 1.05;
        if (b.x > 1.05) b.x = -0.05;
        if (b.y < -0.05) b.y = 1.05;
        if (b.y > 1.05) b.y = -0.05;
    });
    drawCanvas();
    requestAnimationFrame(animate);
}

generateBacteria();
animate();

window.addEventListener('resize', drawCanvas);
