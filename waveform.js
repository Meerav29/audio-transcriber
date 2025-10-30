// Brutalist Interactive Waveform Animation
const canvas = document.getElementById('waveformCanvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
let mouseX = width / 2;
let mouseY = height / 2;
let targetMouseX = mouseX;
let targetMouseY = mouseY;

// Waveform configuration - more geometric and minimal
const waveCount = 3;
const waves = [];

// Initialize canvas size
function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

// Brutalist Wave class - more geometric
class Wave {
    constructor(index) {
        this.index = index;
        this.amplitude = 40 + index * 20;
        this.frequency = 0.008 + index * 0.003;
        this.speed = 0.015 + index * 0.008;
        this.offset = (index * Math.PI * 2) / waveCount;
        this.phase = 0;
        this.points = [];
        this.opacity = 0.08 - index * 0.02;
        this.lineWidth = 2;
        this.initPoints();
    }

    initPoints() {
        this.points = [];
        const resolution = Math.max(2, Math.floor(width / 12));
        for (let i = 0; i <= resolution; i++) {
            this.points.push({
                x: (width / resolution) * i,
                baseY: height / 2,
                currentY: height / 2
            });
        }
    }

    update(time, mouseInfluence) {
        this.phase = time * this.speed + this.offset;

        this.points.forEach((point, i) => {
            // Distance from mouse
            const dx = point.x - mouseX;
            const dy = point.baseY - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 400;

            // Mouse influence decreases with distance
            const influence = Math.max(0, 1 - distance / maxDistance);
            const mouseEffect = influence * mouseInfluence * 120;

            // Base wave calculation - more angular
            const baseWave = Math.sin(point.x * this.frequency + this.phase) * this.amplitude;

            // Combine base wave with mouse effect
            const targetY = point.baseY + baseWave + mouseEffect * (mouseY < height / 2 ? -1 : 1);

            // Smooth transition
            point.currentY += (targetY - point.currentY) * 0.08;
        });
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].currentY);

        // Draw sharp, angular lines (more brutalist)
        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            ctx.lineTo(point.x, point.currentY);
        }

        // Style - stark black lines
        ctx.strokeStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();

        // Optional: subtle fill
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity * 0.15})`;
        ctx.fill();
    }
}

// Initialize waves
function initWaves() {
    waves.length = 0;
    for (let i = 0; i < waveCount; i++) {
        waves.push(new Wave(i));
    }
}

// Mouse tracking with smooth interpolation
document.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
});

// Animation loop
function animate() {
    // Smooth mouse movement
    mouseX += (targetMouseX - mouseX) * 0.1;
    mouseY += (targetMouseY - mouseY) * 0.1;

    // Calculate mouse influence (how much the mouse affects the waves)
    const centerX = width / 2;
    const centerY = height / 2;
    const distanceFromCenter = Math.sqrt(
        Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    );
    const maxDistance = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
    const mouseInfluence = 1 - Math.min(distanceFromCenter / maxDistance, 1);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw waves
    const time = Date.now() * 0.001;
    waves.forEach(wave => {
        wave.update(time, mouseInfluence);
        wave.draw();
    });

    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
    resizeCanvas();
    initWaves();
});

// Initialize
resizeCanvas();
initWaves();
animate();
