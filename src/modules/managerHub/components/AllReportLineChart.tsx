import { Line } from "react-chartjs-2";
import { subMonths, format } from "date-fns";
import { useGetAllAreaWiseReportQuery } from "../../profile/queries/profileQuery";
import { useSelector } from "react-redux";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";

const COLORS = [
  "#FF6384", // Bright Pink
  "#36A2EB", // Light Blue
  "#FFCE56", // Bright Yellow
  "#4BC0C0", // Light Teal
  "#9966FF", // Light Purple
  "#FF9F40", // Orange
  "#E7E9ED", // Light Gray
  "#7D3C98", // Bright Purple
  "#FFB6C1", // Light Pink
  "#FFD700", // Gold
  "#32CD32", // Lime Green
  "#FF4500", // Orange Red
  "#00FA9A", // Medium Spring Green
];

const getLastSixMonths = () => {
  const months = [];
  for (let i = 0; i < 6; i++) {
    const date = subMonths(new Date(), i);
    months.unshift(format(date, "yyyy-MM"));
  }
  return months;
};

const transformData = (data: any) => {
  const lastSixMonths = getLastSixMonths();
  const datasets = data.map((area: any, index: number) => ({
    label: area.areaName,
    data: lastSixMonths.map(
      (month) => area.monthlyData[month]?.grandPercentage || 0
    ),
    borderColor: COLORS[index % COLORS.length],
    backgroundColor: "white",
    borderWidth: 2,
    tension: 0,
  }));

  const labels = lastSixMonths.map((month) =>
    format(new Date(`${month}-01`), "MMM yyyy")
  );

  return { labels, datasets };
};

const AllReportLineChart = () => {
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const sixMonthsAgo = subMonths(new Date(), 6).toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  const { data, isLoading, isError } = useGetAllAreaWiseReportQuery({
    ORG_ID,
    EMP_ID,
    DATE_ONE: sixMonthsAgo,
    DATE_TWO: today,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-145px)] p-3 mb-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-145px)] p-3 mb-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  const chartData = transformData(data?.data || []);

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            align: "start",
            labels: {
              usePointStyle: true,
              pointStyle: "rect",
              boxWidth: 12,
              boxHeight: 12,
              padding: 10,
              generateLabels: (chart: any) => {
                return chart.data.datasets.map((dataset: any, i: number) => ({
                  text: dataset.label,
                  fillStyle: dataset.borderColor,
                  strokeStyle: dataset.borderColor,
                  lineWidth: 2,
                  hidden: !chart.isDatasetVisible(i),
                  index: i,
                  pointStyle: "rect",
                }));
              },
            },
          },
          title: {
            display: true,
            text: "Grand Percentage by Area",
            font: {
              size: 16,
              weight: "bold",
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
            grid: {
              display: false,
            },
          },
        },
      }}
      height={200}
    />
  );
};

export default AllReportLineChart;
