export class VisualEffectsEngine {
    constructor() {
        this.canvas = document.getElementById('effects-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.effects = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addDatapointEffect(datapoint, position) {
        const effect = {
            id: datapoint.id,
            type: datapoint.type,
            value: datapoint.value,
            position: position,
            intensity: Math.min(datapoint.value / 100, 2),
            age: 0,
            maxAge: 5000 + (datapoint.value * 10)
        };

        this.effects.push(effect);
    }

    renderEffect(effect) {
        const { ctx } = this;
        const progress = effect.age / effect.maxAge;
        const alpha = Math.sin(progress * Math.PI);

        ctx.save();
        ctx.globalAlpha = alpha * 0.7;
        ctx.translate(effect.position.x, effect.position.y);

        switch (effect.type) {
            case 'energy':
                this.renderEnergyEffect(effect, progress);
                break;
            case 'wisdom':
                this.renderWisdomEffect(effect, progress);
                break;
            case 'chaos':
                this.renderChaosEffect(effect, progress);
                break;
            case 'harmony':
                this.renderHarmonyEffect(effect, progress);
                break;
            default:
                this.renderGenericEffect(effect, progress);
        }

        ctx.restore();
    }

    renderEnergyEffect(effect, progress) {
        const { ctx } = this;
        const radius = 20 + (effect.intensity * 30 * (1 - progress));
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        gradient.addColorStop(0, `rgba(255, 215, 0, ${0.8 * (1 - progress)})`);
        gradient.addColorStop(0.5, `rgba(255, 140, 0, ${0.4 * (1 - progress)})`);
        gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Lightning effect
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + (effect.age * 0.01);
            const x = Math.cos(angle) * radius * 0.7;
            const y = Math.sin(angle) * radius * 0.7;
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 * (1 - progress)})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    renderWisdomEffect(effect, progress) {
        const { ctx } = this;
        const size = 15 + (effect.intensity * 20);
        
        ctx.strokeStyle = `rgba(138, 43, 226, ${0.8 * (1 - progress)})`;
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = effect.age * 0.1;
        
        for (let i = 0; i < 3; i++) {
            const radius = size * (1 + i * 0.3);
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
    }

    renderChaosEffect(effect, progress) {
        const { ctx } = this;
        ctx.strokeStyle = `rgba(255, 0, 110, ${0.9 * (1 - progress)})`;
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const chaos = Math.sin(effect.age * 0.02 + i) * 10;
            const radius = 20 + chaos + (effect.intensity * 15);
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    renderHarmonyEffect(effect, progress) {
        const { ctx } = this;
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
        gradient.addColorStop(0, `rgba(0, 212, 255, ${0.6 * (1 - progress)})`);
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 40 + (effect.intensity * 20), 0, Math.PI * 2);
        ctx.fill();
        
        // Harmonic waves
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * (1 - progress)})`;
        ctx.lineWidth = 1;
        
        for (let r = 10; r < 50; r += 10) {
            ctx.beginPath();
            for (let a = 0; a < Math.PI * 2; a += 0.1) {
                const wave = Math.sin(a * 4 + effect.age * 0.01) * 3;
                const x = Math.cos(a) * (r + wave);
                const y = Math.sin(a) * (r + wave);
                
                if (a === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    renderGenericEffect(effect, progress) {
        const { ctx } = this;
        const size = 25 + (effect.intensity * 35);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.5 * (1 - progress)})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.effects = this.effects.filter(effect => {
            effect.age += 16; // Assuming 60fps
            this.renderEffect(effect);
            return effect.age < effect.maxAge;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize effects engine
window.visualEffects = new VisualEffectsEngine();

