import { inject } from '@vercel/analytics';

inject();

// --- SMOOTH SCROLLING ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// --- LEAD QUALIFICATION FORM ---
const INSTAGRAM_DM_URL = 'https://ig.me/m/drox_music';

const OPTIONS = {
  service: [
    'Ghost Production Completa (Música do zero)',
    'Mixagem e Masterização',
    'Apenas Masterização',
    'Co-produção / Finalizar uma ideia',
    'Outro'
  ],
  phase: [
    'É apenas uma ideia na minha cabeça',
    'Tenho um rascunho/loop básico, mas não consigo finalizar',
    'A track está pronta, só precisa do toque profissional (Mix/Master)'
  ]
};

const form = document.getElementById('lead-form');
const steps = [...form.querySelectorAll('.lf-step')];
const backBtn = document.getElementById('lf-back');
const nextBtn = document.getElementById('lf-next');
const copyBtn = document.getElementById('lf-copy');
const keyHint = document.getElementById('lf-keyhint');
const progressBar = document.getElementById('lf-progress-bar');
const summaryEl = document.getElementById('lf-summary');
const nameInput = document.getElementById('lf-name');
const artistInput = document.getElementById('lf-artist');
const urgencySelect = document.getElementById('lf-urgency');
const budgetInput = document.getElementById('lf-budget');
const SUMMARY_STEP = steps.length - 1;

const answers = { name: '', artist: '', service: '', phase: '', urgency: '', budget: '' };
let current = 0;
let lastFocus = null;

// Build option cards (A, B, C...)
form.querySelectorAll('.lf-options').forEach(group => {
  const field = group.dataset.field;
  OPTIONS[field].forEach((label, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lf-option';
    btn.innerHTML = `<span class="lf-key">${String.fromCharCode(65 + i)}</span><span class="lf-option-text"></span>`;
    btn.querySelector('.lf-option-text').textContent = label;
    btn.addEventListener('click', () => {
      answers[field] = label;
      markSelected(group, btn);
      setTimeout(() => goTo(current + 1), 220);
    });
    group.appendChild(btn);
  });
});

function markSelected(group, selectedBtn) {
  group.querySelectorAll('.lf-option').forEach(b => b.classList.toggle('is-selected', b === selectedBtn));
}

function restoreSelection(group) {
  const field = group.dataset.field;
  const idx = OPTIONS[field].indexOf(answers[field]);
  group.querySelectorAll('.lf-option').forEach((b, i) => b.classList.toggle('is-selected', i === idx));
}

function formatBRL(digits) {
  return `R$ ${Number(digits).toLocaleString('pt-BR')}`;
}

function buildMessage() {
  const lines = [
    'Olá! Vim pelo site e tenho interesse no seu serviço',
    '',
    'Meus dados',
    `Nome: ${answers.name}`
  ];
  if (answers.artist) lines.push(`Nome artístico: ${answers.artist}`);
  lines.push(
    `Serviço: ${answers.service}`,
    `Fase do projeto: ${answers.phase}`,
    `Urgência: ${answers.urgency}`,
    `Investimento: ${formatBRL(answers.budget)}`
  );
  return lines.join('\n');
}

async function copyMessage() {
  const text = buildMessage();
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers/contexts without async clipboard access
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch {}
    ta.remove();
    return ok;
  }
}

function renderSummary() {
  const rows = [['Nome', answers.name]];
  if (answers.artist) rows.push(['Nome artístico', answers.artist]);
  rows.push(['Serviço', answers.service], ['Fase do projeto', answers.phase], ['Urgência', answers.urgency], ['Investimento', formatBRL(answers.budget)]);
  summaryEl.innerHTML = '';
  rows.forEach(([k, v]) => {
    const wrap = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = k;
    dd.textContent = v;
    wrap.append(dt, dd);
    summaryEl.appendChild(wrap);
  });
}

function showError(msg) {
  const el = steps[current].querySelector('.lf-error');
  if (el) el.textContent = msg;
}

function validate() {
  if (current === 0) {
    const name = nameInput.value.trim();
    if (name.split(/\s+/).filter(Boolean).length < 2) {
      showError('Por favor, informe seu nome completo.');
      nameInput.focus();
      return false;
    }
    answers.name = name;
    answers.artist = artistInput.value.trim();
  } else if (current === 1 && !answers.service) {
    showError('Selecione uma opção para continuar.');
    return false;
  } else if (current === 2 && !answers.phase) {
    showError('Selecione uma opção para continuar.');
    return false;
  } else if (current === 3) {
    if (!urgencySelect.value) {
      showError('Selecione uma opção para continuar.');
      urgencySelect.focus();
      return false;
    }
    answers.urgency = urgencySelect.value;
  } else if (current === 4) {
    const digits = budgetInput.value.replace(/\D/g, '');
    if (!digits || Number(digits) <= 0) {
      showError('Informe um valor para continuar.');
      budgetInput.focus();
      return false;
    }
    answers.budget = digits;
  }
  return true;
}

function goTo(index) {
  if (index < 0 || index >= steps.length) return;
  if (index === SUMMARY_STEP) renderSummary();
  steps.forEach((s, i) => {
    s.classList.toggle('is-active', i === index);
    s.classList.toggle('is-before', i < index);
    s.querySelector('.lf-error')?.replaceChildren();
    s.inert = i !== index;
  });
  current = index;
  progressBar.style.width = `${((index + 1) / steps.length) * 100}%`;
  backBtn.style.visibility = index === 0 ? 'hidden' : 'visible';

  const isSummary = index === SUMMARY_STEP;
  nextBtn.querySelector('span').textContent = isSummary ? 'Enviar' : 'OK';
  nextBtn.classList.toggle('is-send', isSummary);
  const isChoice = index === 1 || index === 2;
  copyBtn.hidden = !isSummary;
  form.classList.toggle('is-summary', isSummary);
  copyBtn.classList.remove('is-copied');
  copyBtn.querySelector('span').textContent = 'Copiar';
  nextBtn.hidden = isChoice;
  keyHint.hidden = isChoice;

  const active = steps[index];
  if (index === 1 || index === 2) restoreSelection(active.querySelector('.lf-options'));
  setTimeout(() => {
    const focusEl = active.querySelector('input, select') || (isChoice ? active.querySelector('.lf-option') : nextBtn);
    focusEl?.focus({ preventScroll: true });
  }, 60);
}

function openForm() {
  lastFocus = document.activeElement;
  form.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => form.classList.add('is-open'));
  goTo(0);
}

function closeForm() {
  form.classList.remove('is-open');
  document.body.style.overflow = '';
  setTimeout(() => { form.hidden = true; }, 250);
  lastFocus?.focus?.();
}

function submitForm() {
  if (typeof fbq === 'function') fbq('track', 'Lead');
  copyMessage();
  window.open(INSTAGRAM_DM_URL, '_blank', 'noopener');
  closeForm();
}

function next() {
  if (current === SUMMARY_STEP) return submitForm();
  if (validate()) goTo(current + 1);
}

document.querySelectorAll('[data-open-form]').forEach(el =>
  el.addEventListener('click', e => { e.preventDefault(); openForm(); })
);
budgetInput.addEventListener('input', () => {
  const digits = budgetInput.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 9);
  budgetInput.value = digits ? Number(digits).toLocaleString('pt-BR') : '';
});
let copyTimer;
copyBtn.addEventListener('click', async () => {
  const ok = await copyMessage();
  copyBtn.classList.toggle('is-copied', ok);
  copyBtn.querySelector('span').textContent = ok ? 'Copiado!' : 'Falha ao copiar';
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copyBtn.classList.remove('is-copied');
    copyBtn.querySelector('span').textContent = 'Copiar';
  }, 2500);
});
document.getElementById('lf-close').addEventListener('click', closeForm);
backBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', next);

form.addEventListener('keydown', e => {
  if (form.hidden) return;
  if (e.key === 'Escape') return closeForm();
  if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
    e.preventDefault();
    next();
    return;
  }
  // Letter shortcuts on option screens
  if ((current === 1 || current === 2) && /^[a-z]$/i.test(e.key) && !e.metaKey && !e.ctrlKey) {
    const opts = steps[current].querySelectorAll('.lf-option');
    opts[e.key.toUpperCase().charCodeAt(0) - 65]?.click();
  }
  // Keep focus inside the dialog
  if (e.key === 'Tab') {
    const f = [...form.querySelectorAll('button, input, select')].filter(el => !el.disabled && !el.hidden && !el.closest('[inert]') && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
