/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { supabase } from "../../../database/supabase"; // Import your Supabase instance
import Sidebar from "../../../components/admin/Sidebar";
import Header from "../../../components/admin/Header";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EventStatistics = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("events").select("*");
      if (error) {
        setError(error.message);
        return;
      }
      processEventData(data);
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const processEventData = (events) => {
    const genreCounts = {};

    // Count events per genre
    events.forEach((event) => {
      if (event.genre) {
        genreCounts[event.genre] = (genreCounts[event.genre] || 0) + 1;
      } else {
        genreCounts["No Genre"] = (genreCounts["No Genre"] || 0) + 1;
      }
    });

    // Prepare data for chart
    const genres = Object.keys(genreCounts);
    const counts = Object.values(genreCounts);

    setChartData({
      labels: genres,
      datasets: [
        {
          label: "Number of Events",
          data: counts,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen flex bg-[#FBEBF1]">
      <Sidebar />
      <div className="flex-1">
        <Header title="Event Statistics" />
        <div className="p-6">
          <div className="p-5 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Event Statistics</h2>
            {chartData ? (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Number of Events per Genre",
                    },
                  },
                }}
              />
            ) : (
              <p>No data available to display.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventStatistics;
