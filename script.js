(function () {
  'use strict';
  const config = window.ASTROTAURUS_CONFIG || {};
  const products = {
    birth: { name: 'Birth Chart Reading', price: '$15', payment: 'birthChartPaymentUrl' },
    compatibility: { name: 'Compatibility Reading', price: '$25', payment: 'compatibilityPaymentUrl' }
  };
  const dialog = document.querySelector('#order-dialog');
  const form = document.querySelector('#order-form');
  const error = document.querySelector('#form-error');
  const second = document.querySelector('#second-person');
  let selected = 'birth';

  document.querySelector('#year').textContent = new Date().getFullYear();
  const email = String(config.contactEmail || '').trim();
  const contact = document.querySelector('#contact-link');
  if (email) contact.href = 'mailto:' + encodeURIComponent(email);
  else contact.hidden = true;

  document.querySelectorAll('[data-reading]').forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.reading;
    const product = products[selected];
    form.reset();
    error.hidden = true;
    document.querySelector('#order-type').textContent = product.name;
    document.querySelector('#order-price').textContent = product.price;
    second.classList.toggle('hidden', selected !== 'compatibility');
    second.querySelector('[name="birthDate2"]').required = selected === 'compatibility';
    second.querySelector('[name="birthPlace2"]').required = selected === 'compatibility';
    const ready = Boolean(String(config.intakeEndpoint || '').trim() && String(config[product.payment] || '').trim());
    document.querySelector('#setup-notice').hidden = ready;
    document.querySelector('#submit-order').disabled = !ready;
    document.querySelector('#submit-order').innerHTML = ready ? 'Continue to secure checkout <span aria-hidden="true">↗</span>' : 'Ordering opens soon';
    dialog.showModal();
  }));
  document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  for (const n of [1, 2]) {
    const toggle = form.elements['unknownTime' + n];
    const time = form.elements['birthTime' + n];
    toggle.addEventListener('change', () => { time.disabled = toggle.checked; if (toggle.checked) time.value = ''; });
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    error.hidden = true;
    if (!form.reportValidity()) return;
    const endpoint = String(config.intakeEndpoint || '').trim();
    const payment = String(config[products[selected].payment] || '').trim();
    if (!endpoint || !payment) {
      showError('Ordering is not open yet. Please check back soon.');
      return;
    }
    let url;
    try { url = new URL(payment); if (url.protocol !== 'https:') throw new Error('Invalid payment link'); }
    catch (_) { showError('Checkout is temporarily unavailable. Please try again later.'); return; }
    const values = new FormData(form);
    const payload = {
      reading: products[selected].name,
      price: products[selected].price,
      name: String(values.get('customerName') || ''),
      email: String(values.get('customerEmail') || ''),
      birthDate1: String(values.get('birthDate1') || ''),
      birthTime1: values.get('unknownTime1') ? 'Unknown' : String(values.get('birthTime1') || ''),
      birthPlace1: String(values.get('birthPlace1') || ''),
      birthDate2: selected === 'compatibility' ? String(values.get('birthDate2') || '') : '',
      birthTime2: selected === 'compatibility' ? (values.get('unknownTime2') ? 'Unknown' : String(values.get('birthTime2') || '')) : '',
      birthPlace2: selected === 'compatibility' ? String(values.get('birthPlace2') || '') : '',
      focus: String(values.get('focus') || ''),
      subject: 'AstroTaurus intake: ' + products[selected].name
    };
    const submit = document.querySelector('#submit-order');
    submit.disabled = true;
    submit.textContent = 'Sending your details…';
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('Submission failed');
      window.location.assign(url.href);
    } catch (_) {
      showError('Your details could not be sent. Please try again. No payment has been taken.');
      submit.disabled = false;
      submit.innerHTML = 'Continue to secure checkout <span aria-hidden="true">↗</span>';
    }
  });
  function showError(message) { error.textContent = message; error.hidden = false; error.scrollIntoView({ block: 'nearest' }); }
})();
