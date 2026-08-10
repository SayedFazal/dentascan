import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendChartProps {
  data: number[];
  labels: string[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Plaque Level',
        data,
        borderColor: '#0EA5A8',
        backgroundColor: 'rgba(14, 165, 168, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#0EA5A8',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    scales: {
      y: {
        min: 0,
        max: 3,
        ticks: {
          stepSize: 1,
          callback: (value: any) => {
            if (value === 1) return 'Low';
            if (value === 2) return 'Med';
            if (value === 3) return 'High';
            return '';
          },
        },
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="sleek-card h-64 flex flex-col">
      <h3 className="font-bold mb-4">7-Day Plaque Trend</h3>
      <div className="flex-1 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TrendChart;
