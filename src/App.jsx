import { useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [track, setTrack] = useState("Bahrain");
  const [compound, setCompound] = useState("Medium");
  const [laps, setLaps] = useState(10);
  const [weather, setWeather] = useState("Dry");
  const [trackTemp, setTrackTemp] = useState(35);

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const trackData = {
    Bahrain: {
      factor: 1.5,
      image: "/tracks/bahrain.png",
      circuitName: "Bahrain International Circuit",
      location: "Sakhir, Bahrain",
    },
    Monaco: {
      factor: 0.7,
      image: null,
      circuitName: "Circuit de Monaco",
      location: "Monte Carlo, Monaco",
    },
    Silverstone: {
      factor: 1.3,
      image: null,
      circuitName: "Silverstone Circuit",
      location: "Silverstone, United Kingdom",
    },
    Spa: {
      factor: 1.1,
      image: null,
      circuitName: "Circuit de Spa-Francorchamps",
      location: "Stavelot, Belgium",
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

  const getCondition = () => {
    if (gripRemaining >= 75) return "OPTIMAL";
    if (gripRemaining >= 45) return "WORN";
    return "CRITICAL";
  };

  const getCompoundClass = () => {
    return compound.toLowerCase();
  };

  const handleTrackChange = (event) => {
    setTrack(event.target.value);
    resetMap();
  };

  const handleWheel = (event) => {
    event.preventDefault();

    const nextZoom =
      event.deltaY < 0
        ? Math.min(zoom + 0.1, 2.5)
        : Math.max(zoom - 0.1, 1);

    setZoom(nextZoom);

    if (nextZoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (event) => {
    if (zoom <= 1) return;

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

  const stopDragging = () => {
    setIsDragging(false);
  };

  const zoomIn = () => {
    setZoom((currentZoom) => Math.min(currentZoom + 0.2, 2.5));
  };

  const zoomOut = () => {
    setZoom((currentZoom) => {
      const nextZoom = Math.max(currentZoom - 0.2, 1);

      if (nextZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }

      return nextZoom;
    });
  };

  const resetMap = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
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
          <select
            id="track"
            value={track}
            onChange={handleTrackChange}
          >
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
              <button
                type="button"
                onClick={zoomOut}
                aria-label="Zoom out"
              >
                −
              </button>

              <span>{Math.round(zoom * 100)}%</span>

              <button
                type="button"
                onClick={zoomIn}
                aria-label="Zoom in"
              >
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
            className={`map-viewport ${
              isDragging ? "dragging" : ""
            }`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
          >
            {trackData[track].image ? (
              <img
                src={trackData[track].image}
                alt={`${trackData[track].circuitName} track map`}
                draggable="false"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                }}
              />
            ) : (
              <div className="map-placeholder">
                <span>TRACK IMAGE UNAVAILABLE</span>
                <h3>{trackData[track].circuitName}</h3>
                <p>
                  Add this circuit image later inside
                  public/tracks.
                </p>
              </div>
            )}

            {trackData[track].image && (
              <div className="map-instructions">
                Scroll to zoom · Drag to move
              </div>
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
                style={{
                  width: `${Math.min(wear, 100)}%`,
                }}
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
                style={{
                  width: `${gripRemaining}%`,
                }}
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
