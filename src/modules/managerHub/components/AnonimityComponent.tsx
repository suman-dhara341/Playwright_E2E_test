import { useEffect, useRef, useState } from "react";
import { useGetAreaWiseReportQuery } from "../../profile/queries/profileQuery";
import { useSelector } from "react-redux";
import Error from "../../../utilities/Error";
import LineChart from "./LineChart";
import QuestionDetails from "./QuestionDetails";
import AllReportLineChart from "./AllReportLineChart";
import AnonimityComponentShimmer from "./shimmer/AnonimityComponentShimmer";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const Anonimity = ({ activeTab }: { activeTab: string }) => {
  const ORG_ID = useSelector(
    (state: { auth: { userData: { "custom:orgId": string } } }) =>
      state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const currentDate = new Date();
  const sixMonthsAgo = new Date(
    currentDate.setMonth(currentDate.getMonth() - 6)
  );
  const DATE_ONE = sixMonthsAgo.toISOString().split("T")[0];
  const DATE_TWO = new Date().toISOString().split("T")[0];

  const tourRef = useRef<any>(null);

  const {
    data: areaWiseReportData,
    isLoading,
    isError,
  } = useGetAreaWiseReportQuery({
    ORG_ID,
    EMP_ID,
    DATE_ONE,
    DATE_TWO,
  });

  const [selectedArea, setSelectedArea] = useState<string | null>(activeTab);
  const [tabValue, setTabValue] = useState<number>(0);

  useEffect(() => {
    if (activeTab) {
      setSelectedArea(activeTab);
    } else if (
      areaWiseReportData?.data &&
      areaWiseReportData?.data?.length > 0
    ) {
      setSelectedArea(areaWiseReportData.data[0].areaName);
    }
  }, [activeTab, areaWiseReportData]);

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (localStorage.getItem("pulseTour") !== "true") {
      const interval = setTimeout(() => {
        const areaNamesEl = document.querySelector("#areaNames");
        const anonymousEl = document.querySelector("#anonymous");
        console.log(areaNamesEl);
        console.log(anonymousEl);

        if (areaNamesEl && anonymousEl) {
          const tour = driver({
            showProgress: true,
            steps: [
              {
                element: "#areaNames",
                popover: {
                  title: "Pulse Focus Areas",
                  description:
                    "These categories represent key themes of employee feedback—like Communication, Leadership, Culture, and more. Explore each to understand where improvements or strengths lie.",
                  side: "right",
                },
              },
              {
                element: "#anonymous",
                popover: {
                  title: "Anonymous Feedback Trends",
                  description:
                    "This graph displays sentiment trends across all feedback areas—like Communication, Leadership, and Work Environment. Use it to track how employee sentiment shifts over time and spot early signs of engagement issues.",
                  side: "top",
                },
              },
            ],
            onDestroyStarted: () => {
              localStorage.setItem("pulseTour", "true");
              tour.destroy();
            },
          });
          tourRef.current = tour;
          tour.drive();
        }
      }, 300);

      return () => {
        clearTimeout(interval);
        if (tourRef.current) {
          tourRef.current.destroy();
          tourRef.current = null;
        }
      };
    }
  }, [isLoading]);

  if (isLoading) {
    return <AnonimityComponentShimmer />;
  }

  if (isError) {
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
    <div className="flex gap-3 w-full h-[calc(100vh-145px)] mb-3">
      {areaWiseReportData?.data || !areaWiseReportData?.data ? (
        <>
          <div
            className="w-[25%] flex flex-col bg-white rounded-md"
            style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
            id="areaNames"
          >
            <div>
              <p className="text-xl font-semibold text-[#3F4354] p-3">
                Area Names
              </p>
              <div className="h-[calc(100vh-250px)] overflow-y-auto">
                <div className="pr-1">
                  {areaWiseReportData?.data?.map((area: any) => (
                    <button
                      key={area.areaId}
                      onClick={() => setSelectedArea(area.areaName)}
                      className={`text-left  py-[12px] px-3 text-base font-semibold border-b-1 border-[#E8E8EC] cursor-pointer w-full ${
                        selectedArea === area.areaName
                          ? "bg-[#585DF9] text-white"
                          : "text-[#444] hover:bg-[#f8f8f8]"
                      }`}
                    >
                      {area.areaName.length > 33
                        ? area.areaName.slice(0, 33) + "..."
                        : area.areaName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="w-[75%] flex items-start justify-start bg-white rounded-md p-3"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
            id="anonymous"
          >
            <div
              className="bg-white rounded-md w-full"
              id="pulseAnonymousFeedbackTrends"
            >
              <div className="w-full flex justify-content-between mb-3">
                <p className="text-xl font-semibold text-[#3F4354]">
                  Anonymous Feedback Trends
                </p>
                <button
                  className="text-[#585df9] hover:underline transition-colors"
                  onClick={() => setSelectedArea("Insights")}
                >
                  All Areas Trends
                </button>
              </div>
              <div className="w-full flex gap-3">
                <div className="w-full">
                  {selectedArea === "Insights" ? (
                    <div className="h-[calc(100vh-250px)]">
                      <AllReportLineChart />
                    </div>
                  ) : (
                    <>
                      <div className="bg-white w-[160px] flex rounded-md mb-3 border-1 border-[#E8E8EC] overflow-hidden mt-2">
                        <button
                          className={`h-[40px] flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                            tabValue === 0
                              ? "bg-[#585DF9] text-white border-b-2 !border-b-[#585DF9] border-r-none"
                              : "border-b-2 border-white text-[#73737D]"
                          }`}
                          onClick={() => handleTabChange(0)}
                        >
                          Graph
                        </button>
                        <button
                          className={`h-[40px] flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                            tabValue === 1
                              ? "bg-[#585DF9] text-white border-b-2 !border-b-[#585DF9] border-r-none"
                              : "border-b-2 border-white text-[#73737D]"
                          }`}
                          onClick={() => handleTabChange(1)}
                        >
                          Questions
                        </button>
                      </div>
                      <div className="mt-3">
                        {tabValue === 0 && (
                          <div>
                            {areaWiseReportData?.data
                              .filter(
                                (area: any) => area.areaName === selectedArea
                              )
                              .map((area: any) => (
                                <LineChart key={area.areaId} area={area} />
                              ))}
                          </div>
                        )}
                        {tabValue === 1 && (
                          <div>
                            {areaWiseReportData?.data
                              .filter(
                                (area: any) => area.areaName === selectedArea
                              )
                              .map((area: any) => (
                                <QuestionDetails
                                  key={area.areaId}
                                  area={area}
                                />
                              ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          className="w-full bg-white h-[calc(100vh-145px)] rounded-md flex items-center justify-center text-center text-[#73737D]"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default Anonimity;
