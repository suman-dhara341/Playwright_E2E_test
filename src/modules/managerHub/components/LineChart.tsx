import { Line } from "react-chartjs-2";
import { format, subMonths } from "date-fns";

const LineChart = ({ area }: any) => {
  const getLastSixMonths = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 6; i++) {
      const date = subMonths(currentDate, i);
      months.push(format(date, "MMM yyyy"));
    }
    return months.reverse();
  };

  const labels = getLastSixMonths();
  const dataPoints = labels.map((month) => {
    const date = new Date(month);
    const useTimeAgo = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    const monthData = area.monthlyData[useTimeAgo];
    return monthData?.grandPercentage || 0;
  });

  const generateBrightColor = () => {
    const randomBrightColor = () => Math.floor(Math.random() * 156) + 100;
    const r = randomBrightColor();
    const g = randomBrightColor();
    const b = randomBrightColor();
    return `rgb(${r}, ${g}, ${b})`;
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: `${area.areaName} - Grand Percentage`,
        data: dataPoints,
        borderColor: generateBrightColor(),
        backgroundColor: generateBrightColor(),
        tension: 0,
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: area.areaName,
        font: {
          size: 16,
          weight: 700,
        },
        color: "#3F4354",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
        grid: {
          display: false,
        },
      },
    },
  };
  
  

  return (
    <Line data={chartData} options={chartOptions} height={150} />
  );
};

export default LineChart;
