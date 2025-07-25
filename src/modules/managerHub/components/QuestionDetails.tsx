import { Menu, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetAreaWiseQuestionQuery } from "../../profile/queries/profileQuery";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";
import { format } from "date-fns";
import { skipToken } from "@reduxjs/toolkit/query";
import "react-circular-progressbar/dist/styles.css";

const FeedbackComponent = ({ feedbackList }: any) => {
  return (
    <div>
      {feedbackList?.length === 0 ? (
        <div className="flex justify-center items-center w-full min-h-[50vh]">
          <p className="text-center text-sx font-semibold text-[#73737D]">No Questions are Present</p>
        </div>
      ) : (
        feedbackList?.map((feedback: any, index: number) => {
          const reorderedOptions = feedback?.questionDetails?.options
            ? [
                feedback.questionDetails.options[1],
                ...feedback.questionDetails.options.slice(2),
                feedback.questionDetails.options[0],
              ]
            : [];

          const satisfactionScore = (
            (feedback.directFeedBackPercentage / 100) *
            5
          ).toFixed(1);

          return (
            <div key={index}>
              <p className="text-lg text-[#3F4354] font-semibold mb-1">Question : {feedback?.questionDetails?.questionText}</p>
              <p className="text-lg text-[#3F4354] font-semibold mb-1">Responses : </p>
              <div className="flex items-center justify-between w-100 mb-3">
                <div className="">
                  {reorderedOptions.map((option: any, optionIndex: number) => {
                    const optionLabel = String.fromCharCode(65 + optionIndex);
                    const optionWiseTeamModified = [
                      ...feedback.optionWiseTeam.slice(1),
                      feedback.optionWiseTeam[0],
                    ];

                    return (
                      <div className="flex gap-5 justify-between mb-1" key={optionIndex}>
                        <p className="text-center text-sx font-semibold text-[#73737D]">{`${optionLabel}. ${option.optionText}`}</p>
                        <p className="text-center text-sx font-semibold text-[#73737D]">{optionWiseTeamModified?.[optionIndex]}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="w-32 h-32">
                    <CircularProgressbar
                      value={feedback.directFeedBackPercentage}
                      text={`${feedback.directFeedBackPercentage}%`}
                      styles={buildStyles({
                        textSize: "16px",
                        pathColor: "#0d6efd",
                        textColor: "#0d6efd",
                        trailColor: "#E8E8EC",
                      })}
                    />
                    <p className="text-[#3F4354] font-semibold mt-2">Satisfaction: {satisfactionScore} / 5</p>
                  </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

const QuestionDetails = ({ area }: any) => {
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [yearMonth, setYearMonth] = useState<string>("");
  const [billingPeriod, setBillingPeriod] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const DATE_ONE = yearMonth;
  const currentDate = new Date();
  const DATE_TWO = format(currentDate, "yyyy-MM-dd");
  const AREA_ID = area?.areaId;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const loguseTimeAgo = (month: string, year: number) => {
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    const formattedMonth = monthNumber < 10 ? `0${monthNumber}` : monthNumber;
    const startDate = `${year}-${formattedMonth}-01`;
    const today = new Date();
    const isCurrentMonth =
      monthNumber === today.getMonth() + 1 && year === today.getFullYear();
    const endDate = isCurrentMonth
      ? today.toISOString().split("T")[0]
      : new Date(year, monthNumber, 0).toISOString().split("T")[0];

    setYearMonth(startDate);
    setBillingPeriod(month);
    setAnchorEl(null);
    setDateRange({ startDate, endDate });
  };

  const handlePeriodChange = (period: string) => {
    setBillingPeriod(period);
    loguseTimeAgo(period, selectedYear);
    handleClose();
  };
  const handleYearChange = (event: SelectChangeEvent<number>) => {
    const newYear = Number(event.target.value);
    setSelectedYear(newYear);
    loguseTimeAgo(billingPeriod, newYear);
    handleClose();
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentMonthStartDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    )
      .toISOString()
      .split("T")[0];

    const todayDate = currentDate.toISOString().split("T")[0];

    setYearMonth(currentMonthStartDate);
    setBillingPeriod(format(currentDate, "MMMM"));
    setDateRange({ startDate: currentMonthStartDate, endDate: todayDate });
  }, []);

  const {
    data: areaWiseReportData,
    isLoading,
    isError,
  } = useGetAreaWiseQuestionQuery(
    DATE_ONE && DATE_TWO
      ? {
          ORG_ID,
          EMP_ID,
          DATE_ONE: dateRange.startDate,
          DATE_TWO: dateRange.endDate,
          AREA_ID,
        }
      : skipToken
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-2xl text-[#3F4354] font-semibold">Questions</p>
        <div>
          <button className="text-sm font-semibold text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md flex flex-row gap-0.5 items-center" onClick={handleClick}>
            Month Wise Question: {billingPeriod} {selectedYear}
          </button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
  {[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((month) => (
    <MenuItem
      key={month}
      onClick={() => handlePeriodChange(month)}
      selected={billingPeriod === month}
      sx={{
        fontWeight: billingPeriod === month ? "bold" : "normal",
        backgroundColor: billingPeriod === month ? "#f0f0f0" : "transparent",
      }}
    >
      {month}
    </MenuItem>
  ))}

  <MenuItem>
    <div className="flex items-center">
      <span style={{ marginRight: "10px" }}>Select Year:</span>
      <Select
        className="year_select"
        value={selectedYear}
        onChange={handleYearChange}
        displayEmpty
        sx={{ minWidth: "100px" }}
      >
        {Array.from({ length: 11 }, (_, i) => {
          const year = new Date().getFullYear() - 5 + i;
          return (
            <MenuItem
              key={year}
              value={year}
              selected={selectedYear === year}
              sx={{
                fontWeight: selectedYear === year ? "bold" : "normal",
                backgroundColor: selectedYear === year ? "#f0f0f0" : "transparent",
              }}
            >
              {year}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  </MenuItem>
</Menu>


        </div>
      </div>
      <FeedbackComponent feedbackList={areaWiseReportData?.data} />
    </div>
  );
};

export default QuestionDetails;
