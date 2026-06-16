  import { useState } from "react";

  export default function App() {
    const [track, setTrack] = useState("Bahrain");
    const [compound, setCompound] = useState("Medium");
    const [laps, setLaps] = useState(10);

    const trackFactors = {
      Bahrain: 1.5,
      Monaco: 0.7,
      Silverstone: 1.3,
      Spa: 1.1,
    };

    const compoundFactors = {
      Soft: 1.4,
      Medium: 1.0,
      Hard: 0.8,
    };

    const wear = laps * trackFactors[track] * compoundFactors[compound];

    return (
      <div style={{ padding: "40px" }}>
        <h1> F1 Tire Degradation Simulator</h1>

        <h3>Track</h3>
        <select value={track} onChange={(event) => setTrack(event.target.value)}>
          <option>Bahrain</option>
          <option>Monaco</option>
          <option>Silverstone</option>
          <option>Spa</option>
        </select>

        <h3>Tire Compound</h3>
        <select value={compound} onChange={(event) => setCompound(event.target.value)}>
          <option>Soft</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <h3>Laps</h3>
        <input
          type="number"
          value={laps}
          onChange={(event) => setLaps(Number(event.target.value))}
        />

        <h2>Estimated Tire Wear: {wear.toFixed(1)}%</h2>
      </div>
     );
}
