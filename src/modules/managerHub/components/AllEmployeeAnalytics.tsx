import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetAwardQuery,
  useGetBadgeQuery,
  useGetRecognitionQuery,
} from "../queries/managerhubQuery";
import Error from "../../../utilities/Error";
import AllEmployeeChartWithIcons from "./AllEmployeeChartWithIcons";
import TimePeriodDropdown from "../../../common/TimePeriodOptions";
import SortButton from "../../../common/SortButton";
import { Award, Ribbon, Trophy } from "lucide-react";
import AllEmployeeAnalyticsShimmer from "./shimmer/AllEmployeeAnalyticsShimmer";

const AllEmployeeAnalytics = () => {
  const topSelection = "10";
  const [receiverGiver, setReceiverGiver] = useState("receiver");
  const [timePeriod, setTimePeriod] = useState("last6Months");
  const selectedUserId = "";
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const {
    data: awardReportData,
    isLoading: awardReportIsLoading,
    isError: awardReportIsError,
  } = useGetAwardQuery({
    ORG_ID,
    EMP_ID,
    REPORTS_TO: EMP_ID,
    PERIOD: timePeriod,
    VALUE: selectedUserId ? "" : topSelection,
    USER_TYPE: receiverGiver,
    USER_ID: selectedUserId,
  });

  const {
    data: badgeReportData,
    isLoading: badgeReportIsLoading,
    isError: badgeReportIsError,
  } = useGetBadgeQuery({
    ORG_ID,
    EMP_ID,
    REPORTS_TO: EMP_ID,
    PERIOD: timePeriod,
    VALUE: selectedUserId ? "" : topSelection,
    USER_TYPE: receiverGiver,
    USER_ID: selectedUserId,
  });

  const {
    data: recognitionReportData,
    isLoading: recognitionReportIsLoading,
    isError: recognitionReportIsError,
  } = useGetRecognitionQuery({
    ORG_ID,
    EMP_ID,
    REPORTS_TO: EMP_ID,
    PERIOD: timePeriod,
    VALUE: selectedUserId ? "" : topSelection,
    USER_TYPE: receiverGiver,
    USER_ID: selectedUserId,
  });

  const handleReceiverGiverChange = (option: string) => {
    setReceiverGiver(option);
  };

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
          labels.push(i.toString()); // Day of month
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
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          labels.push(
            date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
          );
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
    awardReportIsLoading ||
    badgeReportIsLoading ||
    recognitionReportIsLoading
  ) {
    return <AllEmployeeAnalyticsShimmer />;
  }

  if (awardReportIsError || badgeReportIsError || recognitionReportIsError) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-145px)] p-3 mb-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  return (
    <div className="w-full mb-3">
      <div className="flex justify-between gap-3 mb-3" id="allData">
        <div
          id="totalAwards"
          className="w-[33.33%] bg-white rounded-md flex items-center gap-3 p-2"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <div className="w-12 h-12 border-4 border-[#585df9] flex items-center justify-center rounded-full">
            <Trophy className="w-6 h-6" color="#585df9" />
          </div>
          <div>
            <p className="text-xl font-semibold text-[#3F4354]">Total Awards</p>
            <p className="text-xl text-[#3F4354] font-bold">
              {totalAwardCount}
            </p>
          </div>
        </div>
        <div
          id="totalRecognitions"
          className="w-[33.33%] bg-white rounded-md flex items-center gap-3 p-2"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
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
          id="totalBadges"
          className="w-[33.33%] bg-white rounded-md flex items-center gap-3 p-2"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <div className="w-12 h-12 border-4 border-[#eac435] flex items-center justify-center rounded-full">
            <Award className="w-6 h-6" color="#eac435" />
          </div>
          <div>
            <p className="text-xl font-semibold text-[#3F4354]">Total Badges</p>
            <p className="text-xl text-[#3F4354] font-bold">
              {totalBadgeCount}
            </p>
          </div>
        </div>
      </div>
      <div
        id="graph"
        className="bg-white rounded-md p-3"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <div className="flex flex-row gap-x-3 w-full mb-3">
          <div className="w-full">
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

          <div className="w-full">
            <label className="block text-sm  text-[#3F4354] font-bold mb-1">
              Period
            </label>
            <TimePeriodDropdown value={timePeriod} onChange={setTimePeriod} />
          </div>
        </div>

        <div className="flex justify-center items-center bg-white rounded-md p-3">
          {!awardReportData?.data || awardReportData?.data.length === 0 ? (
            <div className="w-full h-[calc(100vh-145px)] flex items-center justify-center text-center text-[#73737D]">
              <p>No data available</p>
            </div>
          ) : (
            <AllEmployeeChartWithIcons
              chartData={[
                ...(Array.isArray(awardReportData?.data)
                  ? awardReportData.data
                  : []),
                ...(Array.isArray(badgeReportData?.data)
                  ? badgeReportData.data
                  : []),
                ...(Array.isArray(recognitionReportData?.data)
                  ? recognitionReportData.data
                  : []),
              ]}
              timePeriod={chartLabels}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllEmployeeAnalytics;
