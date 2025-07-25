import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import Error from "../../../utilities/Error";
import Loading from "../../../utilities/Loading";
import { useMemo } from "react";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

interface ChartProps {
  chartData: { month: string; total_badges: number }[];
  timePeriod: string[];
  badgeIsLoading: boolean;
  badgeIsError: boolean;
}

const EmployeeBadgeChart = ({
  chartData,
  timePeriod,
  badgeIsLoading,
  badgeIsError,
}: ChartProps) => {
  const chartLabels = useMemo(() => {
    const now = new Date();
    const labels: string[] = [];

    for (let i = timePeriod.length - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      labels.push(label);
    }

    return labels;
  }, [timePeriod]);
  const labelFormattedData = timePeriod.map((label) => {
    const match = chartData.find(
      (item) =>
        new Date(item.month).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }) === label
    );
    return match ? match.total_badges : 0;
  });

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Total Badges",
        data: labelFormattedData,
        borderColor: "#eac435",
        backgroundColor: "#eac435",
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const suggestedMax =
    Math.ceil(
      Math.max(...data.datasets.flatMap((dataset: any) => dataset.data))
    ) + 1;

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          boxWidth: 15,
          usePointStyle: false,
          padding: 10,
          color: "#666666",
        },
      },
      title: {
        display: true,
        text: "Total Badge Over Time",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#3F4354",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // 🔥 remove x-axis grid lines
        },
      },
      y: {
        type: "linear" as const,
        beginAtZero: true,
        grid: {
          display: false, // 🔥 remove y-axis grid lines
        },
        ticks: {
          stepSize: 1,
          callback: (value: number) => value.toFixed(0),
        },
        suggestedMax,
      },
    },
  };

  if (badgeIsLoading) {
    return (
      <div className="flex justify-center items-center w-[49%] h-[300px] p-3 mb-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (badgeIsError) {
    return (
      <div className="flex justify-center items-center w-[49%] h-[300px] p-3 mb-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-md w-[49%] h-[300px] p-3"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      {chartData.length !== 0 ? (
        <Line data={data} options={options} />
      ) : (
        <div className="flex justify-center items-center h-[280px]">
          <p className="text-[#73737D]">No data available</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeBadgeChart;
