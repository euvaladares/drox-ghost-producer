/**
 * DROX STUDIO // GHOST PRODUCTION LANDING PAGE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initModal();
  initAudioPreviews();
  initScrollEffects();
  initYear();
});

/* --------------------------------------------------------------------------
   01. NAVIGATION & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavigation() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');
  const header = document.getElementById('header');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });
  }

  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.paddingBlock = '0.75rem';
      header.style.background = 'rgba(7, 7, 9, 0.9)';
    } else {
      header.style.paddingBlock = '1rem';
      header.style.background = 'rgba(7, 7, 9, 0.75)';
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   02. BRIEFING & BUDGET MODAL
   -------------------------------------------------------------------------- */
function initModal() {
  const modal = document.getElementById('budget-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const openButtons = document.querySelectorAll('.open-budget-modal');
  const form = document.getElementById('budget-form');
  const serviceRadios = document.querySelectorAll('input[name="service_type"]');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prefService = btn.getAttribute('data-pref-service');
      if (prefService) {
        serviceRadios.forEach(radio => {
          if (radio.value.toLowerCase().includes(prefService.toLowerCase()) || 
              prefService.toLowerCase().includes(radio.value.toLowerCase())) {
            radio.checked = true;
          }
        });
      }
      openModal();
    });
  });

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = document.getElementById('input-artist');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 150);
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Form Submission handling
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const service = formData.get('service_type') || 'Ghost Production';
      const artist = formData.get('artist_name') || '';
      const contact = formData.get('contact_info') || '';
      const link = formData.get('demo_link') || '';
      const briefing = formData.get('briefing_notes') || '';

      const textMessage = 
`*DROX STUDIO // SOLICITAÇÃO DE ORÇAMENTO*
---------------------------------------
• *Serviço:* ${service}
• *Artista / Nome:* ${artist}
• *Contato:* ${contact}
${link ? `• *Link Demo/Referência:* ${link}\n` : ''}${briefing ? `• *Briefing / Ideia:* ${briefing}\n` : ''}---------------------------------------
Enviado via Landing Page DROX Studio`;

      // Copy text to clipboard and open WhatsApp
      navigator.clipboard?.writeText(textMessage).catch(() => {});

      // Prepared for WhatsApp destination
      const encoded = encodeURIComponent(textMessage);
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
      
      const submitBtn = document.getElementById('submit-briefing-btn');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>ABRINDO CANAL DIRETO...</span>`;
        submitBtn.disabled = true;

        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
          submitBtn.innerHTML = `<span>BRIEFING ENVIADO!</span>`;
          setTimeout(() => {
            closeModal();
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }, 1500);
        }, 600);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   03. AUDIO / SOUND DESIGN SYNTH PREVIEWER (Web Audio API)
   -------------------------------------------------------------------------- */
function initAudioPreviews() {
  const rows = document.querySelectorAll('.sound-track-row');
  let audioCtx = null;
  let currentActiveRow = null;
  let intervalId = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Generate an authentic club kick & synth pulse
  function triggerClubBeat(bpm = 126, style = 'tech-house') {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Sub kick
    const kickOsc = ctx.createOscillator();
    const kickGain = ctx.createGain();

    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(140, now);
    kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.12);

    kickGain.gain.setValueAtTime(0.7, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    kickOsc.connect(kickGain);
    kickGain.connect(ctx.destination);

    kickOsc.start(now);
    kickOsc.stop(now + 0.4);

    // Warm deep house chord / synth stab
    const synthOsc = ctx.createOscillator();
    const synthFilter = ctx.createBiquadFilter();
    const synthGain = ctx.createGain();

    synthOsc.type = style === 'tech-house' ? 'sawtooth' : 'triangle';
    synthOsc.frequency.setValueAtTime(style === 'tech-house' ? 110 : 87.31, now + 0.1);

    synthFilter.type = 'lowpass';
    synthFilter.frequency.setValueAtTime(400, now + 0.1);
    synthFilter.frequency.exponentialRampToValueAtTime(1400, now + 0.18);
    synthFilter.frequency.exponentialRampToValueAtTime(300, now + 0.32);

    synthGain.gain.setValueAtTime(0.0001, now + 0.1);
    synthGain.gain.exponentialRampToValueAtTime(0.18, now + 0.15);
    synthGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    synthOsc.connect(synthFilter);
    synthFilter.connect(synthGain);
    synthGain.connect(ctx.destination);

    synthOsc.start(now + 0.1);
    synthOsc.stop(now + 0.38);
  }

  rows.forEach(row => {
    const btn = row.querySelector('.sound-play-btn');
    const playIcon = btn?.querySelector('.play-icon');
    const pauseIcon = btn?.querySelector('.pause-icon');
    const style = row.getAttribute('data-style') || 'tech-house';
    const bpm = style === 'tech-house' ? 126 : (style === 'deep-house' ? 124 : 127);
    const intervalMs = (60 / bpm) * 1000;

    btn?.addEventListener('click', () => {
      const isCurrentlyPlaying = row.classList.contains('is-playing');

      // Stop any other playing track
      if (currentActiveRow && currentActiveRow !== row) {
        stopPlaying(currentActiveRow);
      }

      if (isCurrentlyPlaying) {
        stopPlaying(row);
      } else {
        startPlaying(row, bpm, style, intervalMs);
      }
    });
  });

  function startPlaying(row, bpm, style, intervalMs) {
    const btn = row.querySelector('.sound-play-btn');
    const playIcon = btn?.querySelector('.play-icon');
    const pauseIcon = btn?.querySelector('.pause-icon');

    row.classList.add('is-playing');
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';

    currentActiveRow = row;

    // Trigger initial beat
    triggerClubBeat(bpm, style);

    // Loop beat
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      triggerClubBeat(bpm, style);
    }, intervalMs);

    // Auto stop after 10 seconds
    setTimeout(() => {
      if (currentActiveRow === row) {
        stopPlaying(row);
      }
    }, 12000);
  }

  function stopPlaying(row) {
    row.classList.remove('is-playing');
    const btn = row.querySelector('.sound-play-btn');
    const playIcon = btn?.querySelector('.play-icon');
    const pauseIcon = btn?.querySelector('.pause-icon');

    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';

    clearInterval(intervalId);
    intervalId = null;
    currentActiveRow = null;
  }
}

/* --------------------------------------------------------------------------
   04. SCROLL REVEAL & MICRO EFFECTS
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .process-step, .metric-card').forEach(el => {
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   05. AUTO YEAR
   -------------------------------------------------------------------------- */
function initYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
