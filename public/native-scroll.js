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
      ['hero', 'Kirish', '↓'], ['stage-milk-mocha', 'Milk & Mocha', '→'],
      ['code-destiny', 'Taqdir kodi', '↘'], ['stage-teddy-bear', 'Teddy', '←'],
      ['stage-autumn-september', 'Sentyabr', '↘'], ['stage-vector-fireworks', 'Yulduzlar', '↗'],
      ['stage-flower-bloom', '19 bahor', '↑'], ['stage-vector-lanterns', 'Chiroqlar', '↖'],
      ['happy-19', 'Happy 19', '↔'], ['stage-dandelion', 'Tilaklar', '✦'],
      ['solar-system-interlude', 'Mushtariy', '⟳'], ['stage-butterflies-dance', 'Kapalaklar', '←'],
      ['clasped-hands', 'Birgalikda', '↘'], ['pillars', 'Qalb gavharlari', '↔'],
      ['stage-doves-letter', 'Sadoqat', '↗'], ['endless-passage', 'Abadiyat', '◎'],
      ['counter-section', 'Vaqt oqimi', '↙'], ['stage-crescent-city', 'Oy nuri', '↗'],
      ['love-letter', 'Qalb so‘zlari', '↘'], ['stage-festive-balloons', 'Tuhfa', '↑'],
      ['stage-birthday-cake', 'Grand finale', '↓']
    ].map(([id, label, direction]) => ({ element: byId(id), id, label, direction })).filter((scene) => scene.element);

    const compass = document.createElement('aside');
    compass.className = 'journey-compass';
    compass.setAttribute('aria-live', 'polite');
    compass.innerHTML = `<span class="journey-kicker">SCROLL STORY</span><span class="journey-direction" aria-hidden="true">↓</span><span class="journey-label">Kirish</span><span class="journey-count">01 / ${String(scenes.length).padStart(2, '0')}</span>`;
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
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
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
    const leafVectors = queryAll('[id^="a-leaf-"]').map((element, index) => ({ element, x: 90 + index * 17, y: 220 + (index % 4) * 55, rotation: (index % 2 ? -1 : 1) * (220 + index * 24) }));
    const seedVectors = [[-280,-270,-100],[0,-360,35],[285,-275,95],[-370,-35,-125],[360,-25,115],[-250,245,-145],[260,250,135],[190,-390,65],[-175,-365,-75],[175,-345,85],[-370,130,-105],[365,135,125]].map(([x,y,rotation], index) => ({ element: byId(`d-seed-${index + 1}`), x, y, rotation }));
    const butterflyVectors = queryAll('[id^="v-bf-"]').map((element, index) => ({ element, direction: index % 3 === 0 ? 1 : -1, phase: index * 0.78, amplitude: 35 + (index % 4) * 16 }));
    const balloonVectors = queryAll('[id^="v-balloon-"]').map((element, index) => ({ element, speed: 0.82 + index * 0.085, drift: (index % 2 ? -1 : 1) * (18 + index * 4) }));

    let frameRequested = false;
    const update = () => {
      frameRequested = false;
      const pageRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progressBar = byId('scroll-progress');
      if (progressBar) progressBar.style.width = `${clamp(window.scrollY / pageRange) * 100}%`;
      const viewportCenter = window.innerHeight / 2;
      const nearestScene = scenes.reduce((nearest, scene) => {
        const rect = scene.element.getBoundingClientRect();
        const distance = Math.abs((rect.top + rect.height / 2) - viewportCenter);
        return !nearest || distance < nearest.distance ? { scene, distance } : nearest;
      }, null);
      if (nearestScene) setActiveScene(nearestScene.scene);
      if (reduceMotion) return;

      const p = (id) => sectionProgress(byId(id));
      let value = p('hero');
      setTransform(query('#hero .scenic-bg-img'), lerp(-vw(2), vw(2), value), 0, 0, 1.035);
      value = p('stage-milk-mocha'); setTransform(byId('milk-mocha-actor'), lerp(-vw(32), vw(32), value), Math.sin(value*Math.PI*2)*18, lerp(-3,3,value));
      value = p('code-destiny'); setTransform(byId('terminal-box'), lerp(-vw(13),vw(7),value), lerp(vh(9),-vh(3),value), lerp(-1.6,.8,value), lerp(.94,1,ease(value)), lerp(.35,1,ease(value*1.8)));
      value = p('stage-teddy-bear'); setTransform(byId('teddy-actor'), lerp(vw(34),-vw(34),value), Math.sin(value*Math.PI)*-32, lerp(4,-4,value));
      value = p('stage-autumn-september'); leafVectors.forEach((leaf,index)=>{const local=clamp((value-index*.018)*1.35);setTransform(leaf.element,leaf.x*local,leaf.y*local,leaf.rotation*local,1,lerp(.45,1,Math.sin(local*Math.PI)));});
      value = p('stage-vector-fireworks'); setTransform(byId('burst-1'),lerp(-vw(8),vw(5),value),lerp(vh(8),-vh(5),value),lerp(-25,35,value),lerp(.35,1.12,ease(value)),lerp(.25,1,ease(value*1.5))); setTransform(byId('burst-2'),lerp(vw(8),-vw(5),value),lerp(vh(10),-vh(8),value),lerp(30,-35,value),lerp(.4,1.1,ease(value)),lerp(.25,1,ease(value*1.5)));
      value = p('stage-flower-bloom'); ['bloom-flower-1','bloom-flower-center','bloom-flower-2'].forEach((id,index)=>{const local=clamp((value-index*.06)*1.45);setTransform(byId(id),0,lerp(125,-18,ease(local)),lerp(-20,8,local),lerp(.2,1,ease(local)),lerp(.15,1,ease(local)));}); setTransform(byId('garden-bf-1'),lerp(-vw(10),vw(12),value),Math.sin(value*Math.PI*3)*32,lerp(-18,18,value)); setTransform(byId('garden-bf-2'),lerp(vw(11),-vw(13),value),Math.cos(value*Math.PI*3)*30,lerp(15,-15,value));
      value = p('stage-vector-lanterns'); [1,2,3].forEach((number,index)=>setTransform(byId(`v-lantern-${number}`),(index-1)*lerp(20,55,value),lerp(vh(16+index*3),-vh(24+index*4),value),lerp(-4,5,value)));
      value = p('happy-19'); setTransform(query('#happy-19 .happy-text-col'),lerp(-vw(18),vw(3),ease(value)),lerp(vh(7),-vh(2),value),0,1,lerp(.25,1,ease(value*1.6))); setTransform(query('#happy-19 .glass-artwork-frame'),lerp(vw(20),-vw(4),ease(value)),lerp(-vh(6),vh(2),value),lerp(2.5,-1,value),lerp(.92,1.03,ease(value)),lerp(.2,1,ease(value*1.6)));
      value = p('stage-dandelion'); seedVectors.forEach((seed,index)=>{const local=clamp((value-index*.012)*1.4);setTransform(seed.element,seed.x*local,seed.y*local,seed.rotation*local,lerp(1,.75,local),lerp(1,.08,local));});
      value = p('solar-system-interlude'); setTransform(byId('solar-stage'),0,0,lerp(-8,8,value),lerp(.88,1.06,Math.sin(value*Math.PI))); [1,2,3,4].forEach(number=>setTransform(byId(`orbit-ring-${number}`),0,0,value*(number%2?1:-1)*(150+number*58)));
      value = p('stage-butterflies-dance'); butterflyVectors.forEach((item,index)=>setTransform(item.element,lerp(item.direction*vw(44),item.direction*-vw(44),value),Math.sin(value*Math.PI*4+item.phase)*item.amplitude,Math.cos(value*Math.PI*4+item.phase)*18,1,lerp(.45,1,Math.sin(clamp(value)*Math.PI))));
      value = p('clasped-hands'); setTransform(byId('couple-parallax-img'),lerp(vw(7),-vw(7),value),lerp(vh(4),-vh(8),value),0,lerp(1.08,1.18,value)); setTransform(byId('couple-art-portrait'),lerp(vw(8),-vw(3),ease(value)),lerp(vh(7),-vh(3),value),lerp(2,-2,value),lerp(.9,1.02,ease(value)),lerp(.35,1,ease(value*1.7)));
      value = p('pillars'); queryAll('#pillars .pillar-card').forEach((card,index)=>{const direction=index%2?1:-1;setTransform(card,lerp(direction*vw(20),direction*-vw(2),ease(value)),(index-1.5)*lerp(18,-4,value),direction*lerp(2,-1,value),1,lerp(.25,1,ease(value*1.6)));});
      value = p('stage-doves-letter'); setTransform(byId('doves-flight-actor'),lerp(-vw(34),vw(32),value),lerp(vh(24),-vh(24),value),lerp(-7,5,value),lerp(.82,1.08,Math.sin(value*Math.PI)));
      value = p('endless-passage'); setTransform(byId('endless-card'),lerp(vw(10),-vw(8),value),0,lerp(-2,2,value),lerp(.82,1.08,ease(value)),lerp(.35,1,ease(value*1.5))); queryAll('#endless-passage .ring-vortex').forEach((ring,index)=>setTransform(ring,0,0,value*(index%2?-1:1)*(130+index*70),lerp(.7,1.35,value)));
      value = p('counter-section'); setTransform(query('#counter-section .live-timer-hud'),lerp(vw(18),-vw(4),ease(value)),lerp(-vh(5),vh(3),value),lerp(1.5,-1,value),lerp(.94,1.02,ease(value)),lerp(.3,1,ease(value*1.6)));
      value = p('stage-crescent-city'); setTransform(byId('celestial-crescent'),lerp(-vw(18),vw(16),value),lerp(vh(22),-vh(24),value),lerp(-12,8,value),lerp(.72,1.08,ease(value)),lerp(.35,1,ease(value*1.5))); setTransform(query('#stage-crescent-city .constellation-sky-group'),lerp(vw(8),-vw(5),value),lerp(-vh(4),vh(3),value),0,1,lerp(.15,1,ease(value*1.8)));
      value = p('love-letter'); setTransform(byId('letter-card'),lerp(vw(24),-vw(3),ease(value)),lerp(vh(10),-vh(2),value),lerp(3,-1,value),lerp(.9,1.02,ease(value)),lerp(.25,1,ease(value*1.5)));
      value = p('stage-festive-balloons'); balloonVectors.forEach((item,index)=>{const local=clamp(value*item.speed+index*.025);setTransform(item.element,Math.sin(local*Math.PI*2+index)*item.drift,lerp(vh(34),-vh(35+index*3),local),Math.sin(local*Math.PI*3+index)*6);});
      value = p('stage-birthday-cake'); setTransform(byId('birthday-cake-actor'),lerp(-vw(7),vw(4),value),lerp(-vh(18),vh(2),ease(value)),lerp(-2,1,value),lerp(.86,1.02,ease(value)),lerp(.35,1,ease(value*1.6)));
    };
    const requestUpdate = () => { if (frameRequested) return; frameRequested = true; window.requestAnimationFrame(update); };
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    window.addEventListener('pageshow', requestUpdate);
    requestUpdate();
  });
})();
