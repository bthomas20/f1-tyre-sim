import { useState } from "react";

export default function App() {
  const [track, setTrack] = useState("Bahrain");
  const [compound, setCompound] = useState("Medium");
  const [laps, setLaps] = useState(10);
  const [weather, setWeather] = useState("Dry");
  const [trackTemp, setTrackTemp] = useState(35);

  const trackData = {
    Bahrain: {
      factor: 1.5,
      map: "🇧🇭 Bahrain International Circuit",
    },
    Monaco: {
      factor: 0.7,
      map: "🇲🇨 Circuit de Monaco",
    },
    Silverstone: {
      factor: 1.3,
      map: "🇬🇧 Silverstone Circuit",
    },
    Spa: {
      factor: 1.1,
      map: "🇧🇪 Spa-Francorchamps",
    },
  };

  const compoundFactors = {
    Soft: 1.4,
    Medium: 1.0,
    Hard: 0.8,
  };

  const weatherFactors = {
    Dry: 1.0,
    Damp: 0.85,
    Wet: 0.65,
  };

  const tempFactor = trackTemp > 40 ? 1.2 : trackTemp < 25 ? 0.9 : 1.0;

  const wear =
    laps *
    trackData[track].factor *
    compoundFactors[compound] *
    weatherFactors[weather] *
    tempFactor;

  const gripRemaining = Math.max(100 - wear, 0);

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <h2>Filters</h2>

        <label>Track</label>
        <select value={track} onChange={(e) => setTrack(e.target.value)}>
          <option>Bahrain</option>
          <option>Monaco</option>
          <option>Silverstone</option>
          <option>Spa</option>
        </select>

        <label>Tire Compound</label>
        <select value={compound} onChange={(e) => setCompound(e.target.value)}>
          <option>Soft</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <label>Laps</label>
        <input
          type="number"
          value={laps}
          onChange={(e) => setLaps(Number(e.target.value))}
        />

        <label>Weather</label>
        <select value={weather} onChange={(e) => setWeather(e.target.value)}>
          <option>Dry</option>
          <option>Damp</option>
          <option>Wet</option>
        </select>

        <label>Track Temp °C</label>
        <input
          type="number"
          value={trackTemp}
          onChange={(e) => setTrackTemp(Number(e.target.value))}
        />
      </aside>

      <main style={styles.main}>
        <h1>F1 Tire Degradation Simulator</h1>

        <div style={styles.mapBox}>
          <h2>Track Map</h2>
          <div style={styles.fakeMap}>{trackData[track].map}</div>
        </div>

        <div style={styles.results}>
          <h2>Results</h2>
          <p>Estimated Tire Wear: {wear.toFixed(1)}%</p>
          <p>Grip Remaining: {gripRemaining.toFixed(1)}%</p>
          <p>Track: {track}</p>
          <p>Compound: {compound}</p>
          <p>Weather: {weather}</p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#111827",
    color: "white",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "280px",
    padding: "24px",
    backgroundColor: "#020617",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  main: {
    flex: 1,
    padding: "40px",
  },
  mapBox: {
    backgroundColor: "#1f2937",
    padding: "24px",
    borderRadius: "12px",
    marginBottom: "24px",
  },
  fakeMap: {
    height: "260px",
    border: "2px dashed #64748b",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },
  results: {
    backgroundColor: "#1f2937",
    padding: "24px",
    borderRadius: "12px",
    fontSize: "20px",
  },
};
