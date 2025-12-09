import React from 'react';

export default function VizPanel({ sim }) {
  if (!sim) {
    return (
      <div className="panel viz">
        <h2>Визуализация</h2>
        <p>Нажми <em>Simulate</em>, чтобы увидеть учебную симуляцию последствий выявленных проблем.</p>
      </div>
    );
  }

  if (sim.error) {
    return (
      <div className="panel viz">
        <h2>Симуляция — ошибка</h2>
        <pre>{sim.error}</pre>
      </div>
    );
  }

  return (
    <div className="panel viz">
      <h2>Симуляция</h2>
      {sim.events && sim.events.length ? (
        sim.events.map((ev, i) => (
          <div className="sim-event" key={i}>
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
            <ol>
              {ev.steps.map((s, j) => <li key={j}>{s}</li>)}
            </ol>
            <div className="sim-visual">
              {/* Простая визуализация: статическая, объяснительная */}
              <div className="box"></div>
            </div>
          </div>
        ))
      ) : (
        <p>Событий симуляции нет (issues не найдены).</p>
      )}
    </div>
  );
}
