import { useContext } from "react";
import { HabitsContexts } from "./HabitContent";
import { calculateSummaryStats } from "./utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";


export default function Analytics() {
  const { habits, activeBoxes } = useContext(HabitsContexts);



            // for the graph
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const chartData = daysOfWeek.map((day, colIndex) => {
    const totalHabits = habits.length || 1;
    const completed = activeBoxes.filter((row) => row[colIndex]).length;
    const completionRate = Math.round((completed / totalHabits) * 100);

    return { day, completed, completionRate };
  });

  const stats = calculateSummaryStats(habits, activeBoxes);
 
  return (
    <main className="analytics">
      <h1>Analytics</h1>
      <div className="summary-stats">
        <div className="stat-card">
          <h3>Total Habits</h3>
          <p>{stats.totalHabits}</p>
        </div>
        <div className="stat-card">
          <h3>Completion Rate</h3>
          <p>{stats.completionRate}%</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>
            {stats.completedCount}/{stats.totalBoxes}
          </p>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completionRate" fill="#8884d8" name="Completion %" />
            <Bar dataKey="completed" fill="#82ca9d" name="Completed Habits" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
