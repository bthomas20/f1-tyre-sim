import { useRef, useState } from "react";
import "./App.css";
import BahrainTrack from "./components/BahrainTrack";

const BAHRAIN_TURN_DATA = {
  1: {
    type: "Tight right-hander",
    entrySpeed: 325,
    apexSpeed: 85,
    exitSpeed: 150,
    braking: "Very high",
    tyreStress: "High",
  },
  2: {
    type: "Fast left kink",
    entrySpeed: 150,
    apexSpeed: 145,
    exitSpeed: 185,
    braking: "Low",
    tyreStress: "Medium",
  },
  3: {
    type: "Fast right kink",
    entrySpeed: 185,
    apexSpeed: 180,
    exitSpeed: 235,
    braking: "Low",
    tyreStress: "Medium",
  },
  4: {
    type: "Heavy-braking right",
    entrySpeed: 300,
    apexSpeed: 105,
    exitSpeed: 165,
    braking: "Very high",
    tyreStress: "High",
  },
  5: {
    type: "Fast left",
    entrySpeed: 245,
    apexSpeed: 220,
    exitSpeed: 225,
    braking: "Low",
    tyreStress: "High",
  },
  6: {
    type: "Fast right",
    entrySpeed: 225,
    apexSpeed: 205,
    exitSpeed: 195,
    braking: "Medium",
    tyreStress: "High",
  },
  7: {
    type: "Medium-speed left",
    entrySpeed: 195,
    apexSpeed: 150,
    exitSpeed: 180,
    braking: "Medium",
    tyreStress: "High",
  },
  8: {
    type: "Tight right-hander",
    entrySpeed: 245,
    apexSpeed: 90,
    exitSpeed: 145,
    braking: "High",
    tyreStress: "Medium",
  },
  9: {
    type: "Long left entry",
    entrySpeed: 215,
    apexSpeed: 165,
    exitSpeed: 145,
    braking: "Medium",
    tyreStress: "High",
  },
  10: {
    type: "Downhill left hairpin",
    entrySpeed: 145,
    apexSpeed: 80,
    exitSpeed: 135,
    braking: "High",
    tyreStress: "Very high",
  },
  11: {
    type: "Medium-speed left",
    entrySpeed: 285,
    apexSpeed: 175,
    exitSpeed: 205,
    braking: "High",
    tyreStress: "High",
  },
  12: {
    type: "Fast right",
    entrySpeed: 205,
    apexSpeed: 195,
    exitSpeed: 240,
    braking: "Low",
    tyreStress: "High",
  },
  13: {
    type: "Uphill right-hander",
    entrySpeed: 245,
    apexSpeed: 135,
    exitSpeed: 190,
    braking: "High",
    tyreStress: "Medium",
  },
  14: {
    type: "Final braking zone",
    entrySpeed: 305,
    apexSpeed: 120,
    exitSpeed: 165,
    braking: "Very high",
    tyreStress: "High",
  },
  15: {
    type: "Flat-out exit bend",
    entrySpeed: 165,
    apexSpeed: 175,
    exitSpeed: 285,
    braking: "None",
    tyreStress: "Medium",
  },
};


export default function App() {
  const [track, setTrack] = useState("Bahrain");
  const [compound, setCompound] = useState("Medium");
  const [laps, setLaps] = useState(10);
  const [weather, setWeather] = useState("Dry");
  const [trackTemp, setTrackTemp] = useState(35);
  const [selectedTurn, setSelectedTurn] = useState(null);

  const MIN_ZOOM = 0.65;
  const DEFAULT_ZOOM = 0.82;
  const MAX_ZOOM = 2.5;

  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const trackData = {
    Bahrain: {
      factor: 1.5,
      component: BahrainTrack,
      circuitName: "Bahrain International Circuit",
      location: "Sakhir, Bahrain",
      turns: 15,
      length: "5.412 km",
    },
    Monaco: {
      factor: 0.7,
      component: null,
      circuitName: "Circuit de Monaco",
      location: "Monte Carlo, Monaco",
      turns: 19,
      length: "3.337 km",
    },
    Silverstone: {
      factor: 1.3,
      component: null,
      circuitName: "Silverstone Circuit",
      location: "Silverstone, United Kingdom",
      turns: 18,
      length: "5.891 km",
    },
    Spa: {
      factor: 1.1,
      component: null,
      circuitName: "Circuit de Spa-Francorchamps",
      location: "Stavelot, Belgium",
      turns: 19,
      length: "7.004 km",
    },
  };

  const compoundFactors = {
    Soft: 1.4,
    Medium: 1,
    Hard: 0.8,
  };

  const weatherFactors = {
    Dry: 1,
    Damp: 0.85,
    Wet: 0.65,
  };

  const tempFactor =
    trackTemp > 40 ? 1.2 : trackTemp < 25 ? 0.9 : 1;

  const wear =
    laps *
    trackData[track].factor *
    compoundFactors[compound] *
    weatherFactors[weather] *
    tempFactor;

  const gripRemaining = Math.max(100 - wear, 0);
  const ActiveTrackComponent = trackData[track].component;
  const selectedTurnData =
    track === "Bahrain" && selectedTurn
      ? BAHRAIN_TURN_DATA[selectedTurn]
      : null;

  const getCondition = () => {
    if (gripRemaining >= 75) return "OPTIMAL";
    if (gripRemaining >= 45) return "WORN";
    return "CRITICAL";
  };

  const getCompoundClass = () => compound.toLowerCase();

  const resetMap = () => {
    setZoom(DEFAULT_ZOOM);
    setPosition({ x: 0, y: 0 });
  };

  const handleTrackChange = (event) => {
    setTrack(event.target.value);
    setSelectedTurn(null);
    resetMap();
  };

  const handleWheel = (event) => {
    event.preventDefault();

    const nextZoom =
      event.deltaY < 0
        ? Math.min(zoom + 0.1, MAX_ZOOM)
        : Math.max(zoom - 0.1, MIN_ZOOM);

    setZoom(nextZoom);

    if (nextZoom <= DEFAULT_ZOOM) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (event) => {
    if (event.target.closest(".turn-marker")) return;

    setIsDragging(true);
    dragStart.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    setPosition({
      x: event.clientX - dragStart.current.x,
      y: event.clientY - dragStart.current.y,
    });
  };

  const stopDragging = () => setIsDragging(false);

  const zoomIn = () => {
    setZoom((currentZoom) =>
      Math.min(currentZoom + 0.2, MAX_ZOOM)
    );
  };

  const zoomOut = () => {
    setZoom((currentZoom) => {
      const nextZoom = Math.max(currentZoom - 0.2, MIN_ZOOM);

      if (nextZoom <= DEFAULT_ZOOM) {
        setPosition({ x: 0, y: 0 });
      }

      return nextZoom;
    });
  };

  return (
    <div className="app">
      <header className="top-header">
        <div className="brand">
          <span className="brand-marker">F1</span>

          <div>
            <h1>Tyre Degradation Simulator</h1>
            <p>Race strategy and tyre-performance analysis</p>
          </div>
        </div>

        <div className="live-status">
          <span className="status-light"></span>
          SIMULATION LIVE
        </div>
      </header>

      <section className="filter-panel">
        <div className="filter-group">
          <label htmlFor="track">Track</label>
          <select id="track" value={track} onChange={handleTrackChange}>
            <option value="Bahrain">Bahrain</option>
            <option value="Monaco">Monaco</option>
            <option value="Silverstone">Silverstone</option>
            <option value="Spa">Spa-Francorchamps</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="compound">Tyre compound</label>
          <select
            id="compound"
            value={compound}
            onChange={(event) => setCompound(event.target.value)}
          >
            <option value="Soft">Soft</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="laps">Stint laps</label>
          <input
            id="laps"
            type="number"
            min="1"
            max="70"
            value={laps}
            onChange={(event) =>
              setLaps(Math.max(1, Number(event.target.value)))
            }
          />
        </div>

        <div className="filter-group">
          <label htmlFor="weather">Weather</label>
          <select
            id="weather"
            value={weather}
            onChange={(event) => setWeather(event.target.value)}
          >
            <option value="Dry">Dry</option>
            <option value="Damp">Damp</option>
            <option value="Wet">Wet</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="temperature">Track temperature</label>
          <div className="number-input">
            <input
              id="temperature"
              type="number"
              min="0"
              max="70"
              value={trackTemp}
              onChange={(event) =>
                setTrackTemp(Number(event.target.value))
              }
            />
            <span>°C</span>
          </div>
        </div>
      </section>

      <main className="dashboard">
        <section className="track-section">
          <div className="section-heading">
            <div>
              <span className="section-label">ACTIVE CIRCUIT</span>
              <h2>{trackData[track].circuitName}</h2>
              <p>{trackData[track].location}</p>
            </div>

            <div className="map-controls">
              <button type="button" onClick={zoomOut} aria-label="Zoom out">
                −
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={zoomIn} aria-label="Zoom in">
                +
              </button>
              <button
                type="button"
                className="reset-button"
                onClick={resetMap}
              >
                Reset
              </button>
            </div>
          </div>

          <div
            className={`map-viewport ${isDragging ? "dragging" : ""}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
          >
            {ActiveTrackComponent ? (
              <div
                className="interactive-track"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                }}
              >
                <ActiveTrackComponent
                  selectedTurn={selectedTurn}
                  onSelectTurn={setSelectedTurn}
                />
              </div>
            ) : (
              <div className="map-placeholder">
                <span>TRACK SVG UNAVAILABLE</span>
                <h3>{trackData[track].circuitName}</h3>
                <p>Add this circuit component later inside src/components.</p>
              </div>
            )}

            {ActiveTrackComponent && (
              <>
                <div className="map-corner top-left"></div>
                <div className="map-corner top-right"></div>
                <div className="map-corner bottom-left"></div>
                <div className="map-corner bottom-right"></div>

                <div className="circuit-readout circuit-readout-left">
                  <span>TURNS</span>
                  <strong>{trackData[track].turns}</strong>
                </div>

                <div className="circuit-readout circuit-readout-right">
                  <span>LENGTH</span>
                  <strong>{trackData[track].length}</strong>
                </div>

                {selectedTurn && (
                  <div className="selected-turn-readout">
                    SELECTED TURN <strong>{selectedTurn}</strong>
                  </div>
                )}

                <div className="map-instructions">
                  Click a turn · Scroll to zoom · Drag to move
                </div>
              </>
            )}
          </div>
        </section>

        <aside className="telemetry-panel">
          <div className="telemetry-heading">
            <span>TYRE TELEMETRY</span>
            <strong>{getCondition()}</strong>
          </div>

          <div className="tyre-display">
            <div className={`tyre-ring ${getCompoundClass()}`}>
              <div>
                <span>{compound.charAt(0)}</span>
                <small>{compound}</small>
              </div>
            </div>
          </div>

          <div className="metric">
            <div className="metric-header">
              <span>Estimated wear</span>
              <strong>{wear.toFixed(1)}%</strong>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill wear-fill"
                style={{ width: `${Math.min(wear, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="metric">
            <div className="metric-header">
              <span>Grip remaining</span>
              <strong>{gripRemaining.toFixed(1)}%</strong>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill grip-fill"
                style={{ width: `${gripRemaining}%` }}
              ></div>
            </div>
          </div>

          <div className="data-grid">
            <div className="data-box">
              <span>Track</span>
              <strong>{track}</strong>
            </div>

            <div className="data-box">
              <span>Compound</span>
              <strong>{compound}</strong>
            </div>

            <div className="data-box">
              <span>Weather</span>
              <strong>{weather}</strong>
            </div>

            <div className="data-box">
              <span>Temperature</span>
              <strong>{trackTemp}°C</strong>
            </div>

            <div className="data-box">
              <span>Stint</span>
              <strong>{laps} laps</strong>
            </div>

            <div className="data-box">
              <span>Wear factor</span>
              <strong>{trackData[track].factor.toFixed(1)}x</strong>
            </div>
          </div>

          <div className="turn-analysis">
            <div className="turn-analysis-heading">
              <span>TURN ANALYSIS</span>
              <strong>
                {selectedTurn ? `T${selectedTurn}` : "SELECT A TURN"}
              </strong>
            </div>

            {selectedTurnData ? (
              <>
                <div className="turn-type">
                  <span>CORNER TYPE</span>
                  <strong>{selectedTurnData.type}</strong>
                </div>

                <div className="turn-data-grid">
                  <div className="turn-data-box">
                    <span>Entry speed</span>
                    <strong>{selectedTurnData.entrySpeed} km/h</strong>
                  </div>

                  <div className="turn-data-box">
                    <span>Apex speed</span>
                    <strong>{selectedTurnData.apexSpeed} km/h</strong>
                  </div>

                  <div className="turn-data-box">
                    <span>Exit speed</span>
                    <strong>{selectedTurnData.exitSpeed} km/h</strong>
                  </div>

                  <div className="turn-data-box">
                    <span>Braking</span>
                    <strong>{selectedTurnData.braking}</strong>
                  </div>

                  <div className="turn-data-box turn-data-box-wide">
                    <span>Tyre stress</span>
                    <strong>{selectedTurnData.tyreStress}</strong>
                  </div>
                </div>
              </>
            ) : (
              <p className="turn-analysis-empty">
                Click a numbered corner on the circuit to inspect its
                speed, braking demand, and tyre stress.
              </p>
            )}
          </div>

          <div className="strategy-message">
            <span>ENGINEER NOTE</span>
            <p>
              {gripRemaining >= 75 &&
                "Tyres remain inside the optimal performance window."}

              {gripRemaining < 75 &&
                gripRemaining >= 45 &&
                "Performance is beginning to fall. Monitor lap times."}

              {gripRemaining < 45 &&
                "Grip loss is critical. A pit stop should be considered."}
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
