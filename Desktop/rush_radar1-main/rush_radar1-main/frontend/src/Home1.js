import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function LandingPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const a = (delay) =>
    visible
      ? { animation: `fadeUp .4s ${delay}s ease both`, animationFillMode: "both" }
      : { opacity: 0 };

  return (
    <div style={{ minHeight: "100vh", background: "#0F1923", fontFamily: "'DM Sans', sans-serif", color: "#E8E0D0" }}>

      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes trainRoll { 0%{transform:translateX(-420px)} 100%{transform:translateX(110vw)} }
        @keyframes wheelSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes smokeRise { 0%{opacity:.5;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-22px) scale(1.6)} }

        .rr-btn-ghost {
          background: transparent; border: 1px solid rgba(11,37,69,.25);
          color: #0B2545; font-family: 'DM Sans', sans-serif;
          transition: all .2s ease;
        }
        .rr-btn-ghost:hover { border-color: #0B2545; background: rgba(11,37,69,.06); }

        .rr-btn-solid {
          background: #0B2545; border: 1px solid #0B2545;
          color: #E8E0D0; font-family: 'DM Sans', sans-serif;
          transition: all .2s ease;
        }
        .rr-btn-solid:hover { background: #0d2d59; transform: translateY(-1px); }

        .rr-cta-main {
          background: #E8E0D0; color: #0B2545; border: none;
          font-family: 'DM Sans', sans-serif; transition: all .2s ease;
        }
        .rr-cta-main:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,224,208,.1); }

        .rr-cta-sub {
          background: transparent; color: rgba(232,224,208,.45);
          border: 1px solid rgba(232,224,208,.15);
          font-family: 'DM Sans', sans-serif; transition: all .2s ease;
        }
        .rr-cta-sub:hover { color: #E8E0D0; border-color: rgba(232,224,208,.35); }

        .rr-wheel { animation: wheelSpin .4s linear infinite; }
        .rr-smoke1 { animation: smokeRise 1.2s ease-out infinite; }
        .rr-smoke2 { animation: smokeRise 1.2s .4s ease-out infinite; }
      `}</style>

      {/* ── NAVBAR — only Login & Register ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 2.5rem", height: 58,
        background: "#E8E0D0", borderBottom: "1px solid rgba(15,25,35,.08)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#0F1923", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🚆</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: "#0B2545" }}>Rush Radar</span>
        </div>

        {/* Only Login + Register here — Timetable & Dashboard shown after login */}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="rr-btn-ghost" onClick={() => navigate("/login")}
            style={{ padding: "7px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            Login
          </button>
          <button className="rr-btn-solid" onClick={() => navigate("/register")}
            style={{ padding: "7px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            Register
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        minHeight: "calc(100vh - 58px)", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "2rem", textAlign: "center", position: "relative", overflow: "hidden",
      }}>

        {/* subtle grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(232,224,208,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,224,208,.03) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* ── TRACK ── */}
        <div style={{ position: "absolute", bottom: "22%", left: 0, right: 0, height: 18, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(232,224,208,.1)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(232,224,208,.1)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", gap: 18, alignItems: "center" }}>
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} style={{ width: 10, minWidth: 10, height: "100%", background: "rgba(232,224,208,.07)", flexShrink: 0 }} />
            ))}
          </div>
        </div>

        {/* ── TRAIN ── */}
        <div style={{ position: "absolute", bottom: "calc(22% + 18px)", left: 0, animation: "trainRoll 8s linear infinite" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>

            {/* Engine */}
            <div style={{ width: 72, height: 38, background: "#E8E0D0", borderRadius: "6px 10px 0 0", position: "relative" }}>
              <div style={{ position: "absolute", top: -10, left: 12, width: 8, height: 10, background: "#d4ccc0", borderRadius: "2px 2px 0 0" }}>
                <div className="rr-smoke1" style={{ position: "absolute", top: -12, left: -2, width: 12, height: 12, borderRadius: "50%", background: "rgba(232,224,208,.25)" }} />
                <div className="rr-smoke2" style={{ position: "absolute", top: -10, left: 3, width: 9, height: 9, borderRadius: "50%", background: "rgba(232,224,208,.2)" }} />
              </div>
              <div style={{ position: "absolute", top: 7, left: 10, width: 18, height: 12, background: "#0F1923", borderRadius: 3, opacity: .7 }} />
              <div style={{ position: "absolute", right: -12, top: 6, width: 14, height: 28, background: "#d4ccc0", borderRadius: "0 6px 4px 0" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: "rgba(15,25,35,.15)" }} />
              <div style={{ position: "absolute", bottom: -6, left: 0, right: 0, display: "flex", justifyContent: "space-around" }}>
                {[0,1,2].map(i => <div key={i} className="rr-wheel" style={{ width: 10, height: 10, borderRadius: "50%", background: "#0F1923", border: "2px solid rgba(232,224,208,.5)" }} />)}
              </div>
            </div>

            {/* Coaches */}
            {[[8,24,40],[8,24,40],[8,24]].map((wins, ci) => (
              <div key={ci} style={{ width: 58, height: 32, background: "rgba(232,224,208,.9)", borderRadius: 4, position: "relative" }}>
                {wins.map(l => (
                  <div key={l} style={{ position: "absolute", top: 7, left: l, width: 10, height: 10, background: "#0F1923", borderRadius: 2, opacity: .55 }} />
                ))}
                <div style={{ position: "absolute", bottom: -6, left: 0, right: 0, display: "flex", justifyContent: "space-evenly" }}>
                  {[0,1].map(i => <div key={i} className="rr-wheel" style={{ width: 10, height: 10, borderRadius: "50%", background: "#0F1923", border: "2px solid rgba(232,224,208,.5)" }} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* live dot */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: "1.4rem", fontSize: 11, letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(232,224,208,.35)", ...a(0) }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(232,224,208,.4)", animation: "blink 2s ease infinite" }} />
          Mumbai Local · Live
        </div>

        {/* Headline — minimal wording */}
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2.4rem,5vw,3.8rem)", fontWeight: 800, lineHeight: 1.08, color: "#E8E0D0", marginBottom: "2.2rem", ...a(0.1) }}>
          Know before<br />
          <span style={{ color: "rgba(232,224,208,.22)" }}>you board.</span>
        </h1>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 10, ...a(0.2) }}>
          <button className="rr-cta-main" onClick={() => navigate("/register")}
            style={{ padding: "12px 30px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Get started
          </button>
          <button className="rr-cta-sub" onClick={() => navigate("/login")}
            style={{ padding: "12px 30px", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            Sign in
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.8rem", marginTop: "3rem", ...a(0.3) }}>
          {[{ n: "8M+", l: "daily riders" }, null, { n: "465", l: "trains" }, null, { n: "99", l: "stations" }].map((s, i) =>
            s === null
              ? <div key={i} style={{ width: 1, height: 28, background: "rgba(232,224,208,.1)" }} />
              : <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#E8E0D0" }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: "rgba(232,224,208,.28)", letterSpacing: ".5px", marginTop: 1 }}>{s.l}</div>
                </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default LandingPage;
