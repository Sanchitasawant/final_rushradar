import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const username = localStorage.getItem("username") || "User";
  const initials = username.substring(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "🏠 Home", path: "/home" },
    { label: "📋 Timetable", path: "/timetable" },
    { label: "📊 Dashboard", path: "/dashboard" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", height: "68px",
      background: "rgba(2,6,23,0.8)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* LEFT: Logo */}
      <div 
        style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} 
        onClick={() => navigate("/home")}
      >
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg,#0ea5e9,#2563eb)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", boxShadow: "0 0 15px rgba(14,165,233,0.3)",
        }}>🚆</div>
        <span style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700, fontSize: "20px", letterSpacing: "1px",
          background: "linear-gradient(90deg,#38bdf8,#818cf8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>RUSH RADAR</span>
      </div>

      {/* CENTER: Links */}
      <div style={{ display: "flex", gap: "10px" }}>
        {navLinks.map(({ label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                padding: "8px 18px", borderRadius: "10px",
                border: "1px solid " + (isActive ? "rgba(56,189,248,0.3)" : "rgba(255,255,255,0.08)"),
                background: isActive ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.05)",
                color: isActive ? "#38bdf8" : "rgba(255,255,255,0.8)",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                if(!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={e => {
                if(!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* RIGHT: User Profile */}
      <div style={{ position: "relative" }} ref={dropdownRef}>
        <div 
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "6px 14px", borderRadius: "20px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            cursor: "pointer", transition: "all 0.2s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
        >
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, color: "#000"
          }}>
            {initials}
          </div>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{username}</span>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>▼</span>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div style={{
            position: "absolute", top: "calc(100% + 10px)", right: 0,
            width: "180px", background: "rgba(15,23,42,0.95)",
            backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px", padding: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            animation: "fadeUp 0.2s ease"
          }}>
            <div style={{ padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "8px" }}>
               <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Signed in as</div>
               <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{username}</div>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                width: "100%", padding: "10px", borderRadius: "8px",
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                color: "#fca5a5", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          nav { padding: 0 16px !important; }
          .rr-navbar-links button { display: none; } /* Hide links on mobile if crowded */
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
