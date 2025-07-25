import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RawEmployeeStats {
  period: string;
  total_awards?: number | string;
  total_badges?: number | string;
  total_recognitions?: number | string;
}

interface AggregatedStats {
  month: string;
  total_awards: number;
  total_badges: number;
  total_recognitions: number;
}

interface Props {
  chartData: RawEmployeeStats[];
  timePeriod: string[];
}

const AllEmployeeChartWithIcons: React.FC<Props> = ({ chartData, timePeriod }) => {
  const monthlyMap = new Map<string, AggregatedStats>();

  chartData.forEach(item => {
    const month = item.period;
    const awards = Number(item.total_awards ?? 0);
    const badges = Number(item.total_badges ?? 0);
    const recognitions = Number(item.total_recognitions ?? 0);

    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, {
        month,
        total_awards: awards,
        total_badges: badges,
        total_recognitions: recognitions,
      });
    } else {
      const existing = monthlyMap.get(month)!;
      existing.total_awards += awards;
      existing.total_badges += badges;
      existing.total_recognitions += recognitions;
    }
  });

const now = new Date();
const last12Months: string[] = [];

for (let i = timePeriod.length - 1; i >= 0; i--) {
  const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
  const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  last12Months.push(monthKey);

  if (!monthlyMap.has(monthKey)) {
    monthlyMap.set(monthKey, {
      month: monthKey,
      total_awards: 0,
      total_badges: 0,
      total_recognitions: 0,
    });
  }
}

// Step 3: Build aggregatedData in order of last12Months
const aggregatedData: AggregatedStats[] = last12Months.map(month => monthlyMap.get(month)!);


  const chartLabels = aggregatedData.map(item =>
    new Date(item.month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' })
  );

  const awards = aggregatedData.map(item => item.total_awards);
  const badges = aggregatedData.map(item => item.total_badges);
  const recognitions = aggregatedData.map(item => item.total_recognitions);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Total Awards',
        data: awards,
        tension: 0,
        fill: true,
        borderColor: "#585DF9",
        backgroundColor: "#585DF9",
        borderWidth: 2,
        pointRadius: 3,
      },
      {
        label: 'Total Badges',
        data: badges,
        tension: 0,
        fill: true,
        borderColor: "#eac435",
        backgroundColor: "#eac435",
        borderWidth: 2,
        pointRadius: 3,
      },
      {
        label: 'Total Recognitions',
        data: recognitions,
        borderColor: "#e40066",
        backgroundColor: "#e40066",
        borderWidth: 2,
        pointRadius: 3,
        tension: 0,
        fill: true,
      },
    ],
  };

  const suggestedMax =
    Math.ceil(
      Math.max(...data.datasets.flatMap((dataset: any) => dataset.data))
    ) + 1;

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 15,
          usePointStyle: false,
          padding: 10,
          color: "#666666",
        },
      },
      title: {
        display: true,
        text: 'Employee Awards, Badges & Recognitions',
        font: {
          size: 16,
          weight: 'bold',
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
        suggestedMax: suggestedMax,
        ticks: {
          callback: function (value: any) {
            return Number(value).toFixed(0);
          },
          stepSize: 1,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className='w-full flex justify-center items-center h-[400px]'>
      <Line data={data} options={options} />
    </div>
  );
};

export default AllEmployeeChartWithIcons;
