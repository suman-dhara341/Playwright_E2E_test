import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  title: string;
  value: number;
  percentage: string;
  data: { value: number }[];
  color: string;
  height?:number
}

const BadgeAnalyticsChart = ({ title, value, percentage, data, color ,height=40}: ChartProps) => {
  return (
    <div className="border-1 border-[#E8E8EC] rounded-md w-full p-2">
      <p className="text-[13px] text-[#000000B2] !font-semibold mb-2">{title}</p>
      <div className='flex justify-between items-center'>
        <p className="text-xl font-bold">{value}</p>
        <div className={`!text-xs`} style={{ color }}>{percentage}</div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <Tooltip cursor={{ stroke: color, strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BadgeAnalyticsChart;
