import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Timetable() {
  const navigate = useNavigate();

  const [station, setStation] = useState("Dadar");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTimetable = async (selectedStation) => {

    try {

      setLoading(true);

      const response = await axios.get(
        `http://localhost:8000/api/timetable/?station=${selectedStation}`
      );

      setData(response.data);

    } catch (error) {

      console.error(error);
      alert("Failed to load timetable");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadTimetable(station);

  }, [station]);

  return (

    <>
      <Navbar />

      {/* DROPDOWN OPTION COLOR FIX */}

      <style>
        {`
          select option {
            background-color: #dbeafe;
            color: #0f172a;
          }
        `}
      </style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #020617, #0f172a, #1e293b)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "clamp(16px, 3vw, 30px)",
          paddingTop: "calc(clamp(16px, 3vw, 30px) + 68px)",
          color: "white",
          fontFamily: "Poppins"
        }}
      >

        <div
          className="tt-shell"
          style={{
            width: "100%",
            maxWidth: "1400px",
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            borderRadius: "30px",
            overflow: "hidden",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 40px rgba(0,0,0,0.5)"
          }}
        >

          {/* LEFT SIDE */}

          <div
            className="tt-left"
            style={{
              padding: "60px"
            }}
          >

            {/* LOGO */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "30px",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "18px",
                    background: "linear-gradient(135deg,#0ea5e9,#2563eb)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px"
                  }}
                >
                  🚆
                </div>

                <div>
                  <h1 style={{ margin: 0 }}>
                    Rush Radar
                  </h1>
                  <p
                    style={{
                      opacity: 0.7,
                      marginTop: "5px"
                    }}
                  >
                    Mumbai Railway Intelligence
                  </p>
                </div>
              </div>
            </div>

            {/* TITLE */}

            <h1
              style={{
                fontSize: "70px",
                lineHeight: "78px",
                marginBottom: "25px",
                fontWeight: "700"
              }}
            >
              Train
              <br />

              <span style={{ color: "#1d9bf0" }}>
                Timetable.
              </span>

            </h1>

            {/* DESCRIPTION */}

            <p
              style={{
                opacity: 0.8,
                fontSize: "20px",
                lineHeight: "35px",
                marginBottom: "45px"
              }}
            >
              Check live Mumbai local train timetable,
              station schedules and upcoming train timings.
            </p>

            {/* STATION CARD */}

            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "24px",
                padding: "30px",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >

              <h3
                style={{
                  marginBottom: "20px",
                  fontSize: "24px"
                }}
              >
                🚉 Select Station
              </h3>

              <select
                value={station}
                onChange={(e) => setStation(e.target.value)}
                style={inputStyle}
              >

                <option value="Dadar">Dadar</option>
                <option value="Thane">Thane</option>
                <option value="Kurla">Kurla</option>
                <option value="Andheri">Andheri</option>
                <option value="Bandra">Bandra</option>
                <option value="Ghatkopar">Ghatkopar</option>
                <option value="Mulund">Mulund</option>
                <option value="Borivali">Borivali</option>
                <option value="Panvel">Panvel</option>

              </select>

              {loading && (

                <p
                  style={{
                    marginTop: "18px",
                    color: "#38bdf8",
                    fontSize: "16px"
                  }}
                >
                  Loading timetable...
                </p>

              )}

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div
            style={{
              padding: "50px",
              background:
                "linear-gradient(135deg,#0f172a,#020617)"
            }}
          >

            <h1
              style={{
                marginBottom: "30px",
                fontSize: "52px",
                lineHeight: "60px"
              }}
            >
              Mumbai Local
              <br />
              Schedule 🚉
            </h1>

            {/* TABLE CONTAINER */}

            <div
              style={{
                overflowY: "auto",
                maxHeight: "700px",
                borderRadius: "24px",
                background: "rgba(255,255,255,0.05)",
                padding: "20px",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  color: "white"
                }}
              >

                {/* TABLE HEADER */}

                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10
                  }}
                >

                  <tr
                    style={{
                      background:
                        "linear-gradient(135deg,#0ea5e9,#2563eb)"
                    }}
                  >

                    <th style={thStyle}>Train</th>
                    <th style={thStyle}>Station</th>
                    <th style={thStyle}>Time</th>

                  </tr>

                </thead>

                {/* TABLE BODY */}

                <tbody>

                  {data.length > 0 ? (

                    data.map((item, index) => (

                      <tr
                        key={index}
                        style={{
                          borderBottom:
                            "1px solid rgba(255,255,255,0.08)",
                          transition: "0.3s"
                        }}
                      >

                        <td style={tdStyle}>
                          🚆 {item.train}
                        </td>

                        <td style={tdStyle}>
                          {item.station}
                        </td>

                        <td style={tdStyle}>
                          ⏰ {item.time}
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="3"
                        style={{
                          padding: "35px",
                          textAlign: "center",
                          color: "#94a3b8",
                          fontSize: "18px"
                        }}
                      >
                        No trains available
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {/* Responsive tweaks (no layout redesign) */}
        <style>{`
          @media (max-width: 980px) {
            .tt-shell {
              grid-template-columns: 1fr !important;
            }
            .tt-left {
              padding: 34px !important;
            }
          }
          @media (max-width: 520px) {
            .tt-left {
              padding: 24px !important;
            }
          }
        `}</style>

      </div>

    </>

  );

}

/* INPUT STYLE */

const inputStyle = {
  width: "100%",
  padding: "18px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: "17px",
  outline: "none",
  cursor: "pointer",
  fontWeight: "500"
};

/* TABLE HEADER STYLE */

const thStyle = {
  padding: "20px",
  textAlign: "left",
  fontSize: "18px",
  fontWeight: "600"
};

/* TABLE DATA STYLE */

const tdStyle = {
  padding: "20px",
  fontSize: "16px"
};

export default Timetable;
