/* ========================================
   Proto-Politics - Interactive Website
   JavaScript Interactivity
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavigation();
    initProgressBar();
    initScrollAnimations();
    initPersonaSwitcher();
    initStoryCards();
    initMoralSlider();
    initThreatDashboard();
});

/* --- Particle Background --- */
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() > 0.5 ? 190 : 270; // cyan or purple
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width ||
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Scale particle count by screen size
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawLines();
        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Pause when not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* --- Navigation --- */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // Scroll state
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        navbar.classList.toggle('scrolled', currentScroll > 50);
        lastScroll = currentScroll;
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });

    // Active link tracking
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                links.forEach(link => {
                    link.classList.toggle('active',
                        link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* --- Progress Bar --- */
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
}

/* --- Persona Switcher --- */
function initPersonaSwitcher() {
    const tabs = document.querySelectorAll('.persona-tab');
    const panels = document.querySelectorAll('.persona-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const persona = tab.dataset.persona;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `persona-${persona}`) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

/* --- Story Cards (Flip) --- */
function initStoryCards() {
    const cards = document.querySelectorAll('.story-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}

/* --- Moral Slider --- */
function initMoralSlider() {
    const slider = document.getElementById('moralSlider');
    const scenario = document.getElementById('spectrumScenario');

    if (!slider || !scenario) return;

    const scenarios = [
        { min: 0, max: 15, text: 'Always follow the rules. Never question authority. Digital citizenship pledges signed without thought.', color: 'var(--accent-success)' },
        { min: 16, max: 30, text: 'Mostly rule-following with small bends — sharing homework answers, using creative interpretations of guidelines.', color: 'var(--accent-success)' },
        { min: 31, max: 45, text: 'Strategic flexibility — Liam\'s GuildWeaver builds real trust while gathering intelligence. Is that manipulation or leadership?', color: 'var(--accent-warning)' },
        { min: 46, max: 55, text: 'The gray zone where most gaming moments live — and where real learning happens. Empathy meets strategy.', color: 'var(--accent-warning)' },
        { min: 56, max: 70, text: 'Jackson\'s hesitant sabotages in Among Us. The thrill of the play versus the "Was that fair, bro?" moment.', color: 'var(--accent-warning)' },
        { min: 71, max: 85, text: 'ShadowStriker trolls for laughs, targeting weaker players. Power without accountability — but guilt creeps in.', color: 'var(--accent-danger)' },
        { min: 86, max: 100, text: 'Full rule-breaking: exploits, scams, betrayals. Schools say "never do this" but games show why people do — and the consequences.', color: 'var(--accent-danger)' }
    ];

    function updateScenario() {
        const val = parseInt(slider.value);
        const match = scenarios.find(s => val >= s.min && val <= s.max);
        if (match) {
            scenario.innerHTML = `<p style="color: ${match.color}">${match.text}</p>`;
        }
    }

    slider.addEventListener('input', updateScenario);
    updateScenario();
}

/* --- Threat Dashboard --- */
function initThreatDashboard() {
    const threats = document.querySelectorAll('.threat-item');

    threats.forEach(item => {
        item.addEventListener('click', () => {
            // Toggle expanded state
            const isActive = item.classList.contains('threat-active');
            threats.forEach(t => t.classList.remove('threat-active'));
            if (!isActive) {
                item.classList.add('threat-active');
                item.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 300);
            }
        });
    });
}
