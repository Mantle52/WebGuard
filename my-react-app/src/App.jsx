import React, { useState } from 'react';
import AnalyzerForm from './components/AnalyzerForm';
import ResultsPanel from './components/ResultsPanel';
import VizPanel from './components/VizPanel';

export default function App() {
  const [analysis, setAnalysis] = useState(null);
  const [sim, setSim] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleAnalyze(url) {
    setBusy(true);
    setSim(null);
    setAnalysis(null);
    try {
      const resp = await fetch('http://localhost:4000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await resp.json();
      setAnalysis(data);
    } catch (e) {
      setAnalysis({ fetchError: String(e) });
    } finally {
      setBusy(false);
    }
  }

  async function handleSimulate() {
    if (!analysis) return;
    setBusy(true);
    try {
      const resp = await fetch('http://localhost:4000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysis)
      });
      const data = await resp.json();
      setSim(data);
    } catch (e) {
      setSim({ error: String(e) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>WebGuard — локальный анализатор конфигураций</h1>
        <p className="subtitle">Безопасный учебный инструмент для демонстрации ошибок конфигурации</p>
      </header>

      <AnalyzerForm onAnalyze={handleAnalyze} busy={busy} />
      <div className="main-grid">
        <ResultsPanel analysis={analysis} onSimulate={handleSimulate} busy={busy} />
        <VizPanel sim={sim} />
      </div>

      <footer>
        <small>Работает с локальными тестовыми страницами. Пример: http://localhost:4000/testbed/test1.html</small>
      </footer>
    </div>
  );
}
