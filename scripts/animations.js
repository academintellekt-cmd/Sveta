// Анимации мандалы и визуальные эффекты

let mandalaAnimationId = null;
let mandalaRotation = 0;

// Запуск анимации мандалы
function startMandalaAnimation() {
    const canvas = document.getElementById('mandalaCanvas');
    const ctx = canvas.getContext('2d');
    
    // Установка размеров
    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    
    mandalaRotation = 0;
    
    function animate() {
        // Очистка canvas
        ctx.clearRect(0, 0, size, size);
        
        // Полупрозрачный фон для эффекта следа
        ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
        ctx.fillRect(0, 0, size, size);
        
        // Увеличиваем вращение
        mandalaRotation += 0.01;
        
        // Рисуем мандалу
        drawMandala(ctx, centerX, centerY, mandalaRotation);
        
        // Продолжаем анимацию
        mandalaAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
}

// Остановка анимации
function stopMandalaAnimation() {
    if (mandalaAnimationId) {
        cancelAnimationFrame(mandalaAnimationId);
        mandalaAnimationId = null;
    }
}

// Рисование мандалы
function drawMandala(ctx, centerX, centerY, rotation) {
    const layers = 6;
    const maxRadius = 180;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Центральный круг
    drawGlowingCircle(ctx, 0, 0, 20, 'rgba(168, 85, 247, 0.8)');
    
    // Слои мандалы
    for (let layer = 1; layer <= layers; layer++) {
        const radius = (maxRadius / layers) * layer;
        const petals = 6 + layer * 2;
        const layerRotation = rotation * (layer % 2 === 0 ? 1 : -1);
        
        ctx.save();
        ctx.rotate(layerRotation);
        
        // Основной круг слоя
        drawCircle(ctx, 0, 0, radius, `rgba(168, 85, 247, ${0.1 / layer})`);
        
        // Лепестки/узоры
        for (let i = 0; i < petals; i++) {
            const angle = (Math.PI * 2 / petals) * i;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // Маленькие круги
            const color = layer % 2 === 0 ? 
                `rgba(59, 130, 246, ${0.5 / layer})` : 
                `rgba(236, 72, 153, ${0.5 / layer})`;
            drawGlowingCircle(ctx, x, y, 8 / layer, color);
            
            // Линии к центру
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 / layer})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        
        // Геометрические узоры
        if (layer % 2 === 0) {
            drawGeometricPattern(ctx, radius, petals, layerRotation);
        }
        
        ctx.restore();
    }
    
    // Вращающиеся символы
    drawRotatingSymbols(ctx, rotation);
    
    ctx.restore();
}

// Круг с свечением
function drawGlowingCircle(ctx, x, y, radius, color) {
    ctx.save();
    
    // Внешнее свечение
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Основной круг
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Обычный круг
function drawCircle(ctx, x, y, radius, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
}

// Геометрический узор
function drawGeometricPattern(ctx, radius, sides, rotation) {
    ctx.save();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
    ctx.lineWidth = 1.5;
    
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
        const angle = (Math.PI * 2 / sides) * i;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
}

// Вращающиеся символы
function drawRotatingSymbols(ctx, rotation) {
    const symbols = ['✨', '🌟', '💫', '⭐'];
    const symbolRadius = 150;
    
    ctx.save();
    ctx.font = '24px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    symbols.forEach((symbol, index) => {
        const angle = (Math.PI * 2 / symbols.length) * index + rotation * 2;
        const x = Math.cos(angle) * symbolRadius;
        const y = Math.sin(angle) * symbolRadius;
        
        // Свечение текста
        ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
        ctx.shadowBlur = 20;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillText(symbol, x, y);
    });
    
    ctx.restore();
}

// Эффект частиц (опционально)
function createParticleEffect(canvas) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            opacity: Math.random()
        });
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Добавляем градиент в SVG для кольца совместимости
document.addEventListener('DOMContentLoaded', () => {
    const ring = document.getElementById('compatRing');
    if (ring) {
        const svg = ring.closest('svg');
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'compatGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#a855f7');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('stop-color', '#ec4899');
        
        const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop3.setAttribute('offset', '100%');
        stop3.setAttribute('stop-color', '#06b6d4');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }
});

