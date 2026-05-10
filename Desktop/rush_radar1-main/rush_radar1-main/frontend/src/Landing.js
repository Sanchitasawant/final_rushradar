import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Rajdhani:wght@600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .landing-wrapper {
          min-height: 100vh;
          background: #020617;
          color: #ffffff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* Abstract Glow & Grid Background */
        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: 
            linear-gradient(rgba(0, 198, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 198, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black, transparent 80%);
        }

        .glow-orb {
          position: absolute; border-radius: 50%; filter: blur(80px);
          z-index: 0; opacity: 0.4; animation: floatOrb 10s infinite ease-in-out alternate;
        }
        .orb-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: rgba(0, 198, 255, 0.15); animation-delay: 0s; }
        .orb-2 { top: 40%; right: -20%; width: 60vw; height: 60vw; background: rgba(0, 114, 255, 0.12); animation-delay: -5s; }

        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 50px) scale(1.1); }
        }

        /* Navbar */
        .landing-nav {
          position: fixed; top: 0; left: 0; right: 0; height: 80px; padding: 0 5%;
          display: flex; justify-content: space-between; align-items: center;
          z-index: 100; transition: all 0.3s ease; background: transparent;
        }
        .landing-nav.scrolled {
          background: rgba(2, 6, 23, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .brand-logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .brand-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, #00C6FF, #0072FF);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; box-shadow: 0 0 20px rgba(0, 198, 255, 0.4);
        }
        .brand-text {
          font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 24px; letter-spacing: 1px;
          background: linear-gradient(90deg, #ffffff, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .nav-btn {
          padding: 10px 24px; border-radius: 12px; font-weight: 600; font-size: 14px;
          cursor: pointer; transition: all 0.3s ease; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .btn-login {
          background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.2);
        }
        .btn-login:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); }
        .btn-register {
          background: linear-gradient(135deg, #00C6FF, #0072FF); color: white; border: none;
          box-shadow: 0 4px 15px rgba(0, 114, 255, 0.3);
        }
        .btn-register:hover {
          transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 198, 255, 0.5);
        }

        /* Hero */
        .hero-section {
          position: relative; z-index: 10; min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center; padding: 140px 5% 50px;
        }
        
        .hero-badge {
          background: rgba(0, 198, 255, 0.1); border: 1px solid rgba(0, 198, 255, 0.2);
          color: #00C6FF; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;
          letter-spacing: 1px; margin-bottom: 30px; animation: fadeUp 1s ease both;
          box-shadow: 0 0 20px rgba(0, 198, 255, 0.2);
        }

        .hero-title {
          font-size: clamp(40px, 6vw, 80px); font-weight: 800; line-height: 1.1; margin-bottom: 24px;
          letter-spacing: -1px; animation: fadeUp 1s 0.2s ease both;
        }
        .hero-title-gradient {
          background: linear-gradient(90deg, #00C6FF, #0072FF, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-size: 200% auto; animation: shine 4s linear infinite;
        }

        .hero-subtitle {
          font-size: clamp(16px, 2vw, 20px); color: rgba(255,255,255,0.6); max-width: 600px;
          margin-bottom: 40px; line-height: 1.6; animation: fadeUp 1s 0.4s ease both;
        }

        .hero-cta {
          display: flex; gap: 16px; justify-content: center; animation: fadeUp 1s 0.6s ease both; flex-wrap: wrap;
        }
        .btn-primary {
          padding: 16px 36px; border-radius: 14px; font-size: 16px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(135deg, #00C6FF, #0072FF); color: #fff; border: none;
          cursor: pointer; transition: all 0.3s; box-shadow: 0 10px 30px rgba(0, 114, 255, 0.3);
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(0, 198, 255, 0.5); }
        .btn-secondary {
          padding: 16px 36px; border-radius: 14px; font-size: 16px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
          background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer; transition: all 0.3s; backdrop-filter: blur(10px);
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); transform: translateY(-3px); }

        /* Glass Dashboard Preview */
        .hero-preview-wrapper {
          margin-top: 60px; width: 100%; max-width: 1000px; animation: fadeUp 1s 0.8s ease both, floatY 6s ease-in-out infinite;
          perspective: 1000px;
        }
        .hero-preview {
          width: 100%; height: 450px; border-radius: 24px; background: rgba(11, 20, 36, 0.6);
          border: 1px solid rgba(0, 198, 255, 0.2); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 40px rgba(0, 198, 255, 0.1);
          overflow: hidden; position: relative; display: flex; flex-direction: column;
        }
        .preview-header {
          height: 40px; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; padding: 0 20px; gap: 8px;
        }
        .preview-dot { width: 10px; height: 10px; border-radius: 50%; }
        .preview-body {
          flex: 1; padding: 30px; display: grid; grid-template-columns: 1fr 2fr; gap: 20px;
        }
        .preview-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px; padding: 20px;
        }
        .preview-bar { height: 12px; border-radius: 6px; background: rgba(255,255,255,0.1); margin-top: 12px; overflow: hidden; position: relative; }
        .preview-fill { height: 100%; background: linear-gradient(90deg, #00C6FF, #0072FF); width: 65%; animation: fillBar 3s ease-out infinite alternate;}

        /* Stats */
        .stats-section {
          padding: 80px 5%; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(2,6,23,0.5); position: relative; z-index: 10;
        }
        .stats-grid { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 40px; max-width: 1100px; margin: 0 auto; }
        .stat-item { text-align: center; }
        .stat-num { font-size: 54px; font-weight: 800; color: #fff; margin-bottom: 8px; font-family: 'Rajdhani', sans-serif;}
        .stat-label { font-size: 14px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; font-weight: 600;}

        /* Features Section */
        .features-section { padding: 120px 5%; max-width: 1200px; margin: 0 auto; position: relative; z-index: 10; }
        .section-title { font-size: 40px; font-weight: 800; text-align: center; margin-bottom: 60px; letter-spacing: -1px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .feature-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(10px);
          border-radius: 24px; padding: 40px; transition: all 0.4s ease; cursor: default; position: relative; overflow: hidden;
        }
        .feature-card::before {
          content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at top right, rgba(0, 198, 255, 0.1), transparent 70%); opacity: 0; transition: opacity 0.4s ease;
        }
        .feature-card:hover { transform: translateY(-5px); border-color: rgba(0, 198, 255, 0.3); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .feature-card:hover::before { opacity: 1; }
        .feature-icon {
          width: 64px; height: 64px; border-radius: 16px; background: rgba(0, 198, 255, 0.1); color: #00C6FF;
          display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 24px; border: 1px solid rgba(0, 198, 255, 0.2);
        }

        /* Footer */
        .footer { padding: 40px 5%; text-align: center; color: rgba(255,255,255,0.4); font-size: 14px; position: relative; z-index: 10; border-top: 1px solid rgba(255,255,255,0.05); background: rgba(2,6,23,0.9); }

        /* Animations */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shine { to { background-position: 200% center; } }
        @keyframes floatY { 0%, 100% { transform: translateY(0) rotateX(2deg); } 50% { transform: translateY(-15px) rotateX(0deg); } }
        @keyframes fillBar { 0% { width: 30%; } 100% { width: 85%; } }

        @media (max-width: 768px) {
          .hero-title { font-size: 36px !important; }
          .hero-preview { height: 300px; }
          .preview-body { grid-template-columns: 1fr; }
          .stat-num { font-size: 40px; }
        }
      `}</style>

      <div className="grid-bg" />
      <div className="glow-orb orb-1" />
      <div className="glow-orb orb-2" />

      {/* Sticky Navbar */}
      <nav className={`landing-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="brand-logo">
          <div className="brand-icon">🚆</div>
          <span className="brand-text">RUSH RADAR</span>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <button className="nav-btn btn-login" onClick={() => navigate("/login")}>Login</button>
          <button className="nav-btn btn-register" onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">🚀 THE FUTURE OF RAILWAY COMMUTE</div>
        <h1 className="hero-title">
          Mumbai Railway Intelligence.<br />
          <span className="hero-title-gradient">Reimagined.</span>
        </h1>
        <p className="hero-subtitle">
          Experience state-of-the-art predictive analytics and real-time crowd tracking.
          Navigate the Mumbai local network with military precision.
        </p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Start Free Trial
          </button>
          <button className="btn-secondary" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>

        {/* Floating Dashboard Preview */}
        <div className="hero-preview-wrapper">
          <div className="hero-preview">
            <div className="preview-header">
              <span className="preview-dot" style={{ background: "#ef4444" }}/>
              <span className="preview-dot" style={{ background: "#eab308" }}/>
              <span className="preview-dot" style={{ background: "#22c55e" }}/>
              <span style={{ marginLeft: "12px", fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Analytics Dashboard - Live Feed</span>
            </div>
            <div className="preview-body">
              <div className="preview-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>Live Crowd Density</div>
                <div style={{ fontSize: "36px", fontWeight: "800", color: "#00C6FF", fontFamily: "'Rajdhani', sans-serif" }}>HIGH</div>
                <div className="preview-bar"><div className="preview-fill" /></div>
              </div>
              <div className="preview-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Next Train: Western Line</div>
                  <div style={{ fontSize: "18px", fontWeight: "600", color: "#fff", marginTop: "4px" }}>Churchgate Fast - 10:45 AM</div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Prediction AI Status</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#22c55e" }}>System Optimal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-num">8M+</div>
            <div className="stat-label">Daily Riders Tracked</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">99</div>
            <div className="stat-label">Stations Monitored</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">465</div>
            <div className="stat-label">Active Trains</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">99.9%</div>
            <div className="stat-label">Prediction Accuracy</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Rush Radar?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📡</div>
            <h3 style={{ fontSize: "22px", marginBottom: "12px", fontWeight: "700" }}>Real-time Tracking</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.7", fontSize: "15px" }}>
              Get live crowd density updates across all major stations before you leave your home. Make informed commuting decisions instantly.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3 style={{ fontSize: "22px", marginBottom: "12px", fontWeight: "700" }}>AI Crowd Prediction</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.7", fontSize: "15px" }}>
              Our proprietary ML models analyze weather, time, and historical data to accurately forecast future crowd levels at any hour.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 style={{ fontSize: "22px", marginBottom: "12px", fontWeight: "700" }}>Advanced Analytics</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.7", fontSize: "15px" }}>
              Dive deep into commuter trends, peak hour distributions, and route optimizations with our enterprise-grade dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "linear-gradient(135deg, #00C6FF, #0072FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>🚆</div>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "18px", letterSpacing: "1px", color: "#fff" }}>RUSH RADAR</span>
        </div>
        <p>© 2026 Rush Radar Inc. All rights reserved. Built for the Mumbai Railway Network.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
