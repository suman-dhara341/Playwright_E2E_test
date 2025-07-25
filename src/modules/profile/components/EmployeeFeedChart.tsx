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
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";
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
  chartData: { month: string; total_feeds: number }[];
  timePeriod: string[];
  feedIsLoading: boolean;
  feedIsError: boolean;
}

const EmployeeFeedChart = ({
  chartData,
  timePeriod,
  feedIsLoading,
  feedIsError,
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
    return match ? match.total_feeds : 0;
  });

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Total Feeds",
        data: labelFormattedData,
        borderColor: "#0acf83",
        backgroundColor: "#0acf83",
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  // Determine max Y-axis value
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
        text: "Total Feed Over Time",
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
          display: false,
        },
      },
      y: {
        type: "linear" as const,
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
          callback: (value: number) => value.toFixed(0),
        },
        suggestedMax,
      },
    },
  };

  if (feedIsLoading) {
    return (
      <div className="flex justify-center items-center w-[49%] h-[300px] p-3 mb-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (feedIsError) {
    return (
      <div className="flex justify-center items-center w-[49%] h-[300px] p-3 mb-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  return (
    <div
      className="bg-white border-1 rounded-md border-[#E8E8EC] w-[49%] h-[300px] p-3"
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

export default EmployeeFeedChart;
