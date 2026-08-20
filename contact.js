/* ═══════════════════════════════════════════════════════
   Lambo Code — Contact Form
   Submits to Web3Forms API via fetch.
   Get your free access key at: https://web3forms.com
   ═══════════════════════════════════════════════════════ */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // ── Replace with your Web3Forms access key ──
  // Sign up free at https://web3forms.com to get one
  const ACCESS_KEY = '647d2908-c043-4e61-82d9-14fe5aea071f';

  const nameInput = document.getElementById('ctName');
  const emailInput = document.getElementById('ctEmail');
  const typeInput = document.getElementById('ctType');
  const messageInput = document.getElementById('ctMessage');
  const submitBtn = document.getElementById('ctSubmit');
  const submitText = submitBtn?.querySelector('.ct-submit-text');
  const submitLoading = submitBtn?.querySelector('.ct-submit-loading');
  const successEl = document.getElementById('ctSuccess');
  const errorEl = document.getElementById('ctFormError');

  const fields = [
    { input: nameInput, error: document.getElementById('ctNameError'), validate: (v) => {
      if (!v.trim()) return 'Please enter your name.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    }},
    { input: emailInput, error: document.getElementById('ctEmailError'), validate: (v) => {
      if (!v.trim()) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Please enter a valid email address.';
      return '';
    }},
    { input: typeInput, error: document.getElementById('ctTypeError'), validate: (v) => {
      if (!v) return 'Please select a project type.';
      return '';
    }},
    { input: messageInput, error: document.getElementById('ctMessageError'), validate: (v) => {
      if (!v.trim()) return 'Please enter a message.';
      if (v.trim().length < 20) return 'Message must be at least 20 characters.';
      return '';
    }}
  ];

  function validateField(field) {
    const msg = field.validate(field.input.value);
    const fieldWrap = field.input.closest('.ct-field');
    if (msg) {
      fieldWrap?.classList.add('has-error');
      if (field.error) field.error.textContent = msg;
      return false;
    } else {
      fieldWrap?.classList.remove('has-error');
      if (field.error) field.error.textContent = '';
      return true;
    }
  }

  fields.forEach((f) => {
    f.input.addEventListener('input', () => {
      if (f.input.closest('.ct-field')?.classList.contains('has-error')) validateField(f);
    });
    f.input.addEventListener('change', () => {
      if (f.input.closest('.ct-field')?.classList.contains('has-error')) validateField(f);
    });
  });

  function setState(state) {
    if (!submitBtn || !submitText || !submitLoading) return;
    if (state === 'loading') {
      submitBtn.disabled = true;
      submitText.style.display = 'none';
      submitLoading.style.display = 'inline-flex';
      successEl && (successEl.style.display = 'none');
      errorEl && (errorEl.style.display = 'none');
    } else if (state === 'success') {
      submitBtn.disabled = false;
      submitText.style.display = 'inline';
      submitLoading.style.display = 'none';
      form.reset();
      fields.forEach((f) => {
        f.input.closest('.ct-field')?.classList.remove('has-error');
        if (f.error) f.error.textContent = '';
      });
      successEl && (successEl.style.display = 'flex');
      errorEl && (errorEl.style.display = 'none');
    } else if (state === 'error') {
      submitBtn.disabled = false;
      submitText.style.display = 'inline';
      submitLoading.style.display = 'none';
      successEl && (successEl.style.display = 'none');
      errorEl && (errorEl.style.display = 'flex');
    } else {
      submitBtn.disabled = false;
      submitText.style.display = 'inline';
      submitLoading.style.display = 'none';
      successEl && (successEl.style.display = 'none');
      errorEl && (errorEl.style.display = 'none');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    fields.forEach((f) => {
      if (!validateField(f)) isValid = false;
    });

    if (!isValid) {
      const firstError = form.querySelector('.ct-field.has-error input, .ct-field.has-error select, .ct-field.has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    setState('loading');

    try {
      const formData = new FormData(form);
      formData.append('access_key', ACCESS_KEY);
      formData.append('subject', 'New project inquiry from Lambo Code website');
      formData.append('from_name', 'Lambo Code Website');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setState('success');
      } else {
        setState('error');
      }
    } catch (err) {
      setState('error');
    }
  });
})();
