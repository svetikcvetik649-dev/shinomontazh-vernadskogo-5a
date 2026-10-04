(function () {
  /* Запись: ближайшие 7 дней (работают каждый день) и часы 8-19, пересчитываются от московского времени. */
  var svc = document.getElementById('f-svc');
  var daysEl = document.getElementById('days'), timesEl = document.getElementById('times');
  var state = { day: null, time: null };
  var fmt = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/Moscow' });
  var hourNow = +new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hour12: false, timeZone: 'Europe/Moscow' }).format(new Date());
  var now = new Date();
  var days = [];
  for (var k = 0; k < 8 && days.length < 7; k++) {
    if (k === 0 && hourNow >= 19) continue;                 // сегодня уже поздно
    days.push(new Date(now.getTime() + k * 86400000));
  }
  function chip(label, pressed, onClick, disabled) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = label;
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    if (disabled) b.disabled = true;
    b.addEventListener('click', onClick);
    return b;
  }
  function isToday(d) { return fmt.format(d) === fmt.format(now); }
  function renderTimes() {
    timesEl.innerHTML = '';
    for (var h = 8; h <= 19; h++) {
      (function (h) {
        var label = h + ':00';
        var past = state.day && isToday(state.day) && h <= hourNow;
        timesEl.appendChild(chip(label, state.time === label, function () { state.time = label; renderTimes(); }, past));
      })(h);
    }
  }
  function renderDays() {
    daysEl.innerHTML = '';
    days.forEach(function (d) {
      var label = (isToday(d) ? 'сегодня, ' : '') + fmt.format(d);
      daysEl.appendChild(chip(label, state.day === d, function () { state.day = d; state.time = null; renderDays(); renderTimes(); }));
    });
  }
  if (days.length) { state.day = days[0]; renderDays(); renderTimes(); }

  var form = document.getElementById('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var tel = form.elements.tel.value.trim();
    if (tel.replace(/\D/g, '').length < 10) {
      form.elements.tel.focus();
      form.elements.tel.setCustomValidity('Введите телефон');
      form.elements.tel.reportValidity();
      form.elements.tel.setCustomValidity('');
      return;
    }
    var when = state.day ? fmt.format(state.day) + (state.time ? ' в ' + state.time : '') : 'в удобное время';
    var t = 'Здравствуйте! Хочу записаться на шиномонтаж на Вернадского, 5А: ' + svc.value + ', ' + when + '. Мой телефон ' + tel + '. Подскажите, пожалуйста, свободно ли это время?';
    window.open('https://wa.me/79165596934?text=' + encodeURIComponent(t), '_blank', 'noopener');
  });
})();
