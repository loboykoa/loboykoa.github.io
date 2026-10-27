// Форма заявки: собирает ответы в текст и открывает чат с Александром в Telegram.
// На сайте и на сервере ничего не хранится — заявка уходит только сообщением в Telegram.
(function () {
  var TG = 'loboyko_china';
  var form = document.getElementById('reqForm');
  var done = document.getElementById('reqDone');
  var err = document.getElementById('reqErr');
  var out = document.getElementById('reqText');
  var openTg = document.getElementById('openTg');

  function val(id) { return document.getElementById(id).value.trim(); }

  function buildText() {
    function checked(name) {
      return [].slice.call(form.querySelectorAll('input[name="' + name + '"]:checked')).map(function (c) { return c.value; }).join(', ');
    }
    var lines = ['Здравствуйте, Александр! Заявка с сайта на расчёт.', ''];
    function add(label, v) { if (v) lines.push(label + ': ' + v); }
    add('Товар', val('product'));
    add('Подробности', val('details'));
    add('Объём партии', val('volume'));
    add('Сейчас вожу', val('scheme'));
    add('Нужно', checked('need'));
    add('Где забирать', val('from'));
    add('Куда везти', val('city'));
    add('Важно', checked('imp'));
    add('Что не устраивает', val('pain'));
    lines.push('');
    add('Имя', val('name'));
    add('Контакт', val('contact'));
    return lines.join('\n');
  }

  function check() {
    var miss = [];
    if (!val('product')) miss.push('что хотите привезти');
    if (!val('name')) miss.push('имя');
    if (!val('contact')) miss.push('телефон или @ник');
    if (miss.length) return 'Заполните: ' + miss.join(', ') + '.';
    if (!document.getElementById('consent').checked) return 'Отметьте согласие на обработку персональных данных.';
    return '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var problem = check();
    err.textContent = problem;
    err.hidden = !problem;
    if (problem) return;

    var text = buildText();
    var url = 'https://t.me/' + TG + '?text=' + encodeURIComponent(text);
    out.value = text;
    openTg.href = url;
    if (typeof window.ym === 'function' && window.METRIKA_ID) window.ym(window.METRIKA_ID, 'reachGoal', 'request');
    window.open(url, '_blank', 'noopener');
    form.hidden = true;
    done.hidden = false;
    done.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('copyBtn').addEventListener('click', function () {
    var btn = this;
    function ok() { btn.textContent = 'Скопировано ✓'; setTimeout(function () { btn.textContent = 'Скопировать текст'; }, 2000); }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(out.value).then(ok, function () { out.select(); document.execCommand('copy'); ok(); });
    } else { out.select(); document.execCommand('copy'); ok(); }
  });

  var nophone = document.querySelector('.nophone-link');
  if (nophone) nophone.addEventListener('click', function () {
    if (typeof window.ym === 'function' && window.METRIKA_ID) window.ym(window.METRIKA_ID, 'reachGoal', 'phone_form');
  });

  document.getElementById('editBtn').addEventListener('click', function () {
    done.hidden = true;
    form.hidden = false;
  });
})();
