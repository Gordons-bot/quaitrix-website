function escapeHtml(str) {
  if (typeof str !== 'string') return String(str);
  return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#039;'}[m]));
}

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('steps-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const stepCurrent = document.getElementById('step-current');
  const stepLabel = document.getElementById('step-label');
  const progressBar = document.getElementById('progress-bar');
  const successMessage = document.getElementById('success-message');
  const form = document.getElementById('wizard-form');

  let steps = [];
  let currentStep = 0;
  const answers = {};

  async function loadConfig() {
    try {
      const res = await Promise.race([
        fetch('/api/questionnaire/config'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
      ]);
      if (!res.ok) throw new Error('Failed to load config');
      const data = await res.json();
      steps = data.steps && data.steps.length ? data.steps : window.__FALLBACK_STEPS__;
      document.getElementById('step-total').textContent = String(steps.length);
      renderStep(0);
    } catch (err) {
      steps = window.__FALLBACK_STEPS__ || [];
      if (steps.length) {
        document.getElementById('step-total').textContent = String(steps.length);
        renderStep(0);
      } else {
        container.innerHTML = '<p class="text-red-600">Failed to load questionnaire. Please refresh the page.</p>';
      }
      console.error(err);
    }
  }

  function renderStep(index) {
    if (!steps.length) return;
    const step = steps[index];
    stepCurrent.textContent = String(index + 1);
    stepLabel.textContent = step.title;
    const pct = ((index + 1) / steps.length) * 100;
    progressBar.style.width = pct + '%';

    let html = '<fieldset class="space-y-4"><legend class="text-lg font-semibold mb-2">' + escapeHtml(step.title) + '</legend>';

    if (step.type === 'radio') {
      (step.options || []).forEach((opt) => {
        html += '<label class="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:border-link">' +
          '<input type="radio" name="' + step.id + '" value="' + opt.value + '" class="h-4 w-4 text-link" required />' +
          '<span class="ml-3">' + escapeHtml(opt.label) + '</span></label>';
      });
    } else if (step.type === 'checkbox') {
      html += '<p class="text-sm text-muted mb-2">Select all that apply.</p>';
      (step.options || []).forEach((opt) => {
        html += '<label class="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:border-link">' +
          '<input type="checkbox" name="' + step.id + '" value="' + opt.value + '" class="h-4 w-4 rounded text-link" />' +
          '<span class="ml-3">' + escapeHtml(opt.label) + '</span></label>';
      });
    } else if (step.type === 'group') {
      (step.fields || []).forEach((field) => {
        html += '<div><label for="' + field.name + '" class="block text-sm font-medium">' + escapeHtml(field.label) + '</label>' +
          '<input type="' + field.type + '" id="' + field.name + '" name="' + field.name + '" ' + (field.required ? 'required' : '') + ' class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark px-4 py-3" /></div>';
      });
    }

    html += '</fieldset>';
    container.innerHTML = html;

    prevBtn.disabled = index === 0;
    if (index === steps.length - 1) {
      nextBtn.classList.add('hidden');
      submitBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    }

    if (answers[step.id]) {
      const field = form.elements[step.id];
      if (step.type === 'checkbox' && Array.isArray(answers[step.id])) {
        Array.from(field).forEach((cb) => cb.checked = answers[step.id].includes(cb.value));
      } else if (field) {
        field.value = answers[step.id];
      }
    }
  }

  function validateStep(step) {
    const field = form.elements[step.id];
    if (!field) return true;
    if (step.type === 'checkbox') {
      const checked = Array.from(field).filter((cb) => cb.checked);
      answers[step.id] = checked.map((cb) => cb.value);
      return checked.length > 0;
    }
    if (step.type === 'group') {
      let ok = true;
      (step.fields || []).forEach((f) => {
        const el = form.elements[f.name];
        if (f.required && !el.value.trim()) {
          ok = false;
          el.setCustomValidity('This field is required');
        } else {
          el.setCustomValidity('');
        }
      });
      return ok;
    }
    answers[step.id] = field.value;
    return field.checkValidity();
  }

  nextBtn.addEventListener('click', () => {
    const step = steps[currentStep];
    if (!validateStep(step)) {
      form.reportValidity();
      return;
    }
    if (currentStep < steps.length - 1) {
      currentStep++;
      renderStep(currentStep);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      renderStep(currentStep);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    for (let i = currentStep; i < steps.length; i++) {
      if (!validateStep(steps[i])) {
        currentStep = i;
        renderStep(currentStep);
        form.reportValidity();
        ok = false;
        break;
      }
    }
    if (!ok) return;

    try {
      const res = await fetch('/api/questionnaire/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error('Failed to submit');
      form.classList.add('hidden');
      successMessage.classList.remove('hidden');
    } catch (err) {
      alert('Submission failed. Please try again later.');
    }
  });

  await loadConfig();
});

window.__FALLBACK_STEPS__ = [
  {
    "id": "project_type",
    "title": "What type of project do you need?",
    "type": "radio",
    "required": true,
    "options": [
      {"value": "android", "label": "Android App"},
      {"value": "website", "label": "Website"},
      {"value": "both", "label": "Both"}
    ]
  },
  {
    "id": "purpose",
    "title": "What is the primary purpose?",
    "type": "radio",
    "required": true,
    "options": [
      {"value": "business", "label": "Business / Corporate"},
      {"value": "portfolio", "label": "Portfolio / Personal"},
      {"value": "blog", "label": "Blog / Content"},
      {"value": "catalog", "label": "Product Catalog (static showcase)"},
      {"value": "internal", "label": "Internal Tool"}
    ]
  },
  {
    "id": "features",
    "title": "Which features do you need?",
    "type": "checkbox",
    "required": true,
    "options": [
      {"value": "forms", "label": "Input forms (contact, signup, etc.)"},
      {"value": "image_gallery", "label": "Image gallery"},
      {"value": "product_listings", "label": "Product/service listings"},
      {"value": "blog", "label": "Blog / articles"},
      {"value": "offline_data", "label": "Offline data storage (app only)"},
      {"value": "local_user_accounts", "label": "Local user accounts (app only, no cloud sync)"},
      {"value": "stripe_payment", "label": "Stripe Payment"}
    ]
  },
  {
    "id": "design",
    "title": "What design style do you prefer?",
    "type": "radio",
    "required": true,
    "options": [
      {"value": "minimal", "label": "Modern minimal (clean, simple)"},
      {"value": "colorful", "label": "Colorful / vibrant"},
      {"value": "corporate", "label": "Corporate / professional"},
      {"value": "creative", "label": "Creative / experimental"}
    ]
  },
  {
    "id": "content_ready",
    "title": "Do you have content ready?",
    "type": "radio",
    "required": true,
    "options": [
      {"value": "yes", "label": "Yes, ready to go"},
      {"value": "partial", "label": "Partially ready"},
      {"value": "no", "label": "No, need help with content"}
    ]
  },
  {
    "id": "budget",
    "title": "What is your budget range?",
    "type": "radio",
    "required": true,
    "options": [
      {"value": "lt1k", "label": "Less than $1,000"},
      {"value": "1k-5k", "label": "$1,000 – $5,000"},
      {"value": "5k-10k", "label": "$5,000 – $10,000"},
      {"value": "10k+", "label": "$10,000+"}
    ]
  },
  {
    "id": "timeline",
    "title": "What is your target timeline?",
    "type": "radio",
    "required": true,
    "options": [
      {"value": "asap", "label": "ASAP"},
      {"value": "1_month", "label": "Within 1 month"},
      {"value": "flexible", "label": "Flexible"},
      {"value": "long_term", "label": "Long-term / ongoing"}
    ]
  },
  {
    "id": "contact",
    "title": "Contact information",
    "type": "group",
    "required": true,
    "fields": [
      {"name": "name", "label": "Full name", "type": "text", "required": true},
      {"name": "email", "label": "Email address", "type": "email", "required": true},
      {"name": "phone", "label": "Phone number", "type": "tel", "required": false},
      {"name": "company", "label": "Company / organization", "type": "text", "required": false}
    ]
  }
];
