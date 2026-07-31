import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from "recharts";


export default function WearChart({
  lapHistory,
  currentLap,
}) {
  return (
    <div className="wear-chart">
      <h3>Tyre Wear History</h3>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={lapHistory}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
	    dataKey="lap"
	    label={{ value: "Lap", position:  "insideBottom", offset: -5}}
	  />

	  <YAxis
	    domain={[0,100]}
	    label={{
	      value: "Percentage",
	      angle: -90,
	      position: "insideLeft",
	    }}
	  />

	  <Tooltip />

	    formatter={(value) => [value.toFixed(1) + "%"]}

	  <Legend />

	  <ReferenceArea
	    y1={70}
	    y2={100}
	    fill="#1f8f55"
	    fillOpacity={0.12}
	  />

	  <ReferenceArea
	    y1={40}
	    y2={70}
	    fill="#d4a017"
	    fillOpacity={0.12}
	  />

	  <ReferenceArea
	    y1={0}
	    y2={40}
	    fill="#c62828"
	    fillOpacity={0.12}
	  />

	  <ReferenceLine
	    x={currentLap}
            stroke="#ffffff"
	    strokeWidth={2}
	    strokeDasharray="6 6"
	    label={{
	       value: "Current Lap",
	       position: "top",
	       fill: "#ffffff",
	    }}
	  />

	  <Line
	    type="natural"
	    dataKey="wear"
	    stroke="#ff3b30"
	    strokeWidth={3}
	    dot={{ r: 4}}
	    activeDot={{ r: 6}}
	    name="Tyre Wear"
	  />

	  <Line
	    type="natural"
	    dataKey="grip"
	    stroke="#34C759"
	    strokeWidth={3}
	    dot={{ r:4}}
	    activeDot={{ r: 6}}
	    name="Grip Remaining"
	  />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
