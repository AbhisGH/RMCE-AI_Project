// ─── UTILS ────────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const MY_PROMPTS_KEY = 'fpb-my-prompts';

function loadMyPrompts() {
  try { return JSON.parse(localStorage.getItem(MY_PROMPTS_KEY) || '[]'); }
  catch(e) { return []; }
}

function saveMyPromptsAll(list) {
  localStorage.setItem(MY_PROMPTS_KEY, JSON.stringify(list));
}

// ─── RENDER ───────────────────────────────────────────────────────────────────
function renderMyPromptsPage() {
  const prompts = loadMyPrompts();
  const container = document.getElementById('my-prompts-app');

  let listHtml = '';
  if (!prompts.length) {
    listHtml = `
      <div class="my-prompts-empty">
        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <p>No prompts yet</p>
        <span>Click the + button to create your first prompt.</span>
      </div>`;
  } else {
    listHtml = `<div class="my-prompts-list">` +
      prompts.map((p, i) => `
        <div class="my-prompt-row" onclick="openViewMyPrompt(${i})">
          <div class="my-prompt-row-name">${escHtml(p.heading)}</div>
          <div class="my-prompt-row-cat">${escHtml(p.category)}</div>
          <div class="my-prompt-row-date">${formatDate(p.createdAt)}</div>
          <button class="btn-delete-my-prompt" onclick="deleteMyPrompt(event,${i})" title="Delete">&#x2715;</button>
        </div>`).join('') +
      `</div>`;
  }

  container.innerHTML = `
    <div class="my-prompts-header">
      <div class="my-prompts-title">My Prompts</div>
      <button class="btn-add-prompt" onclick="openCreatePrompt()">
        <svg viewBox="0 0 16 16"><line x1="8" y1="2" x2="8" y2="14"/><line x1="2" y1="8" x2="14" y2="8"/></svg>
        New Prompt
      </button>
    </div>
    ${listHtml}`;
}

function deleteMyPrompt(e, index) {
  e.stopPropagation();
  const list = loadMyPrompts();
  list.splice(index, 1);
  saveMyPromptsAll(list);
  renderMyPromptsPage();
}

// ─── CREATE MODAL ─────────────────────────────────────────────────────────────
function openCreatePrompt() {
  document.getElementById('cp-heading').value = '';
  document.getElementById('cp-category').value = '';
  document.getElementById('cp-text').value = '';
  document.querySelectorAll('.create-error').forEach(el => el.classList.remove('show'));
  document.getElementById('create-prompt-overlay').classList.add('open');
  setTimeout(() => document.getElementById('cp-heading').focus(), 80);
}

function closeCreatePrompt() {
  document.getElementById('create-prompt-overlay').classList.remove('open');
}

function saveMyPrompt() {
  const heading  = document.getElementById('cp-heading').value.trim();
  const category = document.getElementById('cp-category').value;
  const text     = document.getElementById('cp-text').value.trim();
  let valid = true;

  if (!heading)  { document.getElementById('cp-heading-err').classList.add('show');  valid = false; }
  else             document.getElementById('cp-heading-err').classList.remove('show');
  if (!category) { document.getElementById('cp-category-err').classList.add('show'); valid = false; }
  else             document.getElementById('cp-category-err').classList.remove('show');
  if (!text)     { document.getElementById('cp-text-err').classList.add('show');     valid = false; }
  else             document.getElementById('cp-text-err').classList.remove('show');

  if (!valid) return;

  const list = loadMyPrompts();
  list.unshift({ heading, category, text, createdAt: Date.now() });
  saveMyPromptsAll(list);
  closeCreatePrompt();
  renderMyPromptsPage();
  showToast('Prompt saved');
}

document.getElementById('create-prompt-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('create-prompt-overlay')) closeCreatePrompt();
});

// ─── VIEW MODAL ───────────────────────────────────────────────────────────────
let viewingMyPromptIndex = -1;

function openViewMyPrompt(index) {
  const list = loadMyPrompts();
  const p = list[index];
  if (!p) return;
  viewingMyPromptIndex = index;

  document.getElementById('vmp-title').textContent = p.heading;
  document.getElementById('vmp-body').innerHTML = `
    <div class="step visible">
      <div class="output-label">${escHtml(p.category)} &mdash; ${formatDate(p.createdAt)}</div>
      <div class="output-area" id="vmp-text">${escHtml(p.text)}</div>
      <div class="output-actions">
        <button class="btn-copy" onclick="copyMyPrompt()">Copy Prompt</button>
        <button class="btn-download" onclick="downloadMyPrompt()">Download .md</button>
        <a class="btn-dotai" href="https://eu.getdot.ai" target="_blank" rel="noopener">Open in DOT AI ↗</a>
      </div>
    </div>`;

  document.getElementById('view-my-prompt-overlay').classList.add('open');
}

function closeViewMyPrompt() {
  document.getElementById('view-my-prompt-overlay').classList.remove('open');
  viewingMyPromptIndex = -1;
}

function copyMyPrompt() {
  const text = document.getElementById('vmp-text').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('Prompt copied successfully'));
}

function downloadMyPrompt() {
  const list  = loadMyPrompts();
  const p     = viewingMyPromptIndex >= 0 ? list[viewingMyPromptIndex] : null;
  const text  = document.getElementById('vmp-text').textContent;
  const title = (p ? p.heading : 'my-prompt').replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const blob  = new Blob([text], { type: 'text/markdown' });
  const url   = URL.createObjectURL(blob);
  const a     = document.createElement('a');
  a.href = url; a.download = title + '.md'; a.click();
  URL.revokeObjectURL(url);
  showToast('Prompt downloaded');
}

document.getElementById('view-my-prompt-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('view-my-prompt-overlay')) closeViewMyPrompt();
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (document.getElementById('create-prompt-overlay').classList.contains('open')) { closeCreatePrompt(); return; }
  if (document.getElementById('view-my-prompt-overlay').classList.contains('open')) { closeViewMyPrompt(); return; }
});

// ─── INIT ─────────────────────────────────────────────────────────────────────
renderMyPromptsPage();
