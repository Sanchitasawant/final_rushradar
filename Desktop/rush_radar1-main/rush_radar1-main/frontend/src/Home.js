import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes floatUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(14,165,233,0.3); }
    50%       { box-shadow: 0 0 40px rgba(14,165,233,0.7), 0 0 80px rgba(37,99,235,0.3); }
  }

  @keyframes trainSlide {
    0%   { transform: translateX(-8px); }
    50%  { transform: translateX(8px); }
    100% { transform: translateX(-8px); }
  }

  @keyframes scanLine {
    0%   { top: 0%; opacity: 0.6; }
    100% { top: 100%; opacity: 0; }
  }

  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }

  @keyframes dotBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
  }

  @keyframes navGlow {
    0%, 100% { box-shadow: 0 4px 30px rgba(14,165,233,0.08); }
    50%       { box-shadow: 0 4px 30px rgba(14,165,233,0.2); }
  }

  .card-anim { animation: floatUp 0.6s ease forwards; }
  .card-anim:nth-child(2) { animation-delay: 0.1s; }
  .card-anim:nth-child(3) { animation-delay: 0.2s; }
  .card-anim:nth-child(4) { animation-delay: 0.3s; }

  .predict-btn:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 8px 30px rgba(14,165,233,0.5) !important;
    transition: all 0.2s ease;
  }
  .predict-btn:active { transform: scale(0.98); }

  .nav-btn:hover {
    background: rgba(14,165,233,0.15) !important;
    color: #38bdf8 !important;
    transform: translateY(-1px);
    transition: all 0.2s ease;
  }

  select option { background: #0f172a; color: white; }

  .select-field:focus {
    border-color: rgba(14,165,233,0.6) !important;
    box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
  }

  .live-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #22c55e;
    animation: dotBlink 1.5s infinite;
    display: inline-block;
    margin-right: 6px;
  }

  .scan-container { position: relative; overflow: hidden; }
  .scan-container::after {
    content: '';
    position: absolute;
    left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(14,165,233,0.6), transparent);
    animation: scanLine 3s linear infinite;
  }

  /* Responsive polish (keep layout, prevent overflow) */
  @media (max-width: 980px) {
    .rr-main-grid {
      grid-template-columns: 1fr !important;
      padding: 28px 16px !important;
      gap: 20px !important;
    }
    .rr-navbar-wrap {
      padding: 0 16px !important;
    }
    .rr-hero-title {
      font-size: clamp(44px, 10vw, 64px) !important;
    }
  }

  @media (max-width: 520px) {
    .rr-navbar-links {
      gap: 8px !important;
    }
    .rr-navbar-links button {
      padding: 9px 14px !important;
      border-radius: 12px !important;
    }
  }
`;

function Home() {
  const navigate = useNavigate();

  const [train, setTrain] = useState("CSMT_FAST");
  const [station, setStation] = useState("");
  const [stations, setStations] = useState([]);
  const [day, setDay] = useState("MONDAY");

  const [result, setResult] = useState("");
  const [weather, setWeather] = useState("");
  const [suggestion, setSuggestion] = useState(null);

  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/stations/?format=json");
        if (res.data.stations) {
          setStations(res.data.stations);
          if (res.data.stations.length > 0) setStation(res.data.stations[0]);
        }
      } catch (error) {
        console.log("Station loading error:", error);
      }
    };
    loadStations();
  }, []);

  const predictCrowd = async () => {
    if (!station) return;
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/predict/", { train, station, day }, { withCredentials: true });
      setResult(response.data.predicted_crowd);
      setWeather(response.data.weather);
      setSuggestion(response.data.suggested_train || null);
    } catch (error) {
      console.error("Prediction Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line
  useEffect(() => {
    const autoRefresh = setInterval(() => {
      if (station) predictCrowd();
    }, 30000);
    return () => clearInterval(autoRefresh);
  }, [station, train, day]);

  const crowdColors = {
    HIGH:   { color: "#f87171", icon: "🔴", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)" },
    MEDIUM: { color: "#fb923c", icon: "🟡", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.25)" },
    LOW:    { color: "#4ade80", icon: "🟢", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)" },
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #020617 0%, #0b1424 40%, #0f2040 100%)",
      fontFamily: "'DM Sans', sans-serif",
      color: "white",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background grid pattern */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      {/* Ambient blobs */}
      <div style={{
        position: "fixed", top: "-200px", right: "-200px", width: "600px", height: "600px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-150px", left: "-150px", width: "500px", height: "500px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── NAVBAR ── */}
      <Navbar />

      {/* ── MAIN CONTENT ── */}
      <div className="rr-main-grid" style={{
        maxWidth: "1260px", margin: "0 auto", padding: "108px 30px 40px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px",
        position: "relative", zIndex: 1,
      }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Hero text */}
          <div className="card-anim" style={{ animation: "floatUp 0.6s ease forwards" }}>
            <h1 className="rr-hero-title" style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "72px", lineHeight: "1.0", fontWeight: 700, marginBottom: "16px",
            }}>
              Smart<br />
              <span style={{
                background: "linear-gradient(90deg,#0ea5e9,#38bdf8,#818cf8)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "gradientShift 4s ease infinite",
              }}>Crowd</span><br />
              Prediction.
            </h1>
            <p style={{ opacity: 0.65, fontSize: "17px", lineHeight: "1.8", maxWidth: "380px" }}>
              Live Mumbai railway crowd prediction, smart train suggestions and real-time station insights.
            </p>
          </div>

          {/* Clock card */}
          <div className="card-anim scan-container" style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(14,165,233,0.15)",
            borderRadius: "20px", padding: "24px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
            animation: "floatUp 0.6s 0.1s ease both",
          }}>
            <p style={{ fontSize: "12px", letterSpacing: "2px", opacity: 0.5, marginBottom: "8px" }}>CURRENT TIME</p>
            <h2 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "42px", fontWeight: 700,
              color: "#38bdf8", letterSpacing: "2px",
              textShadow: "0 0 30px rgba(56,189,248,0.5)",
            }}>
              {time.toLocaleTimeString()}
            </h2>
            <p style={{ fontSize: "12px", opacity: 0.4, marginTop: "4px" }}>
              {time.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Weather card */}
          {weather && (
            <div style={{
              background: "rgba(250,204,21,0.06)",
              border: "1px solid rgba(250,204,21,0.2)",
              borderRadius: "20px", padding: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.4s ease forwards",
            }}>
              <p style={{ fontSize: "12px", letterSpacing: "2px", opacity: 0.5, marginBottom: "8px" }}>WEATHER</p>
              <h2 style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "32px", color: "#fde68a", fontWeight: 700,
                textShadow: "0 0 20px rgba(252,211,77,0.4)",
              }}>🌤 {weather}</h2>
            </div>
          )}

          {/* Crowd result card */}
          {result && (() => {
            const c = crowdColors[result] || { color: "white", icon: "⚪", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" };
            return (
              <div style={{
                background: c.bg, border: `1px solid ${c.border}`,
                borderRadius: "20px", padding: "24px",
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 40px ${c.border}`,
                animation: "fadeIn 0.4s ease forwards",
              }}>
                <p style={{ fontSize: "12px", letterSpacing: "2px", opacity: 0.5, marginBottom: "8px" }}>CROWD LEVEL</p>
                <h1 style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "48px", fontWeight: 700, color: c.color,
                  textShadow: `0 0 30px ${c.color}88`,
                }}>
                  {c.icon} {result}
                </h1>
              </div>
            );
          })()}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "28px", padding: "40px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          animation: "floatUp 0.7s 0.2s ease both",
          display: "flex", flexDirection: "column", gap: "6px",
        }}>

          <h2 style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "36px", fontWeight: 700, marginBottom: "28px",
            lineHeight: "1.2",
          }}>
            Mumbai Local<br />
            <span style={{ color: "#38bdf8" }}>Tracking 🚉</span>
          </h2>

          {/* Train */}
          <label style={labelStyle}>Train Line</label>
          <select value={train} onChange={(e) => setTrain(e.target.value)}
            className="select-field" style={selectStyle}>
            <option value="CSMT_FAST">CSMT_FAST</option>
            <option value="CSMT_SLOW">CSMT_SLOW</option>
          </select>

          {/* Station */}
          <label style={labelStyle}>Station</label>
          <select value={station} onChange={(e) => setStation(e.target.value)}
            className="select-field" style={selectStyle}>
            {stations.length === 0 && <option>Loading stations...</option>}
            {stations.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>

          {/* Day */}
          <label style={labelStyle}>Day</label>
          <select value={day} onChange={(e) => setDay(e.target.value)}
            className="select-field" style={selectStyle}>
            {["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"]
              .map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          {/* Predict button */}
          <button onClick={predictCrowd} disabled={loading} className="predict-btn" style={{
            width: "100%", padding: "18px", borderRadius: "16px", border: "none",
            background: loading
              ? "rgba(14,165,233,0.3)"
              : "linear-gradient(135deg,#0ea5e9,#2563eb)",
            color: "white", fontSize: "17px", fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "8px", fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "1px",
            boxShadow: "0 4px 20px rgba(14,165,233,0.3)",
            transition: "all 0.2s ease",
            animation: !loading ? "pulseGlow 3s ease-in-out infinite" : "none",
          }}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Predicting...
              </span>
            ) : "⚡ PREDICT CROWD"}
          </button>

          {/* Suggestion card */}
          {suggestion && suggestion.train && (
            <div style={{
              marginTop: "16px",
              background: "rgba(14,165,233,0.07)",
              border: "1px solid rgba(14,165,233,0.25)",
              padding: "22px", borderRadius: "18px",
              boxShadow: "0 4px 20px rgba(14,165,233,0.15)",
              animation: "fadeIn 0.4s ease forwards",
            }}>
              <p style={{ fontSize: "11px", letterSpacing: "2px", opacity: 0.5, marginBottom: "10px" }}>BEST TRAIN SUGGESTION</p>
              <h3 style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "22px", color: "#38bdf8", fontWeight: 700, marginBottom: "10px",
              }}>🚆 {suggestion.train}</h3>
              {[
                { icon: "🕐", label: "Arrival", val: suggestion.time },
                { icon: "👥", label: "Crowd", val: suggestion.crowd },
                { icon: "⏱", label: "ETA", val: `${suggestion.minutes_left} mins` },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
                  fontSize: "14px",
                }}>
                  <span style={{ opacity: 0.6 }}>{icon} {label}</span>
                  <span style={{ fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* spinner keyframe via inline style tag trick */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle = {
  fontSize: "11px", letterSpacing: "2px", opacity: 0.5,
  marginTop: "10px", marginBottom: "6px", display: "block",
};

const selectStyle = {
  width: "100%", padding: "14px 18px",
  borderRadius: "13px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.05)",
  color: "white", fontSize: "15px", outline: "none",
  cursor: "pointer", marginBottom: "6px",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  fontFamily: "'DM Sans', sans-serif",
};

export default Home;
