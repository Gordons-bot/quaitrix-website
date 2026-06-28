(function() {
  'use strict';
  const LIAISON_URL = '/api/liaison/chat';
  const DEMO_INTAKE_URL = '/api/demo/intake';
  const VERIFY_SEND_URL = '/api/demo/send-verification';
  const VERIFY_CODE_URL = '/api/demo/verify-code';
  const DEMO_GENERATE_URL = '/api/demo/generate';
  const DEMO_CHECK_URL = '/api/demo/check-status';
  const DEMO_MODIFY_URL = '/api/demo/modification';
  const DEMO_PRICING_URL = '/api/demo/calculate-price';

  // ── Styles ──
  const styles = [
    '#qm-chat-btn{position:fixed;bottom:16px!important;right:16px;z-index:8000;width:56px;height:56px;border-radius:50%;background:#2563eb;color:white;border:none;font-size:26px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.18);display:flex;align-items:center;justify-content:center;transition:transform 0.2s;}',
    '#qm-chat-btn:hover{transform:scale(1.08);}',
    '#qm-chat-box{position:fixed;bottom:84px!important;right:16px;z-index:8000;width:calc(100vw - 32px);max-width:360px;max-height:560px;border-radius:16px;background:#fff;box-shadow:0 8px 32px rgba(0,0,0,0.18);display:none;flex-direction:column;overflow:hidden;font-family:system-ui,sans-serif;}',
    '#qm-chat-header{background:linear-gradient(135deg,#2563eb,#7c3aed);color:white;padding:12px 16px;font-weight:600;font-size:15px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(255,255,255,0.1);}',
    '#qm-chat-header .qm-avatar{width:36px;height:36px;border-radius:50%;border:2px solid rgba(255,255,255,0.6);object-fit:cover;flex-shrink:0;}',
    '#qm-chat-header .qm-header-text{display:flex;flex-direction:column;line-height:1.2;}',
    '#qm-chat-header .qm-header-name{font-weight:700;font-size:14px;}',
    '#qm-chat-header .qm-header-status{font-size:11px;opacity:0.85;display:flex;align-items:center;gap:4px;}',
    '#qm-chat-header .qm-online-dot{width:7px;height:7px;background:#22c55e;border-radius:50%;display:inline-block;}',
    '#qm-progress-bar{height:3px;background:#e2e8f0;width:100%;}',
    '#qm-progress-fill{height:100%;background:linear-gradient(90deg,#2563eb,#7c3aed);transition:width 0.4s ease;border-radius:0 2px 2px 0;}',
    '#qm-progress-text{font-size:11px;color:#94a3b8;padding:4px 16px 0;text-align:right;}',
    '#qm-chat-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;max-height:300px;}',
    '.qm-msg{max-width:85%;padding:9px 13px;border-radius:12px;font-size:14px;line-height:1.5;animation:qm-fadein 0.2s ease;}',
    '@keyframes qm-fadein{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}}',
    '.qm-msg.aria{background:#f1f5f9;color:#1e293b;align-self:flex-start;border-bottom-left-radius:4px;display:flex;gap:8px;align-items:flex-start;}',
    '.qm-msg.aria .qm-msg-avatar{width:28px;height:28px;border-radius:50%;flex-shrink:0;margin-top:2px;}',
    '.qm-msg.aria .qm-msg-content{flex:1;}',
    '.qm-msg.user{background:#2563eb;color:white;align-self:flex-end;border-bottom-right-radius:4px;}',
    '.qm-msg.typing{color:#94a3b8;font-style:italic;font-size:13px;}',
    '.qm-msg.system{background:#fef3c7;color:#92400e;align-self:center;border:1px solid #fcd34d;font-size:13px;text-align:center;}',
    '.qm-msg.error{background:#fee2e2;color:#991b1b;align-self:center;border:1px solid #fca5a5;font-size:13px;text-align:center;}',
    '.qm-buttons{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}',
    '.qm-btn-option{background:#fff;border:2px solid #2563eb;color:#2563eb;border-radius:20px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s;min-width:60px;text-align:center;}',
    '.qm-btn-option:hover{background:#2563eb;color:white;transform:scale(1.03);}',
    '.qm-btn-option:active{transform:scale(0.97);}',
    '.qm-btn-option.selected{background:#2563eb;color:white;}',
    '.qm-btn-option:disabled{opacity:0.5;cursor:default;transform:none;}',
    '#qm-chat-input-row{display:flex;padding:10px;border-top:1px solid #e2e8f0;gap:8px;}',
    '#qm-chat-input{flex:1;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:14px;outline:none;}',
    '#qm-chat-input:focus{border-color:#2563eb;}',
    '#qm-chat-input:disabled{background:#f9fafb;cursor:not-allowed;}',
    '#qm-chat-send{background:#2563eb;color:white;border:none;border-radius:8px;padding:8px 14px;cursor:pointer;font-size:14px;font-weight:600;}',
    '#qm-chat-send:hover{background:#1d4ed8;}',
    '#qm-chat-send:disabled{opacity:0.5;cursor:not-allowed;}',
    '#qm-typing-indicator{display:flex;gap:4px;padding:4px 0;}',
    '#qm-typing-indicator span{width:6px;height:6px;background:#94a3b8;border-radius:50%;animation:qm-bounce 1.2s infinite;}',
    '#qm-typing-indicator span:nth-child(2){animation-delay:0.2s;}',
    '#qm-typing-indicator span:nth-child(3){animation-delay:0.4s;}',
    '@keyframes qm-bounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-4px);}}'
  ].join('');
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // ── DOM ──
  const btn = document.createElement('button');
  btn.id = 'qm-chat-btn';
  btn.innerHTML = '💬';
  btn.title = 'Chat with us';
  document.body.appendChild(btn);

  const box = document.createElement('div');
  box.id = 'qm-chat-box';
  box.innerHTML =
    '<div id="qm-chat-header">' +
      '<img class="qm-avatar" src="/aria-avatar.png" alt="Aria">' +
      '<div class="qm-header-text">' +
        '<span class="qm-header-name">Aria — Quaitrix</span>' +
        '<span class="qm-header-status"><span class="qm-online-dot"></span> Online</span>' +
      '</div>' +
    '</div>' +
    '<div id="qm-progress-bar"><div id="qm-progress-fill" style="width:0%"></div></div>' +
    '<div id="qm-progress-text"></div>' +
    '<div id="qm-chat-messages"></div>' +
    '<div id="qm-chat-input-row"><input id="qm-chat-input" type="text" placeholder="Type a message..." /><button id="qm-chat-send">Send</button></div>';
  document.body.appendChild(box);

  // ══════════════════════════════════════════════════════════════════════
  // STATE MACHINE — Demo-First Sales Funnel
  // ══════════════════════════════════════════════════════════════════════

  let messages = [];        // conversation history for LLM
  let isOpen = false;
  let isSubmitting = false; // lock to prevent double-submit
  let buttonsActive = false; // prevent input while buttons shown

  // Collected intake data (overwritten on each message)
  const info = {
    name: null,
    email: null,
    phone: null,
    business_name: null,
    project_type: null,
    industry: null,
    references: null,
    branding: null,
    brief: null
  };

  // ── localStorage persistence ──
  const STORAGE_KEY = 'quaitrix_widget_state';
  const STORAGE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
  let persistenceNoticeShown = false;

  function saveState() {
    try {
      const toSave = { ...info, _timestamp: Date.now(), _customer_id: customer_id, _order_id: order_id, _funnelPhase: funnelPhase, _contactType: contactType, _contactValue: contactValue, _awaitingField: awaitingField };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) { /* quota exceeded — ignore */ }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!parsed._timestamp || (Date.now() - parsed._timestamp) > STORAGE_MAX_AGE) {
        localStorage.removeItem(STORAGE_KEY);
        return false;
      }
      Object.keys(info).forEach(k => { if (parsed[k] !== undefined) info[k] = parsed[k]; });
      if (parsed._customer_id) customer_id = parsed._customer_id;
      if (parsed._order_id) order_id = parsed._order_id;
      if (parsed._funnelPhase) funnelPhase = parsed._funnelPhase;
      if (parsed._contactType) contactType = parsed._contactType;
      if (parsed._contactValue) contactValue = parsed._contactValue;
      if (parsed._awaitingField) awaitingField = parsed._awaitingField;
      return true;
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
  }

  function clearState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  // Session IDs (restored from localStorage or set during funnel)
  let customer_id = null;
  let order_id = null;
  let access_token = null;
  let contactType = null;
  let contactValue = null;
  let funnelPhase = 'greeting'; // greeting → intake → verification → building → ready → reviewing → pricing
  let awaitingField = null; // STRICT SEQUENTIAL: which field we're waiting for right now

  // Restore previous session on load
  const hadSavedState = loadState();

  // ── Progress tracking ──
  const FUNNEL_STEPS = {
    'greeting': { pct: 5, label: 'Getting started' },
    'intake': { pct: 25, label: 'Collecting details' },
    'submitting': { pct: 50, label: 'Submitting...' },
    'verification': { pct: 60, label: 'Verifying contact' },
    'building': { pct: 75, label: 'Building demo' },
    'ready': { pct: 100, label: 'Demo ready!' },
    'reviewing': { pct: 100, label: 'Reviewing feedback' },
    'pricing': { pct: 100, label: 'Pricing' }
  };

  function updateProgress() {
    const step = FUNNEL_STEPS[funnelPhase] || { pct: 0, label: '' };
    const fill = document.getElementById('qm-progress-fill');
    const text = document.getElementById('qm-progress-text');
    if (fill) fill.style.width = step.pct + '%';
    if (text && step.pct > 0) text.textContent = step.label;
    else if (text) text.textContent = '';
  }

  // ── Helpers: extract structured data from free text ──
  function extractEmail(text) {
    const m = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
    return m ? m[0] : null;
  }

  function extractPhone(text) {
    const m = text.match(/[+]?\d{1,4}?[(]?\d{1,4}[)]?[.\s]?\d{1,4}[-.\s]?\d{1,9}/);
    return m ? m[0].replace(/\s+/g, ' ').trim() : null;
  }

  function extractName(text) {
    // FRICTIONLESS: Accept ANY non-empty input as a name
    const trimmed = text.trim();
    if (trimmed.length < 1) return null;
    // If it looks like an email or phone, don't treat as name
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
    if (/^\+?[\d\s\-\(\)\.]{7,}$/.test(trimmed)) return null;
    // If it's a simple yes/no answer, don't treat as name
    if (/^(yes|no|yep|nah|sure|ok|yeah|skip|website|android app|both)$/i.test(trimmed)) return null;
    return trimmed;
  }

  function extractProjectType(text) {
    const lower = text.toLowerCase();
    if (/both|everything|website.*app|app.*website/.test(lower)) return 'Both';
    if (/android|app|mobile|apk/.test(lower)) return 'Android App';
    if (/website|web|site|landing|page/.test(lower)) return 'Website';
    return null;
  }

  // ── Ingest: OVERWRITE state (never append) ──
  function ingestText(text) {
    const lower = text.toLowerCase();

    const extractedEmail = extractEmail(text);
    if (extractedEmail) info.email = extractedEmail;

    const extractedPhone = extractPhone(text);
    if (extractedPhone) info.phone = extractedPhone;

    const extractedName = extractName(text);
    if (extractedName) info.name = extractedName;

    const extractedType = extractProjectType(text);
    if (extractedType) info.project_type = extractedType;

    // Business name extraction — FRICTIONLESS: accept any non-empty input
    const trimmed = text.trim();
    if (trimmed.length >= 1 &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&  // not an email
        !/^\+?[\d\s\-\(\)\.]{7,}$/.test(trimmed) &&      // not a phone
        !/^(yes|no|yep|nah|sure|ok|yeah|skip|website|android app|both)$/i.test(trimmed)) {  // not a simple answer
      info.business_name = trimmed;
    }

    // Industry extraction — FRICTIONLESS: accept any non-empty input (overrides business_name if both set)
    if (trimmed.length >= 1 &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
        !/^\+?[\d\s\-\(\)\.]{7,}$/.test(trimmed) &&
        !/^(yes|no|yep|nah|sure|ok|yeah|skip|website|android app|both)$/i.test(trimmed)) {
      info.industry = trimmed;
    }

    // References: extract URLs
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (urlMatch) info.references = urlMatch[0];
    else if (/[a-z]+\.(com|io|net|app|mu|co)/i.test(text)) {
      const domainMatch = text.match(/([a-z0-9\-]+\.(com|io|net|app|mu|co))/i);
      if (domainMatch) info.references = domainMatch[1];
    }

    // Branding detection
    if (/yes.*logo|have.*brand|branding.*yes|got.*logo/i.test(lower)) info.branding = 'Yes';
    else if (/no.*logo|don'?t.*brand|no.*brand|new.*brand|need.*logo/i.test(lower)) info.branding = 'No';

    // Brief: accept ANY non-empty message that isn't just contact info or a simple yes/no answer
    const hasContactInfo = extractedEmail || extractedPhone;
    const isSimpleAnswer = /^(yes|no|yep|nah|sure|ok|yeah|skip)$/i.test(text.trim());
    const isTooShort = text.trim().length < 1;
    if (!hasContactInfo && !isSimpleAnswer && !isTooShort) {
      info.brief = text;
    }

    // Persist to localStorage after every ingest
    saveState();
  }

  // ── Check if minimum intake data is ready ──
  function isIntakeComplete() {
    if (!info.name) return false;
    if (!info.email) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) return false;
    if (!info.project_type) return false;
    if (!info.brief) return false;
    if (!info.business_name && !info.industry) return false;
    return true;
  }

  function needsEmail() {
    return (!info.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email));
  }

  // ── STRICT SEQUENTIAL FIELD TRACKING ──
  // Returns the next field that needs to be collected, or null if all required fields are present.
  // Order: name → email → business_name → project_type → industry → references → branding → brief
  function getNextMissingField() {
    if (!info.name) return 'name';
    if (!info.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) return 'email';
    if (!info.business_name) return 'business_name';
    if (!info.project_type) return 'project_type';
    if (!info.industry) return 'industry';
    if (!info.references) return 'references';
    if (!info.branding) return 'branding';
    if (!info.brief) return 'brief';
    return null;
  }

  // Validate a specific field's value. Returns { valid: true/false, error: "message" }
  function validateField(field, text) {
    const trimmed = text.trim();
    switch (field) {
      case 'name':
        if (trimmed.length < 1) return { valid: false, error: "I need at least your first name to get started. What should I call you?" };
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return { valid: false, error: "That looks like an email address! What's your name?" };
        if (/^\+?[\d\s\-\(\)\.]{7,}$/.test(trimmed)) return { valid: false, error: "That looks like a phone number! What's your name?" };
        return { valid: true };

      case 'email':
        if (trimmed.length < 1) return { valid: false, error: "I need your email address to send you the demo link. Could you provide it?" };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return { valid: false, error: "I need a valid email address in the format name@example.com. Could you please provide your email?" };
        return { valid: true };

      case 'business_name':
        if (trimmed.length < 1) return { valid: false, error: "What's your business name? (Or your personal name if you don't have one yet)" };
        return { valid: true };

      case 'project_type':
        if (!/website|web|site|landing|page|android|app|mobile|apk|both|everything/i.test(trimmed)) {
          return { valid: false, error: "Please choose one: Website, Android App, or Both. You can type your answer or click a button." };
        }
        return { valid: true };

      case 'industry':
        if (trimmed.length < 1) return { valid: false, error: "What industry or niche is your business in? (e.g., restaurant, retail, healthcare)" };
        return { valid: true };

      case 'references':
        // Optional — accept anything including "skip"
        return { valid: true };

      case 'branding':
        if (!/yes|no|yep|nah|yeah|nope|have|don'?t|need|got/i.test(trimmed)) {
          return { valid: false, error: "Do you have existing branding (logo, colors, etc.)? Please answer Yes or No." };
        }
        return { valid: true };

      case 'brief':
        if (trimmed.length < 1) return { valid: false, error: "Please describe what you want in at least a few words." };
        return { valid: true };

      default:
        return { valid: true };
    }
  }

  // ── UI helpers ──
  function addMessage(role, text) {
    const container = document.getElementById('qm-chat-messages');
    const div = document.createElement('div');
    div.className = 'qm-msg ' + role;

    if (role === 'aria') {
      div.innerHTML = '<img class="qm-msg-avatar" src="/aria-avatar.png" alt="Aria"><div class="qm-msg-content">' + escapeHtml(text) + '</div>';
    } else {
      div.textContent = text;
    }

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.replace(/\n/g, '<br>');
  }

  function setInputDisabled(disabled) {
    const input = document.getElementById('qm-chat-input');
    const sendBtn = document.getElementById('qm-chat-send');
    if (input) input.disabled = disabled;
    if (sendBtn) sendBtn.disabled = disabled;
  }

  // ── Button rendering ──
  function renderButtons(options, callback) {
    const container = document.getElementById('qm-chat-messages');
    const div = document.createElement('div');
    div.className = 'qm-buttons';
    div.id = 'qm-active-buttons';

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'qm-btn-option';
      btn.textContent = opt.label;
      btn.addEventListener('click', () => {
        // Disable all buttons
        div.querySelectorAll('.qm-btn-option').forEach(b => b.disabled = true);
        btn.classList.add('selected');
        // Show user selection
        addMessage('user', opt.label);
        messages.push({ role: 'user', content: opt.value || opt.label });
        // Remove buttons after short delay
        setTimeout(() => div.remove(), 300);
        buttonsActive = false;
        setInputDisabled(false);
        // Callback
        if (callback) callback(opt.value || opt.label);
      });
      div.appendChild(btn);
    });

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    buttonsActive = true;
    setInputDisabled(true);
  }

  function removeButtons() {
    const existing = document.getElementById('qm-active-buttons');
    if (existing) existing.remove();
    buttonsActive = false;
    setInputDisabled(false);
  }

  // ── Parse [BUTTON:Label] syntax from Aria's messages ──
  function parseButtons(text) {
    const buttonRegex = /\[BUTTON:([^\]]+)\]/g;
    const buttons = [];
    let match;
    while ((match = buttonRegex.exec(text)) !== null) {
      buttons.push({ label: match[1].trim(), value: match[1].trim() });
    }
    if (buttons.length === 0) return null;
    // Return text without button markers + buttons array
    const cleanText = text.replace(/\[BUTTON:[^\]]+\]/g, '').replace(/\s{2,}/g, ' ').trim();
    return { text: cleanText, buttons };
  }

  // ══════════════════════════════════════════════════════════════════════
  // API CALLS
  // ══════════════════════════════════════════════════════════════════════

  async function submitIntake() {
    try {
      const res = await fetch(DEMO_INTAKE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      });
      const data = await res.json();
      if (data.success) {
        customer_id = data.customer_id;
        order_id = data.order_id;
        contactType = data.contact_type;
        contactValue = data.contact_value;
        return { success: true, ...data };
      }
      return { success: false, error: data.error };
    } catch (e) {
      return { success: false, error: 'Network error' };
    }
  }

  async function sendVerification() {
    try {
      const res = await fetch(VERIFY_SEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id,
          contact_type: contactType,
          contact_value: contactValue
        })
      });
      const data = await res.json();
      return data;
    } catch (e) {
      return { success: false, error: 'Network error' };
    }
  }

  async function verifyCode(code) {
    try {
      const res = await fetch(VERIFY_CODE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id, code })
      });
      const data = await res.json();
      return { ok: res.ok, ...data };
    } catch (e) {
      return { ok: false, error: 'Network error' };
    }
  }

  async function generateDemo() {
    try {
      const res = await fetch(DEMO_GENERATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id, order_id })
      });
      const data = await res.json();
      if (data.success) {
        access_token = data.access_token;
      }
      return data;
    } catch (e) {
      return { success: false, error: 'Network error' };
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // INTAKE SUBMISSION — called from both sendMessage() and button clicks
  // ══════════════════════════════════════════════════════════════════════

  async function checkAndSubmitIntake() {
    if (funnelPhase !== 'intake' || !isIntakeComplete() || isSubmitting) return;
    funnelPhase = 'submitting';
    saveState();
    updateProgress();
    isSubmitting = true;
    setInputDisabled(true);


    const intakeResult = await submitIntake();
    if (intakeResult.success) {
      funnelPhase = 'verification';
      awaitingField = null; // Stop sequential collection — submission complete
      updateProgress();

      // Trigger demo generation immediately after successful intake
      fetch('/api/demo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: intakeResult.customer_id, order_id: intakeResult.order_id })
      })
      .then(r => r.json())
      .then(demoData => {
        if (demoData.success || demoData.demo_url) {
          addMessage('system', '🎉 Your demo is ready! View it at: ' + demoData.demo_url);
        }
      })

      const verifySent = await sendVerification();
      if (verifySent.success) {
        addMessage('system', '📧 Verification code sent to ' + contactValue + '. Please enter the 6-digit code here.');
        if (verifySent.dev_code) {
        }
      } else {
        addMessage('error', '⚠ Could not send verification. Please try again.');
        funnelPhase = 'intake';
      }
    } else {
      addMessage('error', '⚠ Submission failed: ' + (intakeResult.error || 'Unknown error') + '. Please try again or use our manual form at /start-project');
      funnelPhase = 'intake';
    }

    isSubmitting = false;
    setInputDisabled(false);
  }

  // ══════════════════════════════════════════════════════════════════════
  // MAIN: Send message to Aria
  // ══════════════════════════════════════════════════════════════════════

  async function sendMessage() {
    const input = document.getElementById('qm-chat-input');
    const text = (input && input.value || '').trim();
    if (!text || isSubmitting || buttonsActive) return;
    if (input) input.value = '';

    addMessage('user', text);
    messages.push({ role: 'user', content: text });

    // 1. STRICT SEQUENTIAL FIELD VALIDATION
    // If we're awaiting a specific field, validate it before proceeding
    if (awaitingField && funnelPhase !== 'verification') {
      const validation = validateField(awaitingField, text);
      if (!validation.valid) {
        // Show error and re-prompt for the same field
        messages.push({ role: 'system', content: `[SYSTEM] ${validation.error}` });
        addMessage('aria', validation.error);
        // Re-send to LLM for natural re-prompt
        const typing = addMessage('aria', '<div id="qm-typing-indicator"><span></span><span></span><span></span></div>');
        typing.classList.add('typing');
        try {
          const sysMsg = `[SYSTEM] The customer's input was invalid for ${awaitingField}. The error was: "${validation.error}". Please ask them again clearly for ${awaitingField}.`;
          const res = await fetch(LIAISON_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [...messages, { role: 'system', content: sysMsg }], customer_id, order_id })
          });
          const data = await res.json();
          typing.remove();
          const reply = (data && data.reply) ? data.reply : validation.error;
          addMessage('aria', reply);
          messages.push({ role: 'assistant', content: reply });
        } catch(e) {
          typing.remove();
          addMessage('aria', validation.error);
        }
        return; // STOP here — don't proceed until valid input received
      }
      // Valid! Clear awaitingField — ingestText already captured it
      awaitingField = null;
    }

    // 1b. Ingest user text into state machine (overwrites previous values)
    ingestText(text);

    // 1c. Set awaitingField to the next missing field (for the NEXT message)
    if (funnelPhase === 'intake') {
      const nextField = getNextMissingField();
      if (nextField) awaitingField = nextField;
    }

    // 2. Handle verification phase
    if (funnelPhase === 'verification') {
      const verifyResult = await verifyCode(text.replace(/\D/g, ''));
      if (verifyResult.ok) {
        funnelPhase = 'building';
        updateProgress();
        addMessage('system', '✓ Contact verified! Building your demo... This takes 15-30 minutes.');

        // Trigger demo generation
        const demoResult = await generateDemo();
        if (demoResult.success) {
          funnelPhase = 'ready';
          clearState(); // Demo delivered — no need to persist stale data
          updateProgress();
          messages.push({
            role: 'system',
            content: `[SYSTEM] Demo is ready! URL: ${demoResult.demo_url}. Customer ID: ${customer_id}. Order ID: ${order_id}. Inform the customer their demo link has been sent to ${contactValue}.`
          });
        } else {
          addMessage('error', '⚠ Demo generation failed. Please try again or use our manual form.');
        }
      } else {
        const retry = confirm(verifyResult.error + ' Send a new code?');
        if (retry) {
          await sendVerification();
          addMessage('system', '📧 New code sent! Check your inbox.');
        }
      }
    }

    // 2b. If intake is almost done but email is missing/invalid, ask for it
    if (funnelPhase === 'intake' && !isIntakeComplete() && info.name && info.project_type && info.brief && needsEmail()) {
      messages.push({
        role: 'system',
        content: `[SYSTEM] The customer has provided most information but their email is missing or invalid. Ask them clearly: "To send you the verification code and demo link, I need your email address. Please provide a valid email like name@example.com." Do NOT proceed without a valid email.`
      });
    }

    // 3. Check if intake is complete → trigger intake submission
    await checkAndSubmitIntake();

    // 4. Send conversation to LLM (with any system messages injected)
    const typing = addMessage('aria', '<div id="qm-typing-indicator"><span></span><span></span><span></span></div>');
    typing.classList.add('typing');

    try {
      const res = await fetch(LIAISON_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, customer_id, order_id })
      });
      const data = await res.json();
      typing.remove();

      const reply = (data && data.reply) ? data.reply : 'Sorry, I could not respond.';

      // Check for [BUTTON:...] syntax in reply
      const parsed = parseButtons(reply);
      if (parsed && parsed.buttons.length > 0) {
        if (parsed.text) addMessage('aria', parsed.text);
        else {
          // If only buttons, still show them
        }
        renderButtons(parsed.buttons, async (selectedValue) => {
          // Re-ingest the selected value
          ingestText(selectedValue);
          // Validate the button selection against awaitingField
          if (awaitingField) {
            const validation = validateField(awaitingField, selectedValue);
            if (!validation.valid) {
              addMessage('aria', validation.error);
              return;
            }
            awaitingField = null;
          }
          // Set next awaiting field
          const nextField = getNextMissingField();
          if (nextField) awaitingField = nextField;
          // Check if intake is complete after button selection
          await checkAndSubmitIntake();
        });
      } else {
        addMessage('aria', reply);
      }
      messages.push({ role: 'assistant', content: reply });

      // Show persistence notice once after first meaningful save
      if (!persistenceNoticeShown && (info.name || info.email)) {
        persistenceNoticeShown = true;
        const notice = document.createElement('div');
        notice.id = 'qm-persist-notice';
        notice.className = 'qm-msg system';
        notice.style.fontSize = '11px';
        notice.textContent = '💾 Your progress is saved automatically';
        const container = document.getElementById('qm-chat-messages');
        if (container) container.appendChild(notice);
      }

      // Check if Aria just asked the first intake question → move to intake phase
      if (funnelPhase === 'greeting' && /name|full name/i.test(reply)) {
        funnelPhase = 'intake';
        awaitingField = 'name'; // Start sequential collection with name
        updateProgress();
      }

    } catch (e) {
      typing.remove();
      addMessage('aria', 'Sorry, something went wrong.');
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ══════════════════════════════════════════════════════════════════════

  btn.addEventListener('click', function() {
    isOpen = !isOpen;
    box.style.display = isOpen ? 'flex' : 'none';
    if (isOpen && messages.length === 0) {
      addMessage('aria', "Hi! I'm Aria from Quaitrix 👋 We build websites and Android apps for small businesses. Would you like to see a free demo of what your project could look like before committing?");
    }
    if (isOpen) {
      updateProgress();
      const input = document.getElementById('qm-chat-input');
      if (input) input.focus();
    }
  });

  const sendBtn = document.getElementById('qm-chat-send');
  if (sendBtn) sendBtn.addEventListener('click', sendMessage);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && isOpen && !buttonsActive) sendMessage();
  });
})();
