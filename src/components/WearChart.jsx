import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


export default function WearChart({ lapHistory}) {
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
	      value: "Wear %",
	      angle: -90,
	      position: "insideLeft",
	    }}
	  />

	  <Tooltip />

	  <Line
	    type="monotone"
	    dataKey="wear"
	    stroke="#ff3b30"
	    strokeWidth={3}
	    dot={{ r:4}}
	  />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
