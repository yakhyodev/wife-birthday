(() => {
  'use strict';

  const onReady = (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  onReady(() => {
    const root = document.documentElement;
    const body = document.body;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const lerp = (from, to, progress) => from + (to - from) * progress;
    const ease = (progress) => 1 - Math.pow(1 - clamp(progress), 3);
    const byId = (id) => document.getElementById(id);
    const query = (selector) => document.querySelector(selector);
    const queryAll = (selector) => Array.from(document.querySelectorAll(selector));

    root.classList.add('native-scroll-engine');

    // Make the small, finite media set deterministic on Vercel and retry once
    // with an absolute URL if a relative request ever fails.
    queryAll('img[src^="assets/"]').forEach((image) => {
      image.loading = 'eager';
      image.decoding = 'async';
      image.classList.add('media-asset');
      const markReady = () => image.classList.add('media-ready');
      if (image.complete && image.naturalWidth > 0) markReady();
      image.addEventListener('load', markReady, { once: true });
      image.addEventListener('error', () => {
        if (image.dataset.retryDone === 'true') {
          image.classList.add('media-error');
          return;
        }
        image.dataset.retryDone = 'true';
        const relativePath = image.getAttribute('src');
        image.src = new URL(relativePath, `${window.location.origin}/`).href;
      });
    });

    const scenes = [
      ['hero', 'Kirish', '↓'],
      ['stage-milk-mocha', 'Milk & Mocha', '→'],
      ['code-destiny', 'Taqdir kodi', '↘'],
      ['stage-teddy-bear', 'Teddy', '←'],
      ['stage-autumn-september', 'Sentyabr', '↘'],
      ['stage-vector-fireworks', 'Yulduzlar', '↗'],
      ['stage-flower-bloom', '19 bahor', '↑'],
      ['stage-vector-lanterns', 'Chiroqlar', '↖'],
      ['happy-19', 'Happy 19', '↔'],
      ['stage-dandelion', 'Tilaklar', '✦'],
      ['solar-system-interlude', 'Mushtariy', '⟳'],
      ['stage-butterflies-dance', 'Kapalaklar', '←'],
      ['clasped-hands', 'Birgalikda', '↘'],
      ['pillars', 'Qalb gavharlari', '↔'],
      ['stage-doves-letter', 'Sadoqat', '↗'],
      ['endless-passage', 'Abadiyat', '◎'],
      ['counter-section', 'Vaqt oqimi', '↙'],
      ['stage-crescent-city', 'Oy nuri', '↗'],
      ['love-letter', 'Qalb so‘zlari', '↘'],
      ['stage-festive-balloons', 'Tuhfa', '↑'],
      ['stage-birthday-cake', 'Grand finale', '↓']
    ].map(([id, label, direction]) => ({ element: byId(id), id, label, direction }))
      .filter((scene) => scene.element);

    const compass = document.createElement('aside');
    compass.className = 'journey-compass';
    compass.setAttribute('aria-live', 'polite');
    compass.innerHTML = `
      <span class="journey-kicker">SCROLL STORY</span>
      <span class="journey-direction" aria-hidden="true">↓</span>
      <span class="journey-label">Kirish</span>
      <span class="journey-count">01 / ${String(scenes.length).padStart(2, '0')}</span>
    `;
    body.appendChild(compass);

    const compassDirection = compass.querySelector('.journey-direction');
    const compassLabel = compass.querySelector('.journey-label');
    const compassCount = compass.querySelector('.journey-count');

    const setActiveScene = (scene) => {
      const index = scenes.indexOf(scene);
      compassDirection.textContent = scene.direction;
      compassLabel.textContent = scene.label;
      compassCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`;
      scenes.forEach((item) => item.element.classList.toggle('is-scene-active', item === scene));
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const scene = scenes.find((item) => item.element === visible.target);
          if (scene) setActiveScene(scene);
        }
      }, { threshold: [0.25, 0.45, 0.65] });
      scenes.forEach((scene) => observer.observe(scene.element));
    }

    const sectionProgress = (section) => {
      if (!section) return 0;
      const rect = section.getBoundingClientRect();
      return clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
    };

    const setTransform = (element, x = 0, y = 0, rotate = 0, scale = 1, opacity = null) => {
      if (!element) return;
      element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
      if (opacity !== null) element.style.opacity = String(clamp(opacity));
    };

    const vw = (amount) => window.innerWidth * amount / 100;
    const vh = (amount) => window.innerHeight * amount / 100;

    const leafVectors = queryAll('[id^="a-leaf-"]').map((element, index) => ({
      element,
      x: 90 + index * 17,
      y: 220 + (index % 4) * 55,
      rotation: (index % 2 ? -1 : 1) * (220 + index * 24)
    }));

    const seedVectors = [
      [-280, -270, -100], [0, -360, 35], [285, -275, 95],
      [-370, -35, -125], [360, -25, 115], [-250, 245, -145],
      [260, 250, 135], [190, -390, 65], [-175, -365, -75],
      [175, -345, 85], [-370, 130, -105], [365, 135, 125]
    ].map(([x, y, rotation], index) => ({ element: byId(`d-seed-${index + 1}`), x, y, rotation }));

    const butterflyVectors = queryAll('[id^="v-bf-"]').map((element, index) => ({
      element,
      direction: index % 3 === 0 ? 1 : -1,
      phase: index * 0.78,
      amplitude: 35 + (index % 4) * 16
    }));

    const balloonVectors = queryAll('[id^="v-balloon-"]').map((element, index) => ({
      element,
      speed: 0.82 + index * 0.085,
      drift: (index % 2 ? -1 : 1) * (18 + index * 4)
    }));

    let frameRequested = false;
    const update = () => {
      frameRequested = false;

      const pageRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pageProgress = clamp(window.scrollY / pageRange);
      const progressBar = byId('scroll-progress');
      if (progressBar) progressBar.style.width = `${pageProgress * 100}%`;

      const viewportCenter = window.innerHeight / 2;
      const nearestScene = scenes.reduce((nearest, scene) => {
        const rect = scene.element.getBoundingClientRect();
        const distance = Math.abs((rect.top + rect.height / 2) - viewportCenter);
        return !nearest || distance < nearest.distance ? { scene, distance } : nearest;
      }, null);
      if (nearestScene) setActiveScene(nearestScene.scene);

      if (reduceMotion) return;

      const heroP = sectionProgress(byId('hero'));
      setTransform(query('#hero .scenic-bg-img'), lerp(-vw(2), vw(2), heroP), 0, 0, 1.035);

      const milkP = sectionProgress(byId('stage-milk-mocha'));
      setTransform(byId('milk-mocha-actor'), lerp(-vw(32), vw(32), milkP), Math.sin(milkP * Math.PI * 2) * 18, lerp(-3, 3, milkP));

      const codeP = sectionProgress(byId('code-destiny'));
      setTransform(byId('terminal-box'), lerp(-vw(13), vw(7), codeP), lerp(vh(9), -vh(3), codeP), lerp(-1.6, 0.8, codeP), lerp(0.94, 1, ease(codeP)), lerp(0.35, 1, ease(codeP * 1.8)));

      const teddyP = sectionProgress(byId('stage-teddy-bear'));
      setTransform(byId('teddy-actor'), lerp(vw(34), -vw(34), teddyP), Math.sin(teddyP * Math.PI) * -32, lerp(4, -4, teddyP));

      const autumnP = sectionProgress(byId('stage-autumn-september'));
      leafVectors.forEach((leaf, index) => {
        const local = clamp((autumnP - index * 0.018) * 1.35);
        setTransform(leaf.element, leaf.x * local, leaf.y * local, leaf.rotation * local, 1, lerp(0.45, 1, Math.sin(local * Math.PI)));
      });

      const fireP = sectionProgress(byId('stage-vector-fireworks'));
      setTransform(byId('burst-1'), lerp(-vw(8), vw(5), fireP), lerp(vh(8), -vh(5), fireP), lerp(-25, 35, fireP), lerp(0.35, 1.12, ease(fireP)), lerp(0.25, 1, ease(fireP * 1.5)));
      setTransform(byId('burst-2'), lerp(vw(8), -vw(5), fireP), lerp(vh(10), -vh(8), fireP), lerp(30, -35, fireP), lerp(0.4, 1.1, ease(fireP)), lerp(0.25, 1, ease(fireP * 1.5)));

      const flowerP = sectionProgress(byId('stage-flower-bloom'));
      ['bloom-flower-1', 'bloom-flower-center', 'bloom-flower-2'].forEach((id, index) => {
        const local = clamp((flowerP - index * 0.06) * 1.45);
        setTransform(byId(id), 0, lerp(125, -18, ease(local)), lerp(-20, 8, local), lerp(0.2, 1, ease(local)), lerp(0.15, 1, ease(local)));
      });
      setTransform(byId('garden-bf-1'), lerp(-vw(10), vw(12), flowerP), Math.sin(flowerP * Math.PI * 3) * 32, lerp(-18, 18, flowerP));
      setTransform(byId('garden-bf-2'), lerp(vw(11), -vw(13), flowerP), Math.cos(flowerP * Math.PI * 3) * 30, lerp(15, -15, flowerP));

      const lanternP = sectionProgress(byId('stage-vector-lanterns'));
      [1, 2, 3].forEach((number, index) => {
        setTransform(byId(`v-lantern-${number}`), (index - 1) * lerp(20, 55, lanternP), lerp(vh(16 + index * 3), -vh(24 + index * 4), lanternP), lerp(-4, 5, lanternP));
      });

      const happyP = sectionProgress(byId('happy-19'));
      setTransform(query('#happy-19 .happy-text-col'), lerp(-vw(18), vw(3), ease(happyP)), lerp(vh(7), -vh(2), happyP), 0, 1, lerp(0.25, 1, ease(happyP * 1.6)));
      setTransform(query('#happy-19 .glass-artwork-frame'), lerp(vw(20), -vw(4), ease(happyP)), lerp(-vh(6), vh(2), happyP), lerp(2.5, -1, happyP), lerp(0.92, 1.03, ease(happyP)), lerp(0.2, 1, ease(happyP * 1.6)));

      const seedP = sectionProgress(byId('stage-dandelion'));
      seedVectors.forEach((seed, index) => {
        const local = clamp((seedP - index * 0.012) * 1.4);
        setTransform(seed.element, seed.x * local, seed.y * local, seed.rotation * local, lerp(1, 0.75, local), lerp(1, 0.08, local));
      });

      const solarP = sectionProgress(byId('solar-system-interlude'));
      setTransform(byId('solar-stage'), 0, 0, lerp(-8, 8, solarP), lerp(0.88, 1.06, Math.sin(solarP * Math.PI)));
      [1, 2, 3, 4].forEach((number) => {
        const direction = number % 2 ? 1 : -1;
        setTransform(byId(`orbit-ring-${number}`), 0, 0, solarP * direction * (150 + number * 58));
      });

      const butterflyP = sectionProgress(byId('stage-butterflies-dance'));
      butterflyVectors.forEach((butterfly, index) => {
        const x = lerp(butterfly.direction * vw(44), butterfly.direction * -vw(44), butterflyP);
        const y = Math.sin(butterflyP * Math.PI * 4 + butterfly.phase) * butterfly.amplitude;
        setTransform(butterfly.element, x, y, Math.cos(butterflyP * Math.PI * 4 + butterfly.phase) * 18, 1, lerp(0.45, 1, Math.sin(clamp(butterflyP) * Math.PI)));
      });

      const handsP = sectionProgress(byId('clasped-hands'));
      setTransform(byId('couple-parallax-img'), lerp(vw(7), -vw(7), handsP), lerp(vh(4), -vh(8), handsP), 0, lerp(1.08, 1.18, handsP));
      setTransform(byId('couple-art-portrait'), lerp(vw(8), -vw(3), ease(handsP)), lerp(vh(7), -vh(3), handsP), lerp(2, -2, handsP), lerp(0.9, 1.02, ease(handsP)), lerp(0.35, 1, ease(handsP * 1.7)));

      const pillarsP = sectionProgress(byId('pillars'));
      queryAll('#pillars .pillar-card').forEach((card, index) => {
        const direction = index % 2 ? 1 : -1;
        setTransform(card, lerp(direction * vw(20), direction * -vw(2), ease(pillarsP)), (index - 1.5) * lerp(18, -4, pillarsP), direction * lerp(2, -1, pillarsP), 1, lerp(0.25, 1, ease(pillarsP * 1.6)));
      });

      const doveP = sectionProgress(byId('stage-doves-letter'));
      setTransform(byId('doves-flight-actor'), lerp(-vw(34), vw(32), doveP), lerp(vh(24), -vh(24), doveP), lerp(-7, 5, doveP), lerp(0.82, 1.08, Math.sin(doveP * Math.PI)));

      const endlessP = sectionProgress(byId('endless-passage'));
      setTransform(byId('endless-card'), lerp(vw(10), -vw(8), endlessP), 0, lerp(-2, 2, endlessP), lerp(0.82, 1.08, ease(endlessP)), lerp(0.35, 1, ease(endlessP * 1.5)));
      queryAll('#endless-passage .ring-vortex').forEach((ring, index) => setTransform(ring, 0, 0, endlessP * (index % 2 ? -1 : 1) * (130 + index * 70), lerp(0.7, 1.35, endlessP)));

      const counterP = sectionProgress(byId('counter-section'));
      setTransform(query('#counter-section .live-timer-hud'), lerp(vw(18), -vw(4), ease(counterP)), lerp(-vh(5), vh(3), counterP), lerp(1.5, -1, counterP), lerp(0.94, 1.02, ease(counterP)), lerp(0.3, 1, ease(counterP * 1.6)));

      const moonP = sectionProgress(byId('stage-crescent-city'));
      setTransform(byId('celestial-crescent'), lerp(-vw(18), vw(16), moonP), lerp(vh(22), -vh(24), moonP), lerp(-12, 8, moonP), lerp(0.72, 1.08, ease(moonP)), lerp(0.35, 1, ease(moonP * 1.5)));
      setTransform(query('#stage-crescent-city .constellation-sky-group'), lerp(vw(8), -vw(5), moonP), lerp(-vh(4), vh(3), moonP), 0, 1, lerp(0.15, 1, ease(moonP * 1.8)));

      const letterP = sectionProgress(byId('love-letter'));
      setTransform(byId('letter-card'), lerp(vw(24), -vw(3), ease(letterP)), lerp(vh(10), -vh(2), letterP), lerp(3, -1, letterP), lerp(0.9, 1.02, ease(letterP)), lerp(0.25, 1, ease(letterP * 1.5)));

      const balloonP = sectionProgress(byId('stage-festive-balloons'));
      balloonVectors.forEach((balloon, index) => {
        const local = clamp(balloonP * balloon.speed + index * 0.025);
        setTransform(balloon.element, Math.sin(local * Math.PI * 2 + index) * balloon.drift, lerp(vh(34), -vh(35 + index * 3), local), Math.sin(local * Math.PI * 3 + index) * 6);
      });

      const cakeP = sectionProgress(byId('stage-birthday-cake'));
      setTransform(byId('birthday-cake-actor'), lerp(-vw(7), vw(4), cakeP), lerp(-vh(18), vh(2), ease(cakeP)), lerp(-2, 1, cakeP), lerp(0.86, 1.02, ease(cakeP)), lerp(0.35, 1, ease(cakeP * 1.6)));
    };

    const requestUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    window.addEventListener('pageshow', requestUpdate);
    requestUpdate();
  });
})();
