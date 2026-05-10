import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: radial-gradient(900px 520px at 12% 8%, rgba(0, 198, 255, 0.10), transparent 55%),
                radial-gradient(900px 520px at 92% 18%, rgba(0, 114, 255, 0.12), transparent 55%),
                linear-gradient(160deg, #020617 0%, #0b1424 42%, #071a36 100%);
    font-family: 'Plus Jakarta Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    color: rgba(255,255,255,0.86);
  }

  /* ── Shell ── */
  .shell {
    display: flex;
    min-height: 100vh;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 220px;
    flex-shrink: 0;
    background: #1a2235;
    display: flex;
    flex-direction: column;
    padding: 28px 0 24px;
    position: fixed;
    top: 68px; left: 0; bottom: 0;
    z-index: 99;
  }

  .sidebar-logo {
    padding: 0 24px 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 20px;
  }

  .logo-mark {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-icon {
    width: 32px; height: 32px;
    background: #2563eb;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }

  .logo-text {
    font-size: 13px;
    font-weight: 700;
    color: #e8edf5;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .logo-sub {
    font-size: 10px;
    font-weight: 400;
    color: #4a5a78;
    letter-spacing: 0.02em;
  }

  .nav-section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #2e3d58;
    padding: 0 24px 8px;
    font-weight: 500;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 24px;
    font-size: 13px;
    font-weight: 500;
    color: #4a5a78;
    cursor: pointer;
    transition: all 0.15s;
    border-left: 3px solid transparent;
  }

  .nav-item:hover { color: #8ea4c8; background: rgba(255,255,255,0.03); }

  .nav-item.active {
    color: #e8edf5;
    background: rgba(37,99,235,0.12);
    border-left-color: #2563eb;
  }

  .nav-icon { font-size: 15px; }

  .sidebar-footer {
    margin-top: auto;
    padding: 16px 24px 0;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .live-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.2);
    border-radius: 8px;
    padding: 8px 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #22c55e;
    letter-spacing: 0.08em;
  }

  .live-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #22c55e;
    animation: pulse 1.8s ease-in-out infinite;
  }

  /* ── Main ── */
  .main {
    margin-left: 220px;
    margin-top: 68px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* ── Topbar ── */
  .topbar {
    background: #ffffff;
    border-bottom: 1px solid #e2e6ed;
    padding: 0 36px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
  }

  .breadcrumb-root { color: #9aa5b8; font-weight: 500; }
  .breadcrumb-sep  { color: #c8d0db; font-size: 11px; }
  .breadcrumb-page { color: #1a1f2e; font-weight: 600; }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .timestamp {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #9aa5b8;
    letter-spacing: 0.04em;
  }

  .refresh-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f0f2f5;
    border: 1px solid #e2e6ed;
    border-radius: 7px;
    padding: 7px 13px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #4a5470;
    cursor: pointer;
    transition: background 0.15s;
  }

  .refresh-btn:hover { background: #e6e9ef; }

  /* ── Page body ── */
  .page-body {
    padding: 32px 36px 48px;
    animation: fadeUp 0.4s ease both;
  }

  .page-head {
    margin-bottom: 28px;
  }

  .page-title {
    font-size: 20px;
    font-weight: 800;
    color: #1a1f2e;
    letter-spacing: -0.02em;
  }

  .page-sub {
    font-size: 13px;
    color: #7a8499;
    margin-top: 3px;
    font-weight: 400;
  }

  /* ── KPI cards ── */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .kpi-card {
    background: #ffffff;
    border: 1px solid #e2e6ed;
    border-radius: 12px;
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: box-shadow 0.2s, border-color 0.2s;
  }

  .kpi-card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    border-color: #c8d0db;
  }

  .kpi-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .kpi-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9aa5b8;
    font-weight: 500;
  }

  .kpi-icon {
    width: 30px; height: 30px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }

  .kpi-icon.blue   { background: #eff6ff; }
  .kpi-icon.red    { background: #fff1f1; }
  .kpi-icon.green  { background: #f0fdf4; }
  .kpi-icon.amber  { background: #fffbeb; }

  .kpi-value {
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    color: #1a1f2e;
  }

  .kpi-value.red   { color: #dc2626; }
  .kpi-value.green { color: #16a34a; }
  .kpi-value.amber { color: #d97706; }

  .kpi-footer {
    font-size: 11px;
    color: #9aa5b8;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* ── Chart panels ── */
  .chart-panel {
    background: #ffffff;
    border: 1px solid #e2e6ed;
    border-radius: 12px;
    margin-bottom: 20px;
    overflow: hidden;
    transition: box-shadow 0.2s;
  }

  .chart-panel:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }

  .chart-panel:last-child { margin-bottom: 0; }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 24px;
    border-bottom: 1px solid #f0f2f5;
  }

  .panel-title-group {}

  .panel-title {
    font-size: 14px;
    font-weight: 700;
    color: #1a1f2e;
    letter-spacing: -0.01em;
  }

  .panel-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #b0bac8;
    margin-top: 2px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .panel-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 5px;
  }

  .badge-live    { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .badge-updated { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

  .chart-body {
    padding: 20px 24px 24px;
  }

  /* ── Loading ── */
  .loading {
    height: 100vh;
    background: #f0f2f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
  }

  .spin {
    width: 34px; height: 34px;
    border: 2px solid #e2e6ed;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #9aa5b8;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const makeChartOpts = (label) => ({
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 4,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1a1f2e",
      borderColor: "#2e3a52",
      borderWidth: 1,
      titleColor: "#7a8fb0",
      bodyColor: "#e8edf5",
      titleFont: { family: "'JetBrains Mono', monospace", size: 10 },
      bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13, weight: "700" },
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        title: (i) => i[0].label,
        label: (i) => `  ${label}: ${i.formattedValue}`
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: "#b0bac8",
        font: { family: "'JetBrains Mono', monospace", size: 10 },
        maxRotation: 30,
        minRotation: 0
      },
      grid: { display: false },
      border: { color: "#e8ecf2" }
    },
    y: {
      ticks: {
        color: "#b0bac8",
        font: { family: "'JetBrains Mono', monospace", size: 10 },
        maxTicksLimit: 5
      },
      grid: { color: "#f0f2f5" },
      border: { color: "transparent" }
    }
  }
});

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });
}

function Dashboard() {
  const [stationData, setStationData] = useState(null);
  const [peakData,    setPeakData]    = useState(null);
  const [time,        setTime]        = useState(getCurrentTime());
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  useEffect(() => {
    const el = document.createElement("style");
    el.innerHTML = styles;
    document.head.appendChild(el);
    const tick = setInterval(() => setTime(getCurrentTime()), 1000);
    return () => { document.head.removeChild(el); clearInterval(tick); };
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/crowd-stats/").then(res => {
      setStationData({
        labels: res.data.stations,
        datasets: [{
          label: "Crowd Level",
          data: res.data.crowd,
          backgroundColor: "#2563eb",
          hoverBackgroundColor: "#1d4ed8",
          borderRadius: 4,
          barThickness: 32
        }]
      });
    });

    axios.get("http://localhost:8000/api/peak-hours/").then(res => {
      setPeakData({
        labels: res.data.times,
        datasets: [{
          label: "Peak Frequency",
          data: res.data.counts,
          backgroundColor: "#2563eb",
          hoverBackgroundColor: "#1d4ed8",
          borderRadius: 4,
          barThickness: 32
        }]
      });
    });
  }, []);

  if (!stationData || !peakData) {
    return (
      <div className="loading">
        <div className="spin" />
        <p className="loading-text">Connecting to data feed…</p>
      </div>
    );
  }

  return (
    <div className="shell">
      <Navbar />

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">🚆</div>
            <div>
              <div className="logo-text">MR Analytics</div>
              <div className="logo-sub">Operations Center</div>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="live-chip" style={{marginBottom:"12px"}}>
            <span className="live-dot" />
            Live Feed Active
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main">

        {/* Topbar */}
        <header className="topbar">
          <div className="breadcrumb">
            <span className="breadcrumb-root">Mumbai Railway</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-page">Analytics Dashboard</span>
          </div>
          <div className="topbar-right">
            <span className="timestamp">🕐 {time}</span>
            <button className="refresh-btn">↻ Refresh</button>
          </div>
        </header>

        {/* Page body */}
        <div className="page-body">
          <div className="page-head">
            <h1 className="page-title">Operations Overview</h1>
            <p className="page-sub">Real-time crowd levels, rush hours and train insights across all corridors</p>
          </div>

          {/* KPI row */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Stations</span>
                <div className="kpi-icon blue">🚉</div>
              </div>
              <div className="kpi-value">42</div>
              <div className="kpi-footer">Western + Central lines</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Peak Rush</span>
                <div className="kpi-icon red">⚡</div>
              </div>
              <div className="kpi-value red">HIGH</div>
              <div className="kpi-footer">Above normal threshold</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Active Trains</span>
                <div className="kpi-icon green">🚆</div>
              </div>
              <div className="kpi-value green">126</div>
              <div className="kpi-footer">All corridors operational</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Avg Delay</span>
                <div className="kpi-icon amber">⏱️</div>
              </div>
              <div className="kpi-value amber">5m</div>
              <div className="kpi-footer">Network average</div>
            </div>
          </div>

          {/* Charts */}
          <div className="chart-panel">
            <div className="panel-header">
              <div className="panel-title-group">
                <p className="panel-title">Crowd Analytics — Per Station</p>
                <p className="panel-meta">Passenger density · Current window</p>
              </div>
              <div className="panel-controls">
                <span className="badge badge-live">● Live</span>
              </div>
            </div>
            <div className="chart-body">
              <Bar data={stationData} options={makeChartOpts("Crowd Level")} />
            </div>
          </div>

          <div className="chart-panel">
            <div className="panel-header">
              <div className="panel-title-group">
                <p className="panel-title">Peak Hour Detection — Frequency</p>
                <p className="panel-meta">Hourly distribution · Today's report</p>
              </div>
              <div className="panel-controls">
                <span className="badge badge-updated">Updated</span>
              </div>
            </div>
            <div className="chart-body">
              <Bar data={peakData} options={makeChartOpts("Frequency")} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
