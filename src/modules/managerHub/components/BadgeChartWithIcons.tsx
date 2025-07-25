import { useMemo } from "react";
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

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const BadgeChartWithIcons = ({ chartData, timePeriod }: any) => {
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

  const groupedData = chartData.reduce((acc: any, employee: any) => {
    const { employee_id, period, employee_name, employeePhoto, total_badges } =
      employee;
    const [year, month] = period.split("-").map(Number);
    const monthLabel = new Date(year, month - 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    const monthIndex = chartLabels.indexOf(monthLabel);
    if (monthIndex === -1) return acc;

    if (!acc[employee_id]) {
      acc[employee_id] = {
        employee_name,
        employeePhoto,
        monthlyBadges: Array(12).fill(0),
      };
    }

    acc[employee_id].monthlyBadges[monthIndex] += parseInt(total_badges, 10);
    return acc;
  }, {});

  const colors = [
    "#585df9",
    "#fb4d3d",
    "#0acf83",
    "#e40066",
    "#eac435",
    "#a23e48",
  ];

  const data = {
    labels: chartLabels,
    datasets: Object.values(groupedData)
      .filter((employee: any) =>
        employee.monthlyBadges.some((badge: number) => badge > 0)
      )
      .map((employee: any, index: number) => ({
        label: employee.employee_name,
        data: employee.monthlyBadges,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length],
        borderWidth: 2,
        pointRadius: 0,
        profileImage: employee.employeePhoto,
      })),
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
        text: "Total Badges Over Time",
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
        grid: { display: false },
      },
      y: {
        type: "linear" as const,
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          stepSize: 1,
          callback: (value: number) => value.toFixed(0),
        },
        suggestedMax,
      },
    },
  };

  const profileImagePlugin = {
    id: "profileImagePlugin",
    afterDraw: (chart: any) => {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        const validPoints = meta.data.filter((_point: any, index: number) => {
          return (
            dataset.data[index] !== null && dataset.data[index] !== undefined
          );
        });

        if (validPoints.length > 0 && meta.hidden !== true) {
          const lastPoint = validPoints[validPoints.length - 1];
          const { x, y } = lastPoint.getProps(["x", "y"]);
          const image = new Image();
          image.src = dataset.profileImage;

          image.onload = () => {
            const radius = 15;
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(
              image,
              x - radius,
              y - radius,
              radius * 2,
              radius * 2
            );
            ctx.restore();
          };
        }
      });
    },
  };

  return (
    <div className="relative h-[400px] w-full flex justify-center items-center">
      <Line data={data} options={options} plugins={[profileImagePlugin]} />
    </div>
  );
};

export default BadgeChartWithIcons;
