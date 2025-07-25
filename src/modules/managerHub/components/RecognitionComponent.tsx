import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import {
  useGetRecognitionQuery,
  useGetSearchEmployeesManagerhubQuery,
} from "../queries/managerhubQuery";
import Error from "../../../utilities/Error";
import SortButton from "../../../common/SortButton";
import TimePeriodDropdown from "../../../common/TimePeriodOptions";
import Avatar from "../../../common/Avatar";
import { Loader2 } from "lucide-react";
import AnalyticsComponentShimmer from "./shimmer/AnalyticsComponentShimmer";
import AnalyticSortButton from "../../../common/AnalyticSortButton";
import RecognitionChartWithIcons from "./RecognitionChartWithIcons";

const RecognitionComponent = ({ selectedSort, handleSortSelection }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [topSelection, setTopSelection] = useState("10");
  const [receiverGiver, setReceiverGiver] = useState("receiver");
  const [timePeriod, setTimePeriod] = useState("last6Months");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [showSearchResultDropdown, setShowSearchResultDropdown] =
    useState(false);
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const updateDebouncedTerm = debounce(
    (term: string) => setDebouncedTerm(term),
    500
  );
  useEffect(() => {
    updateDebouncedTerm(searchTerm);
    return () => {
      updateDebouncedTerm.cancel();
    };
  }, [searchTerm]);

  const {
    data: recognitionReportData,
    isLoading: recognitionReportIsLoading,
    isError: recognitionReportIsError,
    isFetching: recognitionReportIsFetching,
  } = useGetRecognitionQuery({
    ORG_ID,
    EMP_ID,
    REPORTS_TO: EMP_ID,
    PERIOD: timePeriod,
    VALUE: selectedUserId ? "" : topSelection,
    USER_TYPE: receiverGiver,
    USER_ID: selectedUserId,
  });

  const {
    data: employeesSearchData,
    isLoading,
    isError,
    isFetching,
  } = useGetSearchEmployeesManagerhubQuery(
    { ORG_ID, EMP_ID, keyword: searchQuery },
    { skip: !searchQuery }
  );

  const searchData = isLoading ? [] : employeesSearchData?.data || [];

  const debouncedSearchChange = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const handleSearchInputChange = (event: any) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowSearchResultDropdown(true);
    debouncedSearchChange(value);
  };

  const handleTopSelectionChange = (option: string) => {
    setTopSelection(option);
  };

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
          labels.push(month.toLocaleDateString("en-US", { month: "short" })); // Jan, Feb, ...
        }
        break;

      case "lastYear":
        for (let i = 0; i < 12; i++) {
          const month = new Date(today.getFullYear() - 1, i, 1);
          labels.push(month.toLocaleDateString("en-US", { month: "short" }));
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

  const chartLabels = useMemo(() => generateLabels(timePeriod), [timePeriod]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSearchResultDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (recognitionReportIsLoading || recognitionReportIsFetching) {
    return <AnalyticsComponentShimmer />;
  }

  if (recognitionReportIsError) {
    return (
      <div className="w-full flex justify-center items-center h-[calc(100vh-145px)]">
        <Error />
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-md w-full justify-between"
      id="analyticsFilter"
    >
      <div className="flex flex-row gap-x-3 w-full mb-3">
        <div className="w-full">
          <label className="block text-sm font-bold text-[#3F4354] mb-1">
            Report
          </label>
          <AnalyticSortButton
            value={selectedSort}
            options={[
              { value: "award", label: "Award" },
              { value: "badge", label: "Badge" },
              { value: "recognition", label: "Recognition" },
            ]}
            defaultOption="Recognition"
            onSelect={handleSortSelection}
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-bold text-[#3F4354] mb-1">
            Top Selection
          </label>
          <SortButton
            options={[
              { value: "10", label: "Top 10" },
              { value: "20", label: "Top 20" },
              { value: "50", label: "Top 50" },
              { value: "100", label: "Top 100" },
            ]}
            defaultOption="top 10"
            onSelect={handleTopSelectionChange}
          />
        </div>
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
        <div className="w-full relative" ref={dropdownRef}>
          <label className="block text-sm font-bold text-[#3F4354] ">
            Search Employee
          </label>
          <div className="relative mt-1 border-1 rounded-md !border-[#585DF9]">
            <input
              type="text"
              placeholder="Start typing 3 characters to search an employee"
              onChange={handleSearchInputChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md placeholder:!text-[#585DF9] placeholder:font-semibold"
            />
            {showSearchResultDropdown && debouncedTerm && (
              <div className="absolute w-full bg-white rounded-md shadow-lg z-10 mt-2 max-h-60 overflow-y-auto">
                {isLoading || isFetching ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-[#585DF9]" />
                  </div>
                ) : isError ? (
                  <div className="p-4 text-red-500">Error fetching data</div>
                ) : searchData.length > 0 ? (
                  searchData.map((data: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedUserId(data.employee_id);
                        setSearchTerm(`${data.first_name} ${data.last_name}`);
                        setShowSearchResultDropdown(false);
                      }}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex gap-2 items-center border-b-1 border-[#E8E8EC] p-2">
                        <Avatar
                          image={data?.photo}
                          name={data.first_name}
                          size={40}
                        />
                        <div>
                          <p className="font-bold leading-none">
                            {data.first_name} {data.middle_name}{" "}
                            {data.last_name}
                          </p>
                          <p className="text-sm text-[#73737D]">
                            {data.primary_email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-[#73737D]">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end items-end" id="analyticsGraph">
        {!recognitionReportData?.data ||
        recognitionReportData?.data.length === 0 ? (
          <div className="w-full h-[calc(100vh-250px)] flex items-center justify-center text-center text-[#73737D]">
            <p>No data available</p>
          </div>
        ) : (
          <RecognitionChartWithIcons
            chartData={recognitionReportData?.data}
            timePeriod={chartLabels}
          />
        )}
      </div>
    </div>
  );
};

export default RecognitionComponent;
