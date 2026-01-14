
function createSimulation(analysis) {
  const events = [];

  if (!analysis) return { events };

  const issues = new Set(analysis.issues || []);

  if (issues.has('Missing Strict-Transport-Security (HSTS)')) {
    events.push({
      type: 'hsts_demo',
      title: 'HSTS absent — риск понижения протокола',
      description: 'Без HSTS браузеру легче быть подвергнутым downgrade-атаке. В учебной симуляции показано, как соединение может перейти на HTTP.',
      steps: [
        'Браузер делает запрос по HTTPS',
        'Атакующий пытается заставить клиента перейти на HTTP',
        'Если нет HSTS, клиент может повторно подключиться по HTTP — риск перехвата'
      ]
    });
  }

  if ((analysis.forms || []).some(f => !f.hasCsrf)) {
    events.push({
      type: 'csrf_demo',
      title: 'Форма без CSRF',
      description: 'Отсутствует CSRF-токен. В учебной симуляции демонстрируется, как внешняя страница может отправить запрос от лица пользователя (симуляция — без реальной отправки).',
      steps: [
        'Пользователь авторизован на сайте',
        'Злоумышленник заставляет пользователя открыть страницу с хитрым скриптом',
        'Скрипт отправляет POST-запрос на уязвимый endpoint (симуляция)'
      ]
    });
  }

  if (issues.has('Missing Content-Security-Policy (CSP)')) {
    events.push({
      type: 'csp_demo',
      title: 'Отсутствует CSP',
      description: 'CSP помогает блокировать выполнение неподписанных скриптов и инлайн-кода. В симуляции показываем, как внедрённый скрипт может выполнить вредоносный код (только визуальная имитация).',
      steps: [
        'Страница загружается без CSP',
        'Внедрённый скрипт может выполнить действия на странице (симуляция)'
      ]
    });
  }

  if ((analysis.cookies || []).length > 0) {
    const cookieIssues = [];
    (analysis.cookies || []).forEach(sc => {
      if (!/HttpOnly/i.test(sc)) cookieIssues.push('HttpOnly');
      if (!/Secure/i.test(sc)) cookieIssues.push('Secure');
      if (!/SameSite/i.test(sc)) cookieIssues.push('SameSite');
    });
    if (cookieIssues.length) {
      events.push({
        type: 'cookie_demo',
        title: 'Cookie без безопасных атрибутов',
        description: 'Cookies без HttpOnly/Secure/SameSite более уязвимы к XSS и перехвату. Симуляция показывает, как скрипт может получить доступ к cookie (только визуализация).',
        steps: [
          'Сессия хранится в cookie',
          'Если нет HttpOnly, JS может прочитать cookie (симуляция)',
          'Если нет Secure и соединение HTTP, cookie могут быть перехвачены'
        ]
      });
    }
  }

  return { events };
}

module.exports = { createSimulation };
