/* ==========================================================================
   DREAMY KAWAII CANVAS AMBIENCE (Bubbles, Lilies, Stars & Dewdrops)
   Interactive background physics inspired by Reference Images 1 & 2
   ========================================================================== */

(function () {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Resize Listener
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mouse tracking for soft bubble repulsion
  const mouse = { x: -1000, y: -1000, radius: 100 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Particle Generators
  const particles = [];
  const maxParticles = window.innerWidth < 768 ? 35 : 70;

  class DreamyParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.type = Math.random() < 0.45 ? 'bubble' : (Math.random() < 0.75 ? 'star' : 'petal');
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 30;

      if (this.type === 'bubble') {
        this.size = Math.random() * 18 + 8;
        this.vy = -(Math.random() * 0.7 + 0.3);
        this.vx = (Math.random() - 0.5) * 0.5;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
        this.alpha = Math.random() * 0.4 + 0.3;
      } else if (this.type === 'star') {
        this.size = Math.random() * 10 + 6;
        this.vy = -(Math.random() * 0.4 + 0.2);
        this.vx = (Math.random() - 0.5) * 0.3;
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.05 + 0.02;
        this.color = Math.random() < 0.6 ? '#ffd166' : (Math.random() < 0.85 ? '#ffb7cf' : '#ffffff');
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
      } else {
        // Petal drifting
        this.size = Math.random() * 14 + 10;
        this.y = initial ? Math.random() * height : -20;
        this.vy = Math.random() * 0.8 + 0.4;
        this.vx = Math.sin(Math.random() * 10) * 0.6;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
        this.alpha = Math.random() * 0.5 + 0.35;
      }
    }

    update() {
      // Repulsion from mouse
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius && dist > 0) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x += (dx / dist) * force * 3;
        this.y += (dy / dist) * force * 3;
      }

      if (this.type === 'bubble') {
        this.wobble += this.wobbleSpeed;
        this.x += this.vx + Math.sin(this.wobble) * 0.5;
        this.y += this.vy;
        if (this.y < -40 || this.x < -40 || this.x > width + 40) {
          this.reset();
        }
      } else if (this.type === 'star') {
        this.twinkle += this.twinkleSpeed;
        this.rotation += this.rotSpeed;
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < -30 || this.x < -30 || this.x > width + 30) {
          this.reset();
        }
      } else {
        // Petal
        this.rotation += this.rotSpeed;
        this.x += this.vx + Math.sin(this.y * 0.02) * 0.8;
        this.y += this.vy;
        if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
          this.reset();
        }
      }
    }

    draw() {
      ctx.save();
      if (this.type === 'bubble') {
        ctx.globalAlpha = this.alpha;

        // Iridescent Glass Bubble
        const grad = ctx.createRadialGradient(
          this.x - this.size * 0.3,
          this.y - this.size * 0.3,
          this.size * 0.1,
          this.x,
          this.y,
          this.size
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.3, 'rgba(255, 214, 232, 0.45)');
        grad.addColorStop(0.7, 'rgba(228, 215, 252, 0.25)');
        grad.addColorStop(1, 'rgba(255, 183, 207, 0.55)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Highlight glint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.ellipse(
          this.x - this.size * 0.35,
          this.y - this.size * 0.35,
          this.size * 0.25,
          this.size * 0.14,
          Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (this.type === 'star') {
        const currentAlpha = 0.4 + Math.sin(this.twinkle) * 0.45;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // 4-pointed magical twinkle star
        ctx.beginPath();
        const r = this.size;
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * Math.PI) / 2) * r, Math.sin((i * Math.PI) / 2) * r);
          ctx.lineTo(
            Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.3),
            Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (r * 0.3)
          );
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Petal
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const grad = ctx.createLinearGradient(-this.size / 2, 0, this.size / 2, 0);
        grad.addColorStop(0, '#ffe5ec');
        grad.addColorStop(0.6, '#ffb7cf');
        grad.addColorStop(1, '#f4729f');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.7, -this.size * 0.3, 0, this.size);
        ctx.quadraticCurveTo(-this.size * 0.7, -this.size * 0.3, 0, -this.size);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new DreamyParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
})();
