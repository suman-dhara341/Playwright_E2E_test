import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetProfileInsightTotalAwardQuery,
  useGetProfileInsightTotalBadgeQuery,
  useGetProfileInsightTotalFeedCommentQuery,
  useGetProfileInsightTotalFeedLikeQuery,
  useGetProfileInsightTotalFeedQuery,
  useGetProfileInsightTotalRecognitionQuery,
} from "../queries/profileQuery";
import EmployeeFeedChart from "./EmployeeFeedChart";
import EmployeeBadgeChart from "./EmployeeBadgeChart";
import EmployeeAwardChart from "./EmployeeAwardChart";
import EmployeeRecognitionChart from "./EmployeeRecognitionChart";
import EmployeeFeedCommentCountChart from "./EmployeeFeedCommentCountChart";
import EmployeeFeedLikeCountChart from "./EmployeeFeedLikeCountChart";
import { Award, Ribbon, Rss, Trophy } from "lucide-react";
import TimePeriodDropdown from "../../../common/TimePeriodOptions";
import SortButton from "../../../common/SortButton";
import { useParams } from "react-router-dom";
import EmployeeInsightShimmer from "./shimmer/EmployeeInsightShimmer";

const EmployeeInsight = () => {
  const paramsData = useParams();
  const [receiverGiver, setReceiverGiver] = useState("receiver");
  const [timePeriod, setTimePeriod] = useState("last6Months");
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const empId: any = paramsData.id;
  const EMP_ID = empId
    ? empId
    : useSelector((state: any) => state.auth.userData["custom:empId"]);
  const {
    data: awardReportData,
    isLoading: awardIsLoading,
    isError: awardIsError,
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
  } = useGetProfileInsightTotalRecognitionQuery({
    ORG_ID,
    EMP_ID,
    PERIOD: timePeriod,
    USER_TYPE: receiverGiver,
  });

  const {
    data: feedReportData,
    isLoading: feedIsLoading,
    isError: feedIsError,
  } = useGetProfileInsightTotalFeedQuery({
    ORG_ID,
    EMP_ID,
    PERIOD: timePeriod,
    USER_TYPE: receiverGiver,
  });

  const {
    data: feedLikeCountReportData,
    isLoading: feedLikeCountIsLoading,
    isError: feedLikeCountIsError,
  } = useGetProfileInsightTotalFeedLikeQuery({
    ORG_ID,
    EMP_ID,
    PERIOD: timePeriod,
    USER_TYPE: receiverGiver,
  });

  const {
    data: feedCommentCountReportData,
    isLoading: feedCommentCountIsLoading,
    isError: feedCommentCountIsError,
  } = useGetProfileInsightTotalFeedCommentQuery({
    ORG_ID,
    EMP_ID,
    PERIOD: timePeriod,
    USER_TYPE: receiverGiver,
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
          labels.push(month.toLocaleDateString("en-US", { month: "short" })); // Jan, Feb, ...
        }
        break;

      case "lastYear":
        for (let i = 11; i >= 0; i--) {
          const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
          labels.push(formatMonthYear(month)); // e.g., "Jun 2024", "Jul 2024", ...
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
  console.log(chartLabels,"chartLabels")

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

  const totalFeedCount = feedReportData?.data?.reduce((total, item) => {
    return total + Number(item.total_feeds || 0);
  }, 0);

  if (
    awardIsLoading ||
    badgeIsLoading ||
    recognitionIsLoading ||
    feedIsLoading ||
    feedLikeCountIsLoading ||
    feedCommentCountIsLoading
  ) {
    return <EmployeeInsightShimmer />;
  }

  return (
    <div className="min-h-[40vh] mb-3">
      <div
        className="bg-white flex items-center justify-between rounded-md py-2 px-3"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
          Insights
        </p>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 w-full">
            <label className="block text-sm text-[#3F4354] font-semibold">
              Period
            </label>
            <div className="w-[140px]">
              <TimePeriodDropdown value={timePeriod} onChange={setTimePeriod} />
            </div>
          </div>
          <div className="flex items-center gap-2 w-full">
            <label className="block text-sm font-semibold text-[#3F4354]">
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
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between gap-3 mt-3">
          <div
            className="w-[24%] bg-white rounded-md flex items-center gap-3 p-2"
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
            className="w-[24%] bg-white rounded-md flex items-center gap-3 p-2"
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
            className="w-[24%] bg-white rounded-md flex items-center gap-3 p-2"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
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
          <div
            className="w-[24%] bg-white rounded-md flex items-center gap-3 p-2"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            <div className="w-12 h-12 border-4 border-[#00c951] flex items-center justify-center rounded-full">
              <Rss className="w-6 h-6" color="#00c951" />
            </div>
            <div>
              <p className="text-xl font-semibold text-[#3F4354]">Total Feed</p>
              <p className="text-xl text-[#3F4354] font-bold">
                {totalFeedCount}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-3">
          <EmployeeAwardChart
            chartData={awardReportData?.data ?? []}
            timePeriod={chartLabels}
            awardIsLoading={awardIsLoading}
            awardIsError={awardIsError}
          />
          <EmployeeBadgeChart
            chartData={badgeReportData?.data ?? []}
            timePeriod={chartLabels}
            badgeIsLoading={badgeIsLoading}
            badgeIsError={badgeIsError}
          />
        </div>
        <div className="flex justify-between gap-3">
          <EmployeeRecognitionChart
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
          <EmployeeFeedChart
            chartData={feedReportData?.data ?? []}
            timePeriod={chartLabels}
            feedIsLoading={feedIsLoading}
            feedIsError={feedIsError}
          />
        </div>
        <div className="flex justify-between gap-3">
          <EmployeeFeedLikeCountChart
            chartData={feedLikeCountReportData?.data ?? []}
            timePeriod={chartLabels}
            feedLikeIsLoading={feedLikeCountIsLoading}
            feedLikeIsError={feedLikeCountIsError}
          />
          <EmployeeFeedCommentCountChart
            chartData={feedCommentCountReportData?.data ?? []}
            timePeriod={chartLabels}
            feedCommentIsLoading={feedCommentCountIsLoading}
            feedCommentIsError={feedCommentCountIsError}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeInsight;
