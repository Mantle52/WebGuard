import React, { useState } from 'react';

export default function AnalyzerForm({ onAnalyze, busy }) {
  const [url, setUrl] = useState('http://localhost:4000/testbed/test1.html');

  function submit(e) {
    e.preventDefault();
    if (!url) return;
    onAnalyze(url);
  }

  return (
    <form className="analyzer-form" onSubmit={submit}>
      <label>
        URL для анализа:
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="http://localhost:4000/testbed/test1.html"
        />
      </label>
      <button type="submit" disabled={busy}>
        {busy ? 'Анализ...' : 'Analyze'}
      </button>
    </form>
  );
}
