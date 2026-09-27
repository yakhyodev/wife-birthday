/* ==========================================================
   HAPPY 19, MUSHTARIYIM! 
   CINEMATIC JAVASCRIPT & AUDIO-VISUAL ENGINE
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ----------------------------------------------------------
     1. COSMIC & ROMANTIC CANVAS ENGINE (STARS, METEORS, PETALS)
     ---------------------------------------------------------- */
  const canvas = document.getElementById('cosmic-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  });

  // Layer A: Twinkling Starfield
  const stars = [];
  const STAR_COUNT = Math.min(Math.floor((width * height) / 6000), 220);

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.8 + 0.5;
      this.alpha = Math.random() * 0.8 + 0.2;
      this.twinkleSpeed = (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1);
      // Colors: white, soft gold, warm pink
      const colors = ['255, 255, 255', '254, 240, 138', '248, 180, 196', '251, 194, 235'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.alpha += this.twinkleSpeed;
      if (this.alpha > 0.95 || this.alpha < 0.15) {
        this.twinkleSpeed = -this.twinkleSpeed;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, this.alpha)})`;
      ctx.shadowBlur = this.size > 1.2 ? 6 : 0;
      ctx.shadowColor = `rgba(${this.color}, 0.8)`;
      ctx.fill();
    }
  }

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star());
    }
  }
  initStars();

  // Layer B: Shooting Stars (Meteors)
  const meteors = [];

  class Meteor {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width * 1.2;
      this.y = Math.random() * (height * 0.4);
      this.length = Math.random() * 80 + 50;
      this.speed = Math.random() * 7 + 9;
      this.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1);
      this.opacity = 1;
      this.decay = Math.random() * 0.015 + 0.01;
      this.active = false;
    }
    spawn() {
      this.reset();
      this.active = true;
    }
    update() {
      if (!this.active) return;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= this.decay;
      if (this.opacity <= 0 || this.x > width || this.y > height) {
        this.active = false;
      }
    }
    draw() {
      if (!this.active || this.opacity <= 0) return;
      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
      grad.addColorStop(0.3, `rgba(254, 240, 138, ${this.opacity * 0.7})`);
      grad.addColorStop(1, 'rgba(244, 63, 94, 0)');

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }
  }

  for (let i = 0; i < 3; i++) {
    meteors.push(new Meteor());
  }

  // Meteor spawn timer
  setInterval(() => {
    const inactive = meteors.find(m => !m.active);
    if (inactive && Math.random() > 0.3) {
      inactive.spawn();
    }
  }, 3500);

  // Layer C: Gentle Sparse Petals & Emojis Rain (Tulip 🌷, Rose 🌹, Heart 💖, Star ✨)
  const petals = [];
  let petalDensity = 24; // Subtle, elegant and sparse

  const EMOJI_PETALS = ['🌷', '🌹', '💖', '✨', '🌸'];

  class FloatingPetal {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.speedY = Math.random() * 1.2 + 0.7;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
      this.oscillation = Math.random() * 0.03 + 0.01;
      this.angle = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() * 0.02 - 0.01);
      this.opacity = Math.random() * 0.6 + 0.35;
      this.size = Math.random() * 10 + 14;
      this.type = EMOJI_PETALS[Math.floor(Math.random() * EMOJI_PETALS.length)];
      this.waveOffset = Math.random() * 100;
    }
    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.waveOffset) * 0.9;
      this.waveOffset += this.oscillation;
      this.angle += this.rotationSpeed;

      if (this.y > height + 40) {
        this.reset(false);
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity;
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.type, 0, 0);
      ctx.restore();
    }
  }

  for (let i = 0; i < petalDensity; i++) {
    petals.push(new FloatingPetal());
  }

  // Layer D: Fireworks & Confetti Burst Particles
  const fireworks = [];

  class FireworkParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.friction = 0.96;
      this.gravity = 0.12;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.color = color;
      this.size = Math.random() * 3 + 1.5;
    }
    update() {
      this.vx *= this.friction;
      this.vy = this.vy * this.friction + this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, this.alpha)})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.color}, 0.8)`;
      ctx.fill();
    }
  }

  function launchFireworks(x, y) {
    const palette = ['244, 63, 94', '254, 240, 138', '248, 180, 196', '168, 85, 247', '245, 158, 11', '255, 255, 255'];
    const chosenColor = palette[Math.floor(Math.random() * palette.length)];
    for (let i = 0; i < 60; i++) {
      fireworks.push(new FireworkParticle(x, y, chosenColor));
    }
  }

  // Touch / Mouse interactive sparkles
  window.addEventListener('pointermove', (e) => {
    if (Math.random() > 0.85) {
      const sparkleColor = Math.random() > 0.5 ? '248, 180, 196' : '254, 240, 138';
      fireworks.push(new FireworkParticle(e.clientX, e.clientY, sparkleColor));
    }
  });

  // Main Canvas Render Loop
  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    // Stars
    ctx.shadowBlur = 0;
    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
    }

    // Meteors
    for (let i = 0; i < meteors.length; i++) {
      meteors[i].update();
      meteors[i].draw();
    }

    // Petals
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }

    // Fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].draw();
      if (fireworks[i].alpha <= 0) {
        fireworks.splice(i, 1);
      }
    }

    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();


  /* ----------------------------------------------------------
     2. DREAMY ROMANTIC PROCEDURAL WEB AUDIO SYNTHESIZER
     ---------------------------------------------------------- */
  let audioCtx = null;
  let isPlaying = false;
  let synthInterval = null;

  // Chord notes for a soothing, romantic progression in Pentatonic / Maj7
  // Cmaj7 (C4, E4, G4, B4) -> Em7 (E4, G4, B4, D5) -> Am7 (A3, C4, E4, G4) -> Fmaj7 (F3, A3, C4, E4)
  const CHORDS = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [329.63, 392.00, 493.88, 587.33], // Em7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63]  // Fmaj7
  ];
  let chordIndex = 0;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPianoChime(freq, time, duration = 2.4, gainLevel = 0.08) {
    if (!audioCtx) return;

    // Dual oscillator for rich, warm analog piano sound
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.002, time); // Subtle detune for warmth

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(300, time + duration);

    // ADSR Envelope
    gainNode.gain.setValueAtTime(0.0001, time);
    gainNode.gain.exponentialRampToValueAtTime(gainLevel, time + 0.08); // Soft attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration); // Gentle decay

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  function playRomanticProgression() {
    if (!audioCtx || !isPlaying) return;

    const now = audioCtx.currentTime;
    const currentChord = CHORDS[chordIndex % CHORDS.length];
    chordIndex++;

    // Play base chord
    currentChord.forEach((noteFreq, idx) => {
      playPianoChime(noteFreq, now + idx * 0.15, 3.2, 0.05);
    });

    // Gentle celestial melody note on top
    const melodyNotes = [523.25, 659.25, 783.99, 987.77]; // C5, E5, G5, B5
    const randomMelody = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
    playPianoChime(randomMelody, now + 0.6, 2.5, 0.035);
  }

  // Dual-mode audio: Background song (Shohruhxon & Umidaxon - Xatlar)
  const bgAudioEl = document.getElementById('bg-music') || new Audio('assets/music.mp3');
  bgAudioEl.loop = true;
  bgAudioEl.volume = 0.85;
  let hasCustomMp3 = false;

  // Real-time audio hardware state sync
  bgAudioEl.addEventListener('play', () => {
    isPlaying = true;
    updateAudioUI(true);
  });

  bgAudioEl.addEventListener('pause', () => {
    isPlaying = false;
    updateAudioUI(false);
  });

  // Guarantee infinite looping when the song ends
  bgAudioEl.addEventListener('ended', () => {
    bgAudioEl.currentTime = 0;
    bgAudioEl.play().catch(() => {});
  });

  function startMusic() {
    initAudio();

    // Try playing the MP3 song first
    const playPromise = bgAudioEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          hasCustomMp3 = true;
          updateAudioUI(true);
          if (synthInterval) { clearInterval(synthInterval); synthInterval = null; }
        })
        .catch(() => {
          // Autoplay blocked by browser policy without user gesture yet
          isPlaying = false;
          updateAudioUI(false);
        });
    }
  }

  function stopMusic() {
    isPlaying = false;
    updateAudioUI(false);
    if (bgAudioEl) {
      bgAudioEl.pause();
    }
    if (synthInterval) { clearInterval(synthInterval); synthInterval = null; }
  }

  function toggleMusic() {
    if (isPlaying && !bgAudioEl.paused) {
      stopMusic();
      showToast("Kuy to'xtatildi 🌙");
    } else {
      startMusic();
      showToast("Xatlar qo'shig'i yangramoqda 🎵");
    }
  }

  function updateAudioUI(playing) {
    const wave = document.querySelector('.sound-wave');
    const statusText = document.getElementById('audio-status-text');
    if (playing) {
      wave?.classList.add('playing');
      if (statusText) statusText.textContent = "Kuy: Yangramoqda";
    } else {
      wave?.classList.remove('playing');
      if (statusText) statusText.textContent = "Kuy: Bosing 🎵";
    }
  }

  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  audioToggleBtn?.addEventListener('click', toggleMusic);

  // 1. Immediately attempt autoplay as soon as page loads
  setTimeout(() => {
    startMusic();
  }, 200);

  // 2. Browser Autoplay Policy: if browser blocked audio before user gesture,
  // the VERY FIRST touch, click, scroll or keypress will instantly trigger music!
  const gestureEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown'];
  const unlockAudio = () => {
    if (bgAudioEl.paused) {
      bgAudioEl.play().then(() => {
        isPlaying = true;
        hasCustomMp3 = true;
        updateAudioUI(true);
        gestureEvents.forEach(evt => {
          window.removeEventListener(evt, unlockAudio, { capture: true });
          document.removeEventListener(evt, unlockAudio, { capture: true });
        });
      }).catch(() => {});
    }
  };

  gestureEvents.forEach(evt => {
    window.addEventListener(evt, unlockAudio, { capture: true, passive: true });
    document.addEventListener(evt, unlockAudio, { capture: true, passive: true });
  });


  /* ----------------------------------------------------------
     3. ROCKSTAR / NATGEO GSAP SCROLL & PARALLAX ENGINE
     ---------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Top Scroll Progress Bar
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const progressEl = document.getElementById('scroll-progress');
      if (progressEl) progressEl.style.width = scrolled + '%';
    });

    // Hero Section Animations: Staggered diagonal elevation
    gsap.from('.animate-hero', {
      opacity: 0,
      y: 50,
      x: -20,
      duration: 1.3,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Chapter 1: Developer Terminal - Dynamic diagonal drift
    gsap.from('#terminal-box', {
      scrollTrigger: {
        trigger: '#code-destiny',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: -70,
      y: 50,
      rotation: -1.2,
      duration: 1.2,
      ease: 'power3.out'
    });

    // Subtle continuous horizontal pull on terminal when scrolling
    gsap.to('#terminal-box', {
      scrollTrigger: {
        trigger: '#code-destiny',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      x: 40,
      ease: 'none'
    });

    // Chapter 2: Happy 19 - Opposing horizontal and diagonal reveals
    gsap.from('.happy-text-col > *', {
      scrollTrigger: {
        trigger: '#happy-19',
        start: 'top 75%'
      },
      opacity: 0,
      x: -60,
      y: 30,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    });

    gsap.from('.glass-artwork-frame', {
      scrollTrigger: {
        trigger: '#happy-19',
        start: 'top 70%'
      },
      opacity: 0,
      x: 80,
      y: -30,
      rotation: 2,
      duration: 1.3,
      ease: 'power3.out'
    });

    // Parallax on Happy 19 Artwork on scroll
    gsap.to('.glass-artwork-frame', {
      scrollTrigger: {
        trigger: '#happy-19',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      y: -40,
      x: -25,
      ease: 'none'
    });

    // -------------------------------------------------------------
    // NATIONAL GEOGRAPHIC SIGNATURE: PINNED HORIZONTAL PANORAMA
    // Vertical scroll drives horizontal camera tracking across 300vw!
    // -------------------------------------------------------------
    // NEW VECTOR PAGE 1: MILK & MOCHA BEARS
    // Gentle horizontal drift from left to right holding hands!
    // -------------------------------------------------------------
    const milkMochaActor = document.getElementById('milk-mocha-actor');
    if (milkMochaActor) {
      gsap.fromTo(milkMochaActor,
        { x: '-55vw', y: 15, rotation: -4 },
        {
          x: '55vw',
          y: -15,
          rotation: 4,
          ease: 'none',
          scrollTrigger: {
            trigger: '#stage-milk-mocha',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );
    }

    // -------------------------------------------------------------
    // VECTOR PAGE 1: THE ANIMATED TEDDY BEAR
    // Enters from the right, walks/floats across holding heart, exits left!
    // -------------------------------------------------------------
    const teddyActor = document.getElementById('teddy-actor');
    if (teddyActor) {
      gsap.fromTo(teddyActor,
        { x: '70vw', y: 30, rotation: 6 },
        {
          x: '-70vw',
          y: -30,
          rotation: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: '#stage-teddy-bear',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );
    }

    // -------------------------------------------------------------
    // NEW VECTOR PAGE 2: KUZGI SARIQ BARGLAR — SEPTEMBER
    // Golden and amber leaves swirling diagonally down-right!
    // -------------------------------------------------------------
    const autumnStage = document.getElementById('stage-autumn-september');
    if (autumnStage) {
      gsap.to('#a-leaf-1', { x: 280, y: 320, rotation: 380, ease: 'none', scrollTrigger: { trigger: autumnStage, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.to('#a-leaf-2', { x: 340, y: 360, rotation: -320, ease: 'none', scrollTrigger: { trigger: autumnStage, start: 'top bottom', end: 'bottom top', scrub: 1.3 } });
      gsap.to('#a-leaf-3', { x: 220, y: 280, rotation: 260, ease: 'none', scrollTrigger: { trigger: autumnStage, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
      gsap.to('#a-leaf-4', { x: 300, y: 340, rotation: -290, ease: 'none', scrollTrigger: { trigger: autumnStage, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
      gsap.to('#a-leaf-5', { x: 260, y: 300, rotation: 340, ease: 'none', scrollTrigger: { trigger: autumnStage, start: 'top bottom', end: 'bottom top', scrub: 1.4 } });
      gsap.to('#a-leaf-6', { x: 240, y: 350, rotation: -280, ease: 'none', scrollTrigger: { trigger: autumnStage, start: 'top bottom', end: 'bottom top', scrub: 1.6 } });
    }

    // -------------------------------------------------------------
    // VECTOR PAGE 2: VECTOR FIREWORKS & CONSTELLATION 19
    // Fireworks bursts and sparkling stars expand on scroll!
    // -------------------------------------------------------------
    const fireworksStage = document.getElementById('stage-vector-fireworks');
    if (fireworksStage) {
      gsap.from('#burst-1', {
        scale: 0.2,
        opacity: 0,
        rotation: -45,
        scrollTrigger: {
          trigger: '#stage-vector-fireworks',
          start: 'top 75%',
          end: 'bottom center',
          scrub: 1
        }
      });

      gsap.from('#burst-2', {
        scale: 0.3,
        opacity: 0,
        rotation: 45,
        scrollTrigger: {
          trigger: '#stage-vector-fireworks',
          start: 'top 65%',
          end: 'bottom center',
          scrub: 1.2
        }
      });

      gsap.from('#constellation-19', {
        scale: 0.7,
        opacity: 0,
        y: 40,
        scrollTrigger: {
          trigger: '#stage-vector-fireworks',
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 1
        }
      });
    }

    // -------------------------------------------------------------
    // NEW VECTOR PAGE 3: GULLAR BOG'I — ATIRGULLAR VA LOLALAR
    // Upward vertical blooming and blossoming on scroll!
    // -------------------------------------------------------------
    const flowerStage = document.getElementById('stage-flower-bloom');
    if (flowerStage) {
      gsap.from('#bloom-flower-center', {
        scale: 0.2,
        rotation: -30,
        opacity: 0,
        y: 90,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: flowerStage,
          start: 'top 75%',
          end: 'bottom 60%',
          scrub: 1.2
        }
      });
      gsap.from(['#bloom-flower-1', '#bloom-flower-2'], {
        scale: 0.1,
        opacity: 0,
        y: 80,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: flowerStage,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 1
        }
      });
    }

    // -------------------------------------------------------------
    // VECTOR PAGE 3: VECTOR FLOATING LANTERNS & LOTUS POND
    // Lanterns float upwards with parallax as you scroll!
    // -------------------------------------------------------------
    const lanternsStage = document.getElementById('stage-vector-lanterns');
    if (lanternsStage) {
      gsap.to('#v-lantern-1', {
        y: -140,
        x: 35,
        scrollTrigger: {
          trigger: '#stage-vector-lanterns',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });

      gsap.to('#v-lantern-2', {
        y: -180,
        x: -25,
        scrollTrigger: {
          trigger: '#stage-vector-lanterns',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      gsap.to('#v-lantern-3', {
        y: -160,
        x: 40,
        scrollTrigger: {
          trigger: '#stage-vector-lanterns',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.3
        }
      });
    }

    // -------------------------------------------------------------
    // NEW VECTOR PAGE 4: MOMIQ GUL (DANDELION) RADIAL SCATTER
    // Seeds detach and scatter in 360-degree radial explosion on scroll!
    // -------------------------------------------------------------
    const dandelionStage = document.getElementById('stage-dandelion');
    if (dandelionStage) {
      gsap.to('#d-seed-1', { x: -240, y: -260, rotation: -90, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: dandelionStage, start: 'top 60%', end: 'bottom 20%', scrub: 1.2 } });
      gsap.to('#d-seed-2', { x: 40, y: -340, rotation: 45, opacity: 0.1, ease: 'none', scrollTrigger: { trigger: dandelionStage, start: 'top 60%', end: 'bottom 20%', scrub: 1 } });
      gsap.to('#d-seed-3', { x: 260, y: -250, rotation: 80, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: dandelionStage, start: 'top 60%', end: 'bottom 20%', scrub: 1.3 } });
      gsap.to('#d-seed-4', { x: -320, y: -40, rotation: -120, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: dandelionStage, start: 'top 60%', end: 'bottom 20%', scrub: 1.1 } });
      gsap.to('#d-seed-5', { x: 310, y: -30, rotation: 110, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: dandelionStage, start: 'top 60%', end: 'bottom 20%', scrub: 1.4 } });
      gsap.to('#d-seed-6', { x: -220, y: 220, rotation: -140, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: dandelionStage, start: 'top 60%', end: 'bottom 20%', scrub: 1.2 } });
      gsap.to('#d-seed-7', { x: 240, y: 230, rotation: 130, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: dandelionStage, start: 'top 60%', end: 'bottom 20%', scrub: 1.3 } });
      gsap.to('#d-seed-8', { x: 180, y: -380, rotation: 60, opacity: 0.1, ease: 'none', scrollTrigger: { trigger: dandelionStage, start: 'top 60%', end: 'bottom 20%', scrub: 1.5 } });
    }

    // -------------------------------------------------------------
    // GRAND COSMIC SOLAR SYSTEM & PLANET MUSHTARIY (JUPITER)
    // 3D orbits revolving, planets and moon dancing on scroll
    // -------------------------------------------------------------
    const solarStage = document.getElementById('solar-stage');
    if (solarStage) {
      // 3D Tilt of the entire orbital galaxy
      gsap.to(solarStage, {
        rotationY: 26,
        rotationX: -12,
        scrollTrigger: {
          trigger: '#solar-system-interlude',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      // Sun scaling and breathing solar flares
      gsap.to('#celestial-sun', {
        scale: 1.3,
        scrollTrigger: {
          trigger: '#solar-system-interlude',
          start: 'top center',
          end: 'bottom center',
          scrub: true
        }
      });

      // Orbit 1: Small Ruby planet and Crescent Moon
      gsap.to('#orbit-ring-1', {
        rotationZ: 360,
        scrollTrigger: {
          trigger: '#solar-system-interlude',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Orbit 2: Majestic Planet Mushtariy (Jupiter)
      gsap.to('#orbit-ring-2', {
        rotationZ: -280,
        scrollTrigger: {
          trigger: '#solar-system-interlude',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.3
        }
      });

      // Orbit 3: Cosmic Hearts and Stars
      gsap.to('#orbit-ring-3', {
        rotationZ: 220,
        scrollTrigger: {
          trigger: '#solar-system-interlude',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.8
        }
      });

      // Orbit 4: Diamonds and Roses
      gsap.to('#orbit-ring-4', {
        rotationZ: -170,
        scrollTrigger: {
          trigger: '#solar-system-interlude',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2.2
        }
      });
    }

    // -------------------------------------------------------------
    // NEW VECTOR PAGE 5: KAPALAKLAR RAQSI — BUTTERFLIES DANCE
    // Zigzag dynamic trajectories across the screen!
    // -------------------------------------------------------------
    const butterfliesStage = document.getElementById('stage-butterflies-dance');
    if (butterfliesStage) {
      gsap.fromTo('#v-bf-1', { x: '50vw', y: -80 }, { x: '-50vw', y: 120, ease: 'none', scrollTrigger: { trigger: butterfliesStage, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
      gsap.fromTo('#v-bf-2', { x: '60vw', y: -40 }, { x: '-40vw', y: 90, ease: 'none', scrollTrigger: { trigger: butterfliesStage, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
      gsap.fromTo('#v-bf-3', { x: '45vw', y: 80 }, { x: '-60vw', y: -60, ease: 'none', scrollTrigger: { trigger: butterfliesStage, start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
      gsap.fromTo('#v-bf-4', { x: '55vw', y: 40 }, { x: '-45vw', y: -80, ease: 'none', scrollTrigger: { trigger: butterfliesStage, start: 'top bottom', end: 'bottom top', scrub: 1.4 } });
      gsap.fromTo('#v-bf-5', { x: '65vw', y: 60 }, { x: '-55vw', y: 140, ease: 'none', scrollTrigger: { trigger: butterfliesStage, start: 'top bottom', end: 'bottom top', scrub: 1.6 } });
    }

    // Chapter 3: Featured Uploaded Couple Artwork Reveal
    const couplePortrait = document.getElementById('couple-art-portrait');
    if (couplePortrait) {
      gsap.from(couplePortrait, {
        scale: 0.84,
        y: 45,
        opacity: 0,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#clasped-hands',
          start: 'top 75%'
        }
      });
    }

    // Chapter 3: Cinematic Clasped Hands - Sideway camera drift + zoom
    const coupleImg = document.getElementById('couple-parallax-img');
    if (coupleImg) {
      gsap.to(coupleImg, {
        scrollTrigger: {
          trigger: '#clasped-hands',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        },
        y: -70,
        x: -40,
        scale: 1.2,
        ease: 'none'
      });
    }

    gsap.from('.cinematic-headline', {
      scrollTrigger: {
        trigger: '#clasped-hands',
        start: 'top 70%'
      },
      opacity: 0,
      x: 50,
      y: 30,
      duration: 1.2,
      ease: 'power3.out'
    });

    gsap.from('.cinematic-card', {
      scrollTrigger: {
        trigger: '#clasped-hands',
        start: 'top 65%'
      },
      opacity: 0,
      y: 60,
      x: -30,
      duration: 1.3,
      ease: 'power3.out'
    });

    // Chapter 4: Pillars Stagger - Alternating organic diagonal arrivals
    gsap.from('.drift-diag-1', {
      scrollTrigger: {
        trigger: '#pillars',
        start: 'top 75%'
      },
      opacity: 0,
      x: -50,
      y: 40,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });

    gsap.from('.drift-diag-2', {
      scrollTrigger: {
        trigger: '#pillars',
        start: 'top 75%'
      },
      opacity: 0,
      x: 50,
      y: 40,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // -------------------------------------------------------------
    // NEW VECTOR PAGE 6: OQ KABUTARLAR VA SEVGI MAKTUBI
    // Diagonal flight from bottom-left to top-right across screen!
    // -------------------------------------------------------------
    const dovesFlightActor = document.getElementById('doves-flight-actor');
    if (dovesFlightActor) {
      gsap.fromTo(dovesFlightActor,
        { x: '-55vw', y: 130, rotation: -6 },
        {
          x: '55vw',
          y: -130,
          rotation: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: '#stage-doves-letter',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3
          }
        }
      );
    }

    // -------------------------------------------------------------
    // INTERLUDE 4: ENDLESS COSMIC VORTEX PASSAGE
    // Camera travels through expanding space rings toward the timer!
    // -------------------------------------------------------------
    gsap.to('.ring-v1', {
      scale: 1.9,
      opacity: 0.8,
      scrollTrigger: {
        trigger: '#endless-passage',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to('.ring-v2', {
      scale: 2.4,
      opacity: 0.6,
      scrollTrigger: {
        trigger: '#endless-passage',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.3
      }
    });

    gsap.from('#endless-card', {
      scale: 0.85,
      y: 80,
      opacity: 0,
      duration: 1.3,
      scrollTrigger: {
        trigger: '#endless-passage',
        start: 'top 75%'
      }
    });

    // Chapter 5: Timer HUD Reveal - Smooth scale and slight rotation
    gsap.from('#live-timer-hud', {
      scrollTrigger: {
        trigger: '#counter-section',
        start: 'top 75%'
      },
      opacity: 0,
      scale: 0.92,
      y: 50,
      x: 30,
      duration: 1.2,
      ease: 'power3.out'
    });

    // -------------------------------------------------------------
    // NEW VECTOR PAGE 7: OLTIN HILOL VA TUNGI SAMO
    // Golden crescent moon ascends diagonally into the starlight!
    // -------------------------------------------------------------
    const crescentMoon = document.getElementById('celestial-crescent');
    if (crescentMoon) {
      gsap.to(crescentMoon, {
        x: -60,
        y: -90,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: '#stage-crescent-city',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.3
        }
      });
    }

    // -------------------------------------------------------------
    // NEW VECTOR PAGE 8: BAYRAMONA SHARLAR — TORT KUTILMOQDA
    // Floating helium balloons rising vertically with harmonic sway!
    // -------------------------------------------------------------
    const balloonsStage = document.getElementById('stage-festive-balloons');
    if (balloonsStage) {
      const balloons = ['#v-balloon-1', '#v-balloon-2', '#v-balloon-3', '#v-balloon-4', '#v-balloon-5', '#v-balloon-6'];
      balloons.forEach((bId, idx) => {
        gsap.to(bId, {
          y: -(170 + idx * 22),
          x: (idx % 2 === 0 ? 30 : -30),
          rotation: (idx % 2 === 0 ? 8 : -8),
          ease: 'none',
          scrollTrigger: {
            trigger: balloonsStage,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1 + idx * 0.15
          }
        });
      });
    }

    // -------------------------------------------------------------
    // GRAND FINALE: THE INTERACTIVE BIRTHDAY CAKE
    // Drops down smoothly from the top when scrolled into view!
    // Once landed, the animated hint pulses: "Shamlarni o'chirish uchun tortga teging!"
    // -------------------------------------------------------------
    const cakeActor = document.getElementById('birthday-cake-actor');
    const cakeHintPill = document.getElementById('cake-hint-pill');
    const candlesCounterPill = document.getElementById('candles-counter-pill');

    if (cakeActor) {
      gsap.fromTo(cakeActor,
        {
          y: -420,
          opacity: 0,
          scale: 0.85,
          rotation: -4
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#stage-birthday-cake',
            start: 'top 70%',
            toggleActions: 'play none none none',
            onEnter: () => {
              // After cake settles, smoothly activate pulsing hint pill and candle counter
              setTimeout(() => {
                cakeHintPill?.classList.add('active');
                candlesCounterPill?.classList.add('active');
                playPianoChime(587.33, audioCtx ? audioCtx.currentTime : 0, 1.2, 0.05);
              }, 600);
            }
          }
        }
      );
    }
  }


  /* ----------------------------------------------------------
     4. LIVE WEDDING MILESTONE TIMER (2026-YIL 2-AVGUST TO'Y KUNIDAN)
     ---------------------------------------------------------- */
  // User Requirement:
  // "Oxirida xisob kitob yili esa 2026 - yildan boshlanadi. ya'ni 2026 yil 2 - avgustdan sababi shu kuni to'yimiz bo'lgan."

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const verdictTextEl = document.getElementById('verdict-headline-text');

  function updateLiveCounter() {
    const now = new Date();
    // To'yimiz kuni: 2026-yil 2-Avgust, 00:01:00 AM (August is index 7)
    const weddingDate = new Date(2026, 7, 2, 0, 1, 0);

    const diff = Math.max(0, now - weddingDate);

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    if (verdictTextEl) {
      verdictTextEl.textContent = `${days} kun, ${hours} soat, ${minutes} daqiqa va ${seconds} soniyadan buyon er-xotin, baxtli oila sifatida birgamiz...`;
    }
  }

  // Update immediately and every second
  updateLiveCounter();
  setInterval(updateLiveCounter, 1000);

  // ----------------------------------------------------------
  // REAL VISITOR COUNTER (Connects to backend /api/visits with persistence)
  // ----------------------------------------------------------
  const visitorNumEl = document.getElementById('visitor-count-num');
  async function initVisitorCounter() {
    let currentViews = parseInt(localStorage.getItem('yaxyo_mushtariy_views') || '1919', 10);
    currentViews += 1;
    localStorage.setItem('yaxyo_mushtariy_views', currentViews);
    if (visitorNumEl) {
      visitorNumEl.textContent = currentViews.toLocaleString();
    }

    try {
      const res = await fetch('/api/visits?inc=1', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.count === 'number') {
          const liveViews = Math.max(data.count, currentViews);
          localStorage.setItem('yaxyo_mushtariy_views', liveViews);
          if (visitorNumEl) {
            visitorNumEl.textContent = liveViews.toLocaleString();
          }
        }
      }
    } catch (e) {
      // Local fallback is already active and displayed
    }
  }

  initVisitorCounter();


  /* ----------------------------------------------------------
     5. HERO & NAVIGATION ACTIONS
     ---------------------------------------------------------- */
  const startJourneyBtn = document.getElementById('start-journey-btn');
  startJourneyBtn?.addEventListener('click', () => {
    if (!isPlaying) startMusic();
    const target = document.getElementById('code-destiny');
    target?.scrollIntoView({ behavior: 'smooth' });
    launchFireworks(window.innerWidth / 2, window.innerHeight * 0.7);
  });

  // Petal booster button
  const petalTrigger = document.getElementById('petal-trigger');
  petalTrigger?.addEventListener('click', () => {
    for (let i = 0; i < 20; i++) {
      petals.push(new FloatingPetal());
    }
    showToast("Atirgul va lolalar tarovati taraldi! 🌷🌹");
    playPianoChime(880, audioCtx ? audioCtx.currentTime : 0, 1.2, 0.05);
  });


  /* ----------------------------------------------------------
     6. LOVE LETTER MODAL DIALOG & CELEBRATION
     ---------------------------------------------------------- */
  const letterDialog = document.getElementById('letter-dialog');
  const openFullLetterBtn = document.getElementById('open-full-letter-btn');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const closeDialogBtn = document.getElementById('close-dialog-btn');
  const celebrateBtn = document.getElementById('celebrate-btn');
  const modalCelebrateBtn = document.getElementById('modal-celebrate-btn');

  function openLetter() {
    if (letterDialog && typeof letterDialog.showModal === 'function') {
      letterDialog.showModal();
      launchFireworks(window.innerWidth / 2, window.innerHeight / 2);
      playPianoChime(659.25, audioCtx ? audioCtx.currentTime : 0, 2, 0.08);
    }
  }

  function closeLetter() {
    if (letterDialog) letterDialog.close();
  }

  openFullLetterBtn?.addEventListener('click', openLetter);
  waxSealBtn?.addEventListener('click', openLetter);
  closeDialogBtn?.addEventListener('click', closeLetter);

  // Close modal when clicking backdrop
  letterDialog?.addEventListener('click', (e) => {
    if (e.target === letterDialog) closeLetter();
  });

  function triggerGrandCelebration() {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const rx = Math.random() * (window.innerWidth * 0.8) + window.innerWidth * 0.1;
        const ry = Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.1;
        launchFireworks(rx, ry);
        playPianoChime(523.25 + i * 80, audioCtx ? audioCtx.currentTime : 0, 1.8, 0.06);
      }, i * 280);
    }
    showToast("Happy 19, Mushtariyim! Baxtimiz abadiy bo'lsin! 💖🎂");
  }

  celebrateBtn?.addEventListener('click', () => {
    const cakeSection = document.getElementById('stage-birthday-cake');
    cakeSection?.scrollIntoView({ behavior: 'smooth' });
    triggerGrandCelebration();
  });

  modalCelebrateBtn?.addEventListener('click', () => {
    closeLetter();
    const cakeSection = document.getElementById('stage-birthday-cake');
    cakeSection?.scrollIntoView({ behavior: 'smooth' });
    triggerGrandCelebration();
  });


  /* ----------------------------------------------------------
     7. GRAND FINALE: INTERACTIVE BIRTHDAY CAKE & CANDLE BLOWOUT
     - Tap cake or candles to blow out one candle at a time.
     - Each tap triggers smoke puff, chime sound, and fireworks!
     - When all 5 candles are extinguished:
       Reveals "Yaxyo + Mushtariy" at the top with grand fireworks!
     ---------------------------------------------------------- */
  const cakeActorEl = document.getElementById('birthday-cake-actor');
  const cakeHintPillEl = document.getElementById('cake-hint-pill');
  const cakeHintTextEl = document.getElementById('cake-hint-text');
  const cakeTopRevealEl = document.getElementById('cake-top-reveal');
  const candlesCountTextEl = document.getElementById('candles-count-text');

  let candlesExtinguished = 0;
  const totalCandles = 5;
  let allCandlesBlown = false;

  function extinguishNextCandle(clickX, clickY) {
    if (allCandlesBlown) {
      // If already blown, extra taps launch celebratory fireworks and flower rain!
      launchFireworks(clickX || window.innerWidth / 2, clickY || window.innerHeight * 0.45);
      playPianoChime(880 + Math.random() * 200, audioCtx ? audioCtx.currentTime : 0, 1.2, 0.05);
      for (let i = 0; i < 4; i++) petals.push(new FloatingPetal());
      return;
    }

    // Find the next lit candle
    const litCandles = document.querySelectorAll('.cake-candle.lit');
    if (litCandles.length === 0) return;

    const candleToExtinguish = litCandles[0];
    candleToExtinguish.classList.remove('lit');
    candleToExtinguish.classList.add('blown-out');

    candlesExtinguished++;
    const remaining = totalCandles - candlesExtinguished;

    // Haptic vibration feedback on phones
    if (navigator.vibrate) {
      try { navigator.vibrate([35, 30, 35]); } catch (e) {}
    }

    // Launch celebratory fireworks at tap position
    const fx = clickX || (window.innerWidth / 2 + (Math.random() * 80 - 40));
    const fy = clickY || (window.innerHeight * 0.45 + (Math.random() * 60 - 30));
    launchFireworks(fx, fy);
    setTimeout(() => {
      launchFireworks(fx + (Math.random() * 100 - 50), fy - 60);
    }, 180);

    // Audio chime note for this candle
    const noteFreqs = [523.25, 587.33, 659.25, 783.99, 880]; // C5, D5, E5, G5, A5
    const freq = noteFreqs[candlesExtinguished - 1] || 659.25;
    playPianoChime(freq, audioCtx ? audioCtx.currentTime : 0, 1.5, 0.08);

    // Update Hint Pill and Counter Text
    if (remaining > 0) {
      if (candlesCountTextEl) {
        candlesCountTextEl.textContent = `${remaining} ta sham qoldi 🕯️ (Yana teging!)`;
      }

      if (cakeHintTextEl) {
        if (remaining === 4) cakeHintTextEl.textContent = "Ajoyib! Qolgan shamlarni ham o'chiring! 🕯️";
        else if (remaining === 3) cakeHintTextEl.textContent = "Keling, yana bitta shamni o'chiramiz! 🕯️";
        else if (remaining === 2) cakeHintTextEl.textContent = "Deyarli tugadi, yana 2 ta qoldi! ✨";
        else if (remaining === 1) cakeHintTextEl.textContent = "Va eng oxirgi sham! Niyatingizni tilang! 💖";
      }
    } else {
      // ALL 5 CANDLES EXTINGUISHED -> TRIGGER GRAND REVEAL!
      allCandlesBlown = true;
      triggerGrandCakeFinale();
    }
  }

  function triggerGrandCakeFinale() {
    // Reveal top "Yaxyo + Mushtariy" title
    if (cakeTopRevealEl) {
      cakeTopRevealEl.classList.add('revealed');
      gsap.fromTo(cakeTopRevealEl,
        { opacity: 0, y: -45, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'back.out(1.4)' }
      );
    }

    if (cakeHintTextEl) {
      cakeHintTextEl.textContent = "🎉 Barcha tilaklaringiz ushalsin, Mushtariyim! Baxtimiz abadiy bo'lsin! 💖🎂";
    }

    if (candlesCountTextEl) {
      candlesCountTextEl.textContent = "✨ Barcha 5 ta sham o'chirildi va niyatlar osmonga uchdi! 🌟";
    }

    // Grand Fireworks Barrage across the screen (12 bursts in sequence)
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const rx = Math.random() * (window.innerWidth * 0.85) + window.innerWidth * 0.08;
        const ry = Math.random() * (window.innerHeight * 0.55) + window.innerHeight * 0.08;
        launchFireworks(rx, ry);

        // Chime ascending fanfare
        const chord = [523.25, 659.25, 783.99, 1046.5];
        const pitch = chord[i % chord.length] * (i > 6 ? 1.5 : 1);
        playPianoChime(pitch, audioCtx ? audioCtx.currentTime : 0, 1.8, 0.06);
      }, i * 260);
    }

    // Heavy petals & flower shower
    for (let p = 0; p < 35; p++) {
      petals.push(new FloatingPetal());
    }

    showToast("Mushtariyim, 19 yoshingiz muborak! Yaxyo Sizni cheksiz sevadi! 💍💖");
  }

  // Attach tap/click listeners to the cake and hint pill
  cakeActorEl?.addEventListener('click', (e) => {
    extinguishNextCandle(e.clientX, e.clientY);
  });

  cakeHintPillEl?.addEventListener('click', (e) => {
    extinguishNextCandle(e.clientX, e.clientY);
  });


  /* ----------------------------------------------------------
     7. TOAST POPUP NOTIFICATION
     ---------------------------------------------------------- */
  const toast = document.getElementById('toast-msg');
  const toastText = document.getElementById('toast-text');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

});
