import { useState } from "react";
import { useSelector } from "react-redux";
import EmployeeAwardChartWithIcons from "./EmployeeAwardChartWithIcons";
import EmployeeBadgeChartWithIcons from "./EmployeeBadgeChartWithIcons";
import EmployeeRecognitionChartWithIcons from "./EmployeeRecognitionChartWithIcons";
import {
  useGetProfileInsightTotalAwardQuery,
  useGetProfileInsightTotalBadgeQuery,
  useGetProfileInsightTotalRecognitionQuery,
} from "../../profile/queries/profileQuery";
import { Award, Ribbon, Trophy } from "lucide-react";
import SortButton from "../../../common/SortButton";
import TimePeriodDropdown from "../../../common/TimePeriodOptions";
import { Tooltip } from "@mui/material";
import { NavLink } from "react-router-dom";
import InsigthsShimmer from "./shimmer/InsigthsShimmer";

export const Insights = ({ employeeId }: { employeeId: string }) => {
  const [receiverGiver, setReceiverGiver] = useState("receiver");
  const [timePeriod, setTimePeriod] = useState("last6Months");
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = employeeId;
  const handleReceiverGiverChange = (option: string) => {
    setReceiverGiver(option);
  };

  const {
    data: awardReportData,
    isLoading: awardIsLoading,
    isError: awardIsError,
    isFetching: awardIsFetching,
  } = useGetProfileInsightTotalAwardQuery({
    ORG_ID,
    EMP_ID,
    PERIOD: timePeriod,
    USER_TYPE: receiverGiver,
  });

  const {
    data: badgeReportData,
    isLoading: badgeIsLoading,
    isError: badgeIsError,
    isFetching: badgeIsFetching,
  } = useGetProfileInsightTotalBadgeQuery({
    ORG_ID,
    EMP_ID,
    PERIOD: timePeriod,
    USER_TYPE: receiverGiver,
  });

  const {
    data: recognitionReportData,
    isLoading: recognitionIsLoading,
    isError: recognitionIsError,
    isFetching: recognitionIsFetching,
  } = useGetProfileInsightTotalRecognitionQuery({
    ORG_ID,
    EMP_ID,
    PERIOD: timePeriod,
    USER_TYPE: receiverGiver,
  });

  const generateLabels = (period: string): string[] => {
    const today = new Date();
    const labels: string[] = [];

    const formatMonthYear = (date: Date) =>
      date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    switch (period) {
      case "thisWeek":
        for (let i = 6; i >= 0; i--) {
          const day = new Date(today);
          day.setDate(today.getDate() - i);
          labels.push(day.toLocaleDateString("en-US", { weekday: "short" }));
        }
        break;

      case "lastWeek":
        for (let i = 6; i >= 0; i--) {
          const day = new Date(today);
          day.setDate(today.getDate() - 7 - i);
          labels.push(day.toLocaleDateString("en-US", { weekday: "short" }));
        }
        break;

      case "thisMonth":
        for (let i = 1; i <= today.getDate(); i++) {
          labels.push(i.toString());
        }
        break;

      case "lastMonth":
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
        const daysInLastMonth = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth() + 1,
          0
        ).getDate();
        for (let i = 1; i <= daysInLastMonth; i++) {
          labels.push(i.toString());
        }
        break;

      case "last3Months":
      case "last6Months":
      case "last9Months":
        const numMonths = parseInt(
          period.replace("last", "").replace("Months", "")
        );
        for (let i = numMonths - 1; i >= 0; i--) {
          const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
          labels.push(formatMonthYear(month));
        }
        break;

      case "thisYear":
        for (let i = 0; i < 12; i++) {
          const month = new Date(today.getFullYear(), i, 1);
          labels.push(month.toLocaleDateString("en-US", { month: "short" }));
        }
        break;

      case "lastYear":
        for (let i = 11; i >= 0; i--) {
          const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
          labels.push(formatMonthYear(month));
        }
        break;

      default:
        for (let i = 1; i <= today.getDate(); i++) {
          labels.push(i.toString());
        }
        break;
    }

    return labels;
  };
  const chartLabels = generateLabels(timePeriod);
  const totalAwardCount = awardReportData?.data?.reduce((total, item) => {
    return total + Number(item.total_awards || 0);
  }, 0);

  const totalBadgeCount = badgeReportData?.data?.reduce((total, item) => {
    return total + Number(item.total_badges || 0);
  }, 0);

  const totalRecognitionCount = recognitionReportData?.data?.reduce(
    (total, item) => {
      return total + Number(item.total_recognitions || 0);
    },
    0
  );

  if (
    awardIsFetching ||
    badgeIsFetching ||
    recognitionIsFetching ||
    awardIsLoading ||
    badgeIsLoading ||
    recognitionIsLoading
  ) {
    return <InsigthsShimmer />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-end gap-3 py-3">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-bold text-[#3F4354] mb-1">
            Type
          </label>
          <SortButton
            options={[
              { value: "receiver", label: "Received" },
              { value: "giver", label: "Given" },
            ]}
            defaultOption="Type"
            onSelect={handleReceiverGiverChange}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="block text-sm  text-[#3F4354] font-bold mb-1">
            Period
          </label>
          <TimePeriodDropdown value={timePeriod} onChange={setTimePeriod} />
          <Tooltip title={"Learn more about Mangerhub"} arrow>
            <NavLink to={"https://www.wazopulse.com/mangerhub"} target="_blank">
              <p className="text-[#585DF9] text-xs mt-2">Info</p>
            </NavLink>
          </Tooltip>
        </div>
      </div>
      <div>
        <div className="flex justify-between gap-3 mb-3" id="allData">
          <div
            id="myTeamTotalAward"
            className="w-[33.33%] bg-white rounded-md flex items-center gap-3 p-2"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            <div className="w-12 h-12 border-4 border-[#585df9] flex items-center justify-center rounded-full">
              <Trophy className="w-6 h-6" color="#585df9" />
            </div>
            <div>
              <p className="text-xl font-semibold text-[#3F4354]">
                Total Awards
              </p>
              <p className="text-xl text-[#3F4354] font-bold">
                {totalAwardCount}
              </p>
            </div>
          </div>
          <div
            className="w-[33.33%] bg-white rounded-md flex items-center gap-3 p-2"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
            id="myTeamTotalRecognitions"
          >
            <div className="w-12 h-12 border-4 border-[#e40066] flex items-center justify-center rounded-full">
              <Ribbon className="w-6 h-6" color="#e40066" />
            </div>
            <div>
              <p className="text-xl font-semibold text-[#3F4354]">
                Total Recognitions
              </p>
              <p className="text-xl text-[#3F4354] font-bold">
                {totalRecognitionCount}
              </p>
            </div>
          </div>
          <div
            className="w-[33.33%] bg-white rounded-md flex items-center gap-3 p-2"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
            id="myTeamTotalBadges"
          >
            <div className="w-12 h-12 border-4 border-[#eac435] flex items-center justify-center rounded-full">
              <Award className="w-6 h-6" color="#eac435" />
            </div>
            <div>
              <p className="text-xl font-semibold text-[#3F4354]">
                Total Badges
              </p>
              <p className="text-xl text-[#3F4354] font-bold">
                {totalBadgeCount}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mb-3">
          <div className="w-[49%]">
            <EmployeeAwardChartWithIcons
              chartData={awardReportData?.data ?? []}
              timePeriod={chartLabels}
              awardIsLoading={awardIsLoading}
              awardIsError={awardIsError}
            />
          </div>
          <div className="w-[49%]">
            <EmployeeBadgeChartWithIcons
              chartData={badgeReportData?.data ?? []}
              timePeriod={chartLabels}
              badgeIsLoading={badgeIsLoading}
              badgeIsError={badgeIsError}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-[49%]">
            <EmployeeRecognitionChartWithIcons
              chartData={
                recognitionReportData?.data?.map((item) => ({
                  month: item.month,
                  total_recognitios: item.total_recognitions,
                })) ?? []
              }
              timePeriod={chartLabels}
              recognitionIsLoading={recognitionIsLoading}
              recognitionIsError={recognitionIsError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};