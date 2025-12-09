import React from 'react';

export default function ResultsPanel({ analysis, onSimulate, busy }) {
  if (!analysis) {
    return (
      <div className="panel results">
        <h2>Результаты анализа</h2>
        <p>Нажми Analyze, чтобы запустить анализ локальной тестовой страницы.</p>
      </div>
    );
  }

  if (analysis.fetchError) {
    return (
      <div className="panel results">
        <h2>Ошибка</h2>
        <pre>{analysis.fetchError}</pre>
      </div>
    );
  }

  return (
    <div className="panel results">
      <h2>Результаты для {analysis.url}</h2>

      <section>
        <h3>Идентификация</h3>
        <p>ok: {String(analysis.ok)}</p>
      </section>

      <section>
        <h3>Найденные проблемы</h3>
        {analysis.issues && analysis.issues.length ? (
          <ul>
            {analysis.issues.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        ) : (
          <p>Проблем не обнаружено (в рамках простого анализа).</p>
        )}
      </section>

      <section>
        <h3>Формы</h3>
        {analysis.forms && analysis.forms.length ? (
          <ul>
            {analysis.forms.map((f, i) => (
              <li key={i}>action: {f.action || '(none)'} — CSRF token: {f.hasCsrf ? 'yes' : 'no'}</li>
            ))}
          </ul>
        ) : <p>Форм не найдено.</p>}
      </section>

      <section>
        <h3>Заголовки (фрагмент)</h3>
        <pre className="headers">{JSON.stringify(analysis.headers, null, 2)}</pre>
      </section>

      <div className="actions">
        <button onClick={onSimulate} disabled={busy}>Simulate (показать визуализацию)</button>
      </div>
    </div>
  );
}
