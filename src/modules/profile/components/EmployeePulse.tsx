import React, { useState } from "react";
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
  subMonths,
} from "date-fns";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { useGetFeedbackReportQuery } from "../queries/profileQuery";
import { useSelector } from "react-redux";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";
import { useParams } from "react-router-dom";
import { Grid, Tooltip } from "@mui/material";

const EmployeePulse: React.FC<any> = () => {
  const paramsData = useParams();
  const empId: any = paramsData.id;
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = empId
    ? empId
    : useSelector((state: any) => state.auth.userData["custom:empId"]);
  const today = new Date();
  const [startMonth, setStartMonth] = useState(startOfMonth(today));

  const firstDayOfRange = startOfMonth(subMonths(startMonth, 1));
  const lastDayOfRange = endOfMonth(addMonths(startMonth, 5));

  const DATE_ONE = format(firstDayOfRange, "yyyy-MM-dd");
  const DATE_TWO = format(lastDayOfRange, "yyyy-MM-dd");

  const {
    data: feedbackData,
    isLoading: feedbackDataIsLoading,
    isError: feedbackDataIsError,
  } = useGetFeedbackReportQuery({
    ORG_ID,
    EMP_ID,
    DATE_ONE,
    DATE_TWO,
  });

  if (feedbackDataIsLoading) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[40vh] p-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (feedbackDataIsError) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[40vh] p-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

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
        return "#e9e8e8";
    }
  };

  const handleNext = () => {
    setStartMonth(addMonths(startMonth, 3));
  };

  const handlePrev = () => {
    setStartMonth(subMonths(startMonth, 3));
  };

  const monthsToShow = Array.from({ length: 6 }, (_, i) =>
    addMonths(startMonth, i)
  );

  return (
    <div className="min-h-[40vh] bg-white rounded-md mb-3 border-1 border-[#E8E8EC]">
      <div className="flex items-center justify-between border-b-1 p-3 border-[#E8E8EC]">
        <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
          Pulse
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[80px] p-3">
        {monthsToShow.map((month, idx) => (
          <div key={idx} className="text-center flex flex-col gap-2">
            <p className="text-sm text-start text-[#585DF9] font-semibold mb-2">
              {format(month, "MMMMMM yyyy")}
            </p>
            {/* Weekdays Row */}
            <Grid container spacing={1}>
              {weekdays.map((day) => (
                <Grid item xs={1.6} key={day}>
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
                  <Grid item xs={1.4} key={date.toString()}>
                    <Tooltip title={`${format(date, "EEEE, MMM d")}`} arrow>
                      <div
                        style={{
                          margin: "0px auto",
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

      {/* Navigation Buttons */}
      <div className="flex justify-end items-end gap-2 py-3">
        <button
          className="px-4 py-2  text-sm flex flex-row gap-1 items-center "
          onClick={handlePrev}
        >
          <HiOutlineArrowNarrowRight className="rotate-180" />
          Previous
        </button>
        <button
          className="px-4 py-2 text-sm flex flex-row gap-1 items-center"
          onClick={handleNext}
        >
          Next <HiOutlineArrowNarrowRight />
        </button>
      </div>
    </div>
  );
};

export default EmployeePulse;
