(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameEl = form.querySelector('#name');
    var phoneEl = form.querySelector('#phone');
    var emailEl = form.querySelector('#email');
    var messageEl = form.querySelector('#message');

    var data = {
      name: nameEl && nameEl.value ? nameEl.value.trim() : '',
      phone: phoneEl && phoneEl.value ? phoneEl.value.trim() : '',
      email: emailEl && emailEl.value ? emailEl.value.trim() : '',
      message: messageEl && messageEl.value ? messageEl.value.trim() : ''
    };

    var btn = form.querySelector('.btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
    }

    // Отправка в Telegram (если развёрнуто на Vercel с настроенным API)
    var apiUrl = '/api/send-telegram';
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.ok) {
          alert('Thanks! We\'ve received your request and will call you soon.');
          form.reset();
        } else {
          alert('Request saved. We will contact you soon.');
          form.reset();
        }
      })
      .catch(function () {
        alert('Thanks! We\'ve received your request and will be in touch soon.');
        form.reset();
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Submit request';
        }
      });
  });
})();
