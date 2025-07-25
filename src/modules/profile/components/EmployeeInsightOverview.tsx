import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Error from "../../../utilities/Error";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLazyGetAggregateAllTypesMonthOnMonthTotalsQuery } from "../../managerHub/queries/managerhubQuery";
import { setActiveTab } from "../slice/tabSlice";
import TimePeriodDropdown from "../../../common/TimePeriodOptions";
import { useParams } from "react-router-dom";
import EmployeeInsightOverviewShimmer from "./shimmer/EmployeeInsightOverviewShimmer";

const getLastMonths = (timePeriod: string) => {
  const periodMapping: Record<string, number> = {
    last3Months: 3,
    last6Months: 6,
    lastYear: 12,
  };

  const monthsToGet = periodMapping[timePeriod] || 6;
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < monthsToGet; i++) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    months.push(
      date.toLocaleString("en-US", { month: "short", year: "numeric" })
    );
  }

  return months;
};

const EmployeeInsightOverview = () => {
  const dispatch = useDispatch();
  const paramsData = useParams();
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const empId: any = paramsData.id;
  const EMP_ID = empId
    ? empId
    : useSelector((state: any) => state.auth.userData["custom:empId"]);
  const [timePeriod, setTimePeriod] = useState("last6Months");
  const [
    triggerApi,
    { data: EmployeeAggregateReportData, isLoading, isError },
  ] = useLazyGetAggregateAllTypesMonthOnMonthTotalsQuery();

  const handleTabClick = (value: string) => {
    dispatch(setActiveTab(value));
  };

  useEffect(() => {
    triggerApi({
      ORG_ID,
      EMP_ID,
      USER_ID: EMP_ID,
      PERIOD: timePeriod,
    });
  }, [ORG_ID, EMP_ID, timePeriod, triggerApi]);

  const lastMonths = getLastMonths(timePeriod);

  if (isLoading) {
    return <EmployeeInsightOverviewShimmer />;
  }

  if (isError) {
    return (
      <div
        className="flex justify-center items-center min-h-[30vh] p-3 mb-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  const chartData =
    EmployeeAggregateReportData?.data?.map((item) => {
      const date = new Date(item.month);
      const formattedMonth = date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      return {
        name: formattedMonth,
        awards: Number(item.total_awards),
        recognitions: Number(item.total_recognitions),
        badges: Number(item.total_badges),
      };
    }) || [];

  const filledChartData = lastMonths.map((month) => {
    const existingData = chartData.find((item) => item.name === month);
    return (
      existingData || {
        name: month,
        awards: 0,
        recognitions: 0,
        badges: 0,
      }
    );
  });

  const reversedChartData = filledChartData.reverse();

  return (
    <div>
      {EmployeeAggregateReportData?.data?.length ? (
        <div
          className="min-h-[30vh] bg-white rounded-md mb-3 border-1 border-[#E8E8EC] overflow-hidden"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <div className="flex items-center justify-between border-b-1 py-2 px-3 border-[#E8E8EC]">
            <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
              Insights
            </p>
            <div className="flex items-center gap-2">
              <TimePeriodDropdown value={timePeriod} onChange={setTimePeriod} />
              <p
                onClick={() => handleTabClick("insights")}
                className="min-w-10 text-xs font-[400] !text-[#585DF9] cursor-pointer"
              >
                View all
              </p>
            </div>
          </div>

          <div className="w-full h-96 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reversedChartData}
                margin={{ top: 0, right: 0, left: -30, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: "12px", fill: "#555" }}
                  interval={
                    reversedChartData.length > 6
                      ? Math.floor(reversedChartData.length / 12)
                      : 0
                  }
                />
                <YAxis tickFormatter={(value) => `${Math.round(value)}`} />
                <Tooltip />
                <Legend
                  formatter={(value) => {
                    const labelMap: Record<string, string> = {
                      awards: "Awards",
                      recognitions: "Recognitions",
                      badges: "Badges",
                    };
                    return labelMap[value] || value;
                  }}
                />
                <Bar dataKey="awards" stackId="a" fill="#8588F4" />
                <Bar dataKey="recognitions" stackId="a" fill="#585DF9" />
                <Bar dataKey="badges" stackId="a" fill="#34357B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EmployeeInsightOverview;
