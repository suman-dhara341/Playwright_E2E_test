import { useSelector } from "react-redux";
import { useGetEmployeeJourneyQuery } from "../queries/profileQuery";
import Error from "../../../utilities/Error";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { BsFilePerson } from "react-icons/bs";
import EmployeeJourneyShimmer from "./shimmer/EmployeeJourneyShimmer";

const EmployeeJourney = () => {
  const paramsData = useParams();
  const empId: any = paramsData.id;
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = empId
    ? empId
    : useSelector((state: any) => state.auth.userData["custom:empId"]);

  const {
    data: employeeJourney,
    error: employeeJourneyError,
    isLoading: employeeJourneyIsLoading,
  } = useGetEmployeeJourneyQuery({
    EMP_ID: EMP_ID,
    ORG_ID,
  });

  if (employeeJourneyIsLoading) {
    return <EmployeeJourneyShimmer />;
  }

  if (employeeJourneyError) {
    return (
      <div
        className="flex justify-center items-center min-h-[calc(100vh-360px)] p-3 mb-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100vh-360px)] bg-white rounded-md mb-3 border-1 border-[#E8E8EC]"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="flex items-center justify-between border-b-1 p-3 border-[#E8E8EC]">
        <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
          Journey
        </p>
      </div>
      {employeeJourney?.data?.length ? (
        <div className="space-y-6 p-3">
          {employeeJourney?.data?.length === 0 ? (
            <div>
              <p>Employee journey not started</p>
            </div>
          ) : (
            <div className="space-y-8 p-3">
              {[...(employeeJourney?.data ?? [])]
                .sort((a, b) => b.order - a.order)
                .map((journey, index, sortedJourneys) => {
                  const startDate = dayjs(journey.startDate);
                  const endDate =
                    journey.endDate && dayjs(journey.endDate).isValid()
                      ? dayjs(journey.endDate)
                      : dayjs();
                  const tenureMonths = endDate.diff(startDate, "month");
                  const isLastItem = index === sortedJourneys.length - 1;
                  const chipColorMap: Record<string, string> = {
                    grade: "!bg-[#c5f4c7] !border-[#8edb91]",
                    designation: "!bg-[#c1daff] !border-[#94bcf9]",
                    department: "!bg-[#f5d9fc] !border-[#e6a0f7]",
                    location: "!bg-[#ffeebf] !border-[#f0d589]",
                    manager: "!bg-[#ffd9d9] !border-[#f7a5a5]",
                  };
                  return (
                    <div
                      key={index}
                      className="relative flex gap-4 mb-0 w-full"
                    >
                      <div className="flex flex-col items-center">
                        {isLastItem ? (
                          <>
                            <div className="w-3 h-4 rounded-full bg-[#4B3FE4]"></div>
                            <div className="w-[2px] h-full bg-[#A0A0A0]"></div>
                            <div className="w-3 h-4 rounded-full bg-[#4B3FE4]"></div>
                          </>
                        ) : (
                          <>
                            <div className="w-3 h-3 rounded-full bg-[#4B3FE4]"></div>
                            {!isLastItem && (
                              <div className="w-[2px] h-full bg-[#A0A0A0]"></div>
                            )}
                          </>
                        )}
                      </div>
                      <div className={`w-full ${isLastItem ? "mb-0" : "mb-4"}`}>
                        {journey && (
                          <div className="mb-2">
                            <div className="flex gap-2 items-start mb-[8px]">
                              {journey.designation && (
                                <p className="!text-[#585DF9] text-base font-semibold !leading-[8px]">
                                  {journey.designation}
                                </p>
                              )}
                              {journey.startDate && journey.endDate && (
                                <p className="text-[#73737D] text-sm leading-[8px]">
                                  {journey.startDate
                                    ? `(${
                                        dayjs(journey.startDate).isValid()
                                          ? dayjs(journey.startDate).format(
                                              "YYYY/MM/DD"
                                            )
                                          : "Invalid date"
                                      } - ${
                                        journey.endDate &&
                                        dayjs(journey.endDate).isValid()
                                          ? dayjs(journey.endDate).format(
                                              "YYYY/MM/DD"
                                            )
                                          : "Present"
                                      })`
                                    : "Invalid date"}
                                </p>
                              )}
                            </div>

                            {(journey.grade ||
                              journey.department ||
                              journey.location) && (
                              <div className="flex items-center gap-1">
                                {journey.grade && (
                                  <div className="flex gap-1 items-center text-xs">
                                    <span className="text-[#73737D] rounded text-xs">
                                      Grade:
                                    </span>
                                    <span className="ml-1 text-[#3F4354] font-semibold">
                                      {journey.grade}
                                    </span>
                                  </div>
                                )}
                                {journey.grade &&
                                  (journey.department || journey.location) && (
                                    <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
                                  )}
                                {journey.department && (
                                  <div className="flex gap-1 items-center text-xs">
                                    <span className="text-[#73737D] rounded text-xs">
                                      Department:
                                    </span>
                                    <span className="ml-1 text-[#3F4354] font-semibold">
                                      {journey.department}
                                    </span>
                                  </div>
                                )}
                                {journey.department && journey.location && (
                                  <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
                                )}
                                {journey.location && (
                                  <div className="flex gap-1 items-center text-xs">
                                    <span className="text-[#73737D] rounded text-xs">
                                      Location:
                                    </span>
                                    <span className="ml-1 text-[#3F4354] font-semibold">
                                      {journey.location}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {(tenureMonths || journey.reportsTo) && (
                              <div className="flex gap-2 items-center">
                                {tenureMonths && (
                                  <div className="flex gap-1 items-center text-xs">
                                    <span className="text-[#73737D] rounded text-xs">
                                      Tenure:
                                    </span>
                                    <span className="ml-1 text-[#3F4354] font-semibold">
                                      {tenureMonths} months
                                    </span>
                                  </div>
                                )}

                                {tenureMonths && journey.reportsTo && (
                                  <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
                                )}

                                {journey.reportsTo && (
                                  <div className="flex gap-1 items-center text-xs">
                                    <span className="text-[#73737D] rounded text-xs">
                                      <BsFilePerson className="text-[#585DF9]" />
                                    </span>
                                    <span className="ml-1 text-[#3F4354] font-semibold">
                                      {journey.reportsTo}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap">
                          {journey?.effectedColumn
                            ?.filter((column: any) => column)
                            .map((column: string, idx: number) => {
                              const normalizedColumn = column
                                .trim()
                                .toLowerCase();
                              const chipClass =
                                chipColorMap[normalizedColumn] ||
                                "bg-gray-200 border-gray-400";

                              return (
                                <span
                                  key={idx}
                                  className={`text-[9px] font-semibold border-1 capitalize py-[0px] px-[8px] rounded ${chipClass}`}
                                >
                                  {column}
                                </span>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white flex justify-center items-center h-[calc(100vh-430px)]">
          <p className="text-[#73737D]">You don't started your journey</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeJourney;
