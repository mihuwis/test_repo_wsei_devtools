import { useEffect, useState } from "react";
import "./App.css";

function randomTarget() {
  return Math.floor(Math.random() * 16) + 5; // 5..20
}

export default function App() {
  const [mode, setMode] = useState("home");
  const [target, setTarget] = useState(() => randomTarget());
  const [clicksLeft, setClicksLeft] = useState(target);
  const [successSessions, setSuccessSessions] = useState(0);

  // pobierz licznik z API
  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setSuccessSessions(data.successfulSessions))
      .catch(() => {
        // jeśli API nie działa, zostaw 0 (lub pokaż błąd)
      });
  }, []);

  useEffect(() => {
    setClicksLeft(target);
  }, [target]);

  const startSession = () => {
    const newTarget = randomTarget();
    setTarget(newTarget);
    setMode("session");
  };

  const clickTrain = () => setClicksLeft((prev) => prev - 1);

  useEffect(() => {
    if (mode === "session" && clicksLeft === 0) {
      // Zapisz sukces w DB przez API
      fetch("/api/sessions", { method: "POST" })
        .then((r) => r.json())
        .then((data) => {
          alert("Success!");
          setSuccessSessions(data.successfulSessions);
          setMode("home");
        })
        .catch(() => {
          alert("Success! (API error)");
          setMode("home");
        });
    }
  }, [clicksLeft, mode]);

  return (
    <div className="page">
      <header className="topbar">
        <div className="logo">training-app</div>
      </header>

      <main className="content">
        {mode === "home" && (
          <div className="row">
            <button className="plusBtn" onClick={startSession} aria-label="Add session">
              +
            </button>
            <div className="labels">
              <div className="addSession">add session</div>
              <div className="counter">Succesfull sessions: {successSessions}</div>
            </div>
          </div>
        )}

        {mode === "session" && (
          <div className="session">
            <button className="trainBtn" onClick={clickTrain} disabled={clicksLeft <= 0}>
              click it {target} times to train your clicking skills
            </button>
            <div className="hint">Clicks left: {Math.max(clicksLeft, 0)}</div>
          </div>
        )}
      </main>
    </div>
  );
}
