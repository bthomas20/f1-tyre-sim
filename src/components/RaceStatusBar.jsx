export default function RaceStatusBar({
  currentLap,
  laps,
  compound,
  wear,
  grip,
  latestLapTime,
  formatLapTime,
}) {

  return (
    <div className="race-status-bar">
      <div className="status-item">
        <span>Lap</span>
        <strong>{currentLap}/{laps}</strong>
      </div>

      <div className="status-item">
        <span>COMPOUND</span>
        <strong>{compound}</strong>
      </div>

      <div className="status-item">
        <span>WEAR</span>
	<strong>{wear.toFixed(1)}%</strong>
      </div>

      <div className="status-item">
	<span>GRIP</span>
	<strong>{grip.toFixed(1)}%</strong>
      </div>

      <div className="status-item">
	<span>LAST LAP</span>
	<strong>
	  {latestLapTime ? formatLapTime(latestLapTime) : "--"}
	</strong>
      </div>
    </div>
  );
}
