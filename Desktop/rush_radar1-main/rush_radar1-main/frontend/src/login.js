import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const navigate = useNavigate();

  // Reset form on mount — blocks browser autofill restore
  useEffect(() => {
    setData({ username: "", password: "" });
  }, []);

  const validateField = (name, value) => {
    let error = "";
    if (name === "username") {
      if (!value) error = "Username/Email is required";
      else if (value.length < 3) error = "Must be at least 3 characters";
    }
    if (name === "password") {
      if (!value) error = "Password is required";
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === "";
  };

  const validateAll = () => {
    const isUserValid = validateField("username", data.username);
    const isPassValid = validateField("password", data.password);
    return isUserValid && isPassValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    setApiError("");
    setApiSuccess("");
    if (errors[name]) validateField(name, value);
  };

  const handleBlur = (e) => validateField(e.target.name, e.target.value);

  const handleSubmit = async () => {
    setApiError("");
    setApiSuccess("");
    if (!validateAll()) return;

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/login/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );
      setApiSuccess(res.data.message || "Login successful!");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", res.data.username || "Admin");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setApiError(err.response.data.error || err.response.data.message || "Login failed.");
      } else {
        setApiError("Server not reachable. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setApiError("");
    setApiSuccess("");
    if (!validateAll()) return;

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/admin-login/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setApiSuccess(res.data?.message || "Admin login successful");
      setTimeout(() => window.location.href = "http://localhost:8000/admin/", 1000);
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.error || err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username", icon: "👤", placeholder: "Enter email or username", type: "text",     autoComplete: "off"          },
    { name: "password", icon: "🔒", placeholder: "Enter password", type: "password", autoComplete: "new-password" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #020617 0%, #0b1424 40%, #071a36 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      overflow: "hidden",
      position: "relative",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      {/* Ambient blobs */}
      <div style={{
        position: "fixed", top: "-180px", right: "-180px",
        width: "560px", height: "560px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-140px", left: "-140px",
        width: "480px", height: "480px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,198,255,0.09) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes trainSway {
          0%,100% { transform: translateX(-6px); }
          50%      { transform: translateX(6px); }
        }
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes gradShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes dotPulse {
          0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,255,136,0.5); }
          50%      { opacity: 0.7; box-shadow: 0 0 0 6px rgba(0,255,136,0); }
        }
        @keyframes pulseBtn {
          0%,100% { box-shadow: 0 8px 30px rgba(0,114,255,0.35); }
          50%      { box-shadow: 0 8px 50px rgba(0,198,255,0.55), 0 0 80px rgba(0,114,255,0.2); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-card { animation: fadeUp 0.75s ease both; }

        .rr-input {
          width: 100%;
          padding: 15px 18px 15px 50px;
          border-radius: 14px;
          background: rgba(255,255,255,0.06);
          color: white;
          font-size: 15px;
          outline: none;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.25s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .rr-input::placeholder { color: rgba(255,255,255,0.35); }
        .rr-input:focus {
          border-color: rgba(0,198,255,0.55);
          background: rgba(0,198,255,0.07);
          box-shadow: 0 0 0 4px rgba(0,198,255,0.1), 0 4px 20px rgba(0,0,0,0.3);
        }

        .rr-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #00C6FF, #0072FF);
          background-size: 200% 100%;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
          letter-spacing: 0.5px;
          font-family: 'Rajdhani', sans-serif;
          animation: pulseBtn 3s ease-in-out infinite;
          transition: transform 0.2s ease;
          max-width: 420px;
          min-height: 52px;
        }
        .rr-btn:hover { transform: translateY(-2px); }
        .rr-btn:active { transform: scale(0.98); }
        .rr-btn:disabled { opacity: 0.6; cursor: not-allowed; animation: none; transform: none; box-shadow: none; }

        .msg-box {
          padding: 12px 16px; border-radius: 12px; font-size: 14px; font-weight: 500;
          display: flex; alignItems: center; gap: 8px; margin-bottom: 16px;
          animation: fadeUp 0.3s ease;
        }
        .msg-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }
        .msg-success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #86efac; }

        .home-btn {
          padding: 9px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.8);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          backdrop-filter: blur(10px);
          min-height: 44px;
        }
        .rr-input::placeholder { color: rgba(255,255,255,0.42); }
        .rr-btn:focus-visible,
        .home-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 4px rgba(0,198,255,0.18);
        }
        .home-btn:hover {
          background: rgba(0,198,255,0.12);
          color: #38bdf8;
          border-color: rgba(0,198,255,0.3);
          transform: translateY(-1px);
        }

        .scan-wrap { position: relative; overflow: hidden; }
        .scan-wrap::after {
          content: '';
          position: absolute;
          left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,198,255,0.5), transparent);
          animation: scanLine 4s linear infinite;
        }

        @media(max-width:900px) {
          .right-panel { display: none !important; }
          .login-card { max-width: 480px !important; }
          .left-panel { padding: 2.5rem !important; }
        }
      `}</style>

      {/* CARD */}
      <div className="login-card" style={{
        width: "min(1060px, 100%)",
        minHeight: 620,
        borderRadius: 32,
        overflow: "hidden",
        display: "flex",
        position: "relative",
        zIndex: 5,
        backdropFilter: "blur(20px)",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}>

        {/* ── LEFT PANEL ── */}
        <div className="left-panel" style={{
          flex: 1,
          padding: "3.5rem 4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        }}>

          {/* TOP BAR */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2.5rem", gap: "1rem", flexWrap: "wrap",
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 15,
                background: "linear-gradient(135deg,#00C6FF,#0072FF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24,
                boxShadow: "0 8px 25px rgba(0,114,255,0.45), 0 0 0 1px rgba(0,198,255,0.2)",
                animation: "trainSway 3s ease-in-out infinite",
              }}>🚆</div>
              <div>
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "1.4rem", fontWeight: 700,
                  background: "linear-gradient(90deg,#38bdf8,#818cf8)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  letterSpacing: "1px",
                }}>RUSH RADAR</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "1.5px" }}>
                  MUMBAI RAILWAY INTELLIGENCE
                </div>
              </div>
            </div>

            <button className="home-btn" onClick={() => navigate("/")}>
              ← Back to Home
            </button>
          </div>

          {/* HEADING */}
          <h1 style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 3.4rem)",
            lineHeight: 1.0, fontWeight: 700,
            color: "white", marginBottom: "1rem",
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
          }}>
            Welcome<br />
            <span style={{
              background: "linear-gradient(135deg,#00C6FF,#0072FF,#38bdf8)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "gradShift 4s ease infinite",
            }}>back.</span>
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.55)",
            marginBottom: "2.2rem",
            lineHeight: 1.85,
            fontSize: 15,
            maxWidth: 400,
          }}>
            Access live train crowd tracking, smart travel updates and
            real-time Mumbai railway insights.
          </p>

          {/* MESSAGES */}
          {apiError && (
            <div className="msg-box msg-error">
              <span>⚠️</span> {apiError}
            </div>
          )}
          {apiSuccess && (
            <div className="msg-box msg-success">
              <span>✅</span> {apiSuccess}
            </div>
          )}

          {/* FIELDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 420, marginBottom: "1rem" }}>
            {/* Honeypot to block browser autofill */}
            <input type="text" name="fake_user" style={{ display: "none" }} readOnly />
            <input type="password" name="fake_pass" style={{ display: "none" }} readOnly />

            {fields.map(({ name, icon, placeholder, type, autoComplete }) => {
              const hasError = !!errors[name];
              const isValid = data[name] && !hasError;
              return (
                <div key={name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute", left: 17, top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 17,
                      opacity: focused === name ? 1 : 0.45,
                      transition: "opacity 0.2s",
                      pointerEvents: "none",
                    }}>{icon}</span>
                    <input
                      className="rr-input"
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      value={data[name]}
                      onChange={handleChange}
                      onFocus={() => setFocused(name)}
                      onBlur={handleBlur}
                      autoComplete={autoComplete}
                      style={{
                        borderColor: hasError ? "rgba(239,68,68,0.5)" : isValid ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.1)",
                        boxShadow: hasError ? "0 0 0 4px rgba(239,68,68,0.1)" : isValid ? "0 0 0 4px rgba(34,197,94,0.1)" : "none",
                      }}
                    />
                    {isValid && (
                      <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#4ade80", fontSize: 14 }}>
                        ✓
                      </span>
                    )}
                  </div>
                  {hasError && (
                    <span style={{ color: "#fca5a5", fontSize: 13, marginLeft: 6, animation: "fadeUp 0.2s ease" }}>
                      {errors[name]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* BUTTON */}
          <button className="rr-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span style={{
                  width: 16, height: 16,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  display: "inline-block",
                }} />
                Signing in...
              </span>
            ) : "⚡ SIGN IN"}
          </button>

          {/* ADMIN LOGIN */}
          <button
            className="home-btn"
            onClick={handleAdminLogin}
            disabled={loading}
            style={{
              marginTop: "0.9rem",
              width: "100%",
              maxWidth: 420,
              padding: "12px 18px",
              borderRadius: 14,
            }}
          >
            Login as Admin
          </button>

          {/* REGISTER LINK */}
          <div style={{
            marginTop: "1.6rem", textAlign: "center",
            color: "rgba(255,255,255,0.45)", fontSize: 14,
          }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{ color: "#00C6FF", cursor: "pointer", fontWeight: 600 }}
            >Register</span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel scan-wrap" style={{
          width: 420,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(160deg, #081420, #0B2545 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
        }}>

          <img
            src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1200&auto=format&fit=crop"
            alt="train"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.25,
            }}
          />

          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(7,17,32,0.97), rgba(7,17,32,0.4))",
          }} />

          <div style={{
            position: "relative", zIndex: 3,
            textAlign: "center", padding: "2rem",
            animation: "floatY 5s ease-in-out infinite",
          }}>

            <div style={{
              width: 90, height: 90, borderRadius: 26,
              background: "linear-gradient(135deg,#00C6FF22,#0072FF22)",
              border: "1px solid rgba(0,198,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "3rem", margin: "0 auto 1.5rem",
              boxShadow: "0 0 40px rgba(0,198,255,0.2), 0 20px 40px rgba(0,0,0,0.4)",
            }}>🚆</div>

            <h2 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "2rem", color: "white",
              fontWeight: 700, marginBottom: "1rem", lineHeight: 1.2,
              textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}>
              Mumbai Local<br />Smart Tracking
            </h2>

            <p style={{
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.85, fontSize: 14, maxWidth: 260, margin: "0 auto",
            }}>
              Track rush hours, discover station insights and travel smarter
              with real-time railway analytics.
            </p>

            {/* Stats */}
            <div style={{
              display: "flex", gap: 12, justifyContent: "center",
              marginTop: "2rem",
            }}>
              {[
                { val: "120+", label: "Stations" },
                { val: "Live", label: "Updates" },
                { val: "Smart", label: "AI Picks" },
              ].map(({ val, label }) => (
                <div key={label} style={{
                  padding: "10px 14px", borderRadius: 12,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}>
                  <div style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: 18, fontWeight: 700, color: "#38bdf8",
                  }}>{val}</div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Live badge */}
            <div style={{
              marginTop: "1.5rem",
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 50,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white", fontSize: 13,
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", background: "#00ff88",
                animation: "dotPulse 1.5s ease-in-out infinite",
              }} />
              Live Railway Updates
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
