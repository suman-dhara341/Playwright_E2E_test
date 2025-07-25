import React from "react";
import {
  format,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  isSameDay,
  parseISO,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { Grid, Tooltip } from "@mui/material";
import { useGetFeedbackReportQuery } from "../queries/profileQuery";
import { useSelector } from "react-redux";
import Error from "../../../utilities/Error";
import { useParams } from "react-router-dom";
import EmployeePulseOverviewShimmer from "./shimmer/EmployeePulseOverviewShimmer";
const EmployeePulseOverview: React.FC<any> = () => {
  const paramsData = useParams();
  const empId: any = paramsData.id;

  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );

  const EMP_ID =
    empId || useSelector((state: any) => state.auth.userData["custom:empId"]);
  const today = new Date();
  const firstDayOfLastMonth = startOfMonth(addMonths(today, -1));
  const lastDayOfCurrentMonth = endOfMonth(today);
  const DATE_ONE = format(firstDayOfLastMonth, "yyyy-MM-dd");
  const DATE_TWO = format(lastDayOfCurrentMonth, "yyyy-MM-dd");

  const {
    data: feedbackData,
    isLoading: feedbackDataIsLoading,
    isError: feedbackDataIsError,
  } = useGetFeedbackReportQuery({ ORG_ID, EMP_ID, DATE_ONE, DATE_TWO });

  if (feedbackDataIsLoading) {
    return <EmployeePulseOverviewShimmer />;
  }

  if (feedbackDataIsError) {
    return (
      <div
        className="flex justify-center items-center min-h-[30vh] p-3 mb-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  const monthsToShow = [addMonths(today, -1), today];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getFeedbackPoints = (date: Date) => {
    const feedback = feedbackData?.data?.find((f) =>
      isSameDay(parseISO(f.feedbackDate), date)
    );
    return feedback ? feedback?.point : null;
  };

  const getColorForPoints = (points: number | null) => {
    switch (points) {
      case 0:
        return "#E9E8E8";
      case 1:
        return "#FF473A";
      case 2:
        return "#FF7E11";
      case 3:
        return "#FFD000";
      case 4:
        return "#48FF48";
      case 5:
        return "#01CA5E";
      default:
        return "#E9E8E8";
    }
  };

  return (
    <div
      className="min-h-[30vh] bg-white rounded-md mb-3 border-1 border-[#E8E8EC]"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="flex items-center justify-between border-b p-3 border-[#E8E8EC]">
        <p className="text-base leading-[16px] font-semibold text-[#3F4354]">
          Pulse
        </p>
      </div>
      <div className="flex gap-6 p-6">
        {monthsToShow.map((month, idx) => (
          <div key={idx} className="text-center w-1/2">
            <p className="mb-2 text-sm text-[#585DF9] font-semibold">
              {format(month, "MMM yyyy")}
            </p>

            {/* Weekdays Row */}
            <Grid container spacing={1}>
              {weekdays.map((day) => (
                <Grid item xs={1.7} key={day}>
                  <p className="text-sm text-[#73737D] text-center mb-2">
                    {day}
                  </p>
                </Grid>
              ))}
            </Grid>

            {/* Days Row */}
            <Grid container spacing={1}>
              {eachDayOfInterval({
                start: startOfWeek(startOfMonth(month), {
                  weekStartsOn: 1,
                }),
                end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
              }).map((date) => {
                const points = getFeedbackPoints(date);
                const isCurrentMonth = date.getMonth() === month.getMonth();

                return (
                  <Grid item xs={1.7} key={date.toString()}>
                    <Tooltip title={`${format(date, "EEEE, MMM d")}`} arrow>
                      <div
                        style={{
                          margin: "2px auto",
                          width: 20,
                          height: 20,
                          backgroundColor: getColorForPoints(points),
                          borderRadius: "2px",
                          visibility: isCurrentMonth ? "visible" : "hidden",
                        }}
                      />
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeePulseOverview;
