import { useGetMyRecognitionQuery } from "../queries/profileQuery";
import Error from "../../../utilities/Error";
import { useDispatch, useSelector } from "react-redux";
import EmployeeName from "../../../common/EmployeeName";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import Avatars from "../../../common/Avatar";
import { setActiveTab } from "../slice/tabSlice";
import { useGetOrganizationDetailsQuery } from "../../global/queries/globalQuery";
import EmployeeRecognitionOverviewShimmer from "./shimmer/EmployeeRecognitionOverviewShimmer";

const EmployeeRecognitionOverview = () => {
  const navigate = useNavigate();
  const paramsData = useParams();
  const empId: any = paramsData.id;
  const recognitionType = "received-by";
  const dispatch = useDispatch();
  const handleTabClick = (value: string) => {
    dispatch(setActiveTab(value));
  };
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = empId
    ? empId
    : useSelector((state: any) => state.auth.userData["custom:empId"]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [recognitionsData, setRecognitionsData] = useState<any[]>([]);
  const [hasReachedBottom, setHasReachedBottom] = useState<boolean>(false);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: myRecognitionData,
    error: myRecognitionDataError,
    isLoading: myRecognitionDataIsLoading,
  } = useGetMyRecognitionQuery({ recognitionType, ORG_ID, EMP_ID, nextToken });

  const {
    data: organizationDetails,
    isError: organizationDetailsIsError,
    isLoading: organizationDetailsIsLoading,
  } = useGetOrganizationDetailsQuery(ORG_ID);

  const useTimeAgo = (timestamp: string | number) => {
    if (!timestamp) return "";
    const now = new Date();
    const time = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (seconds < 60) {
      return `${seconds}s ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours}h ago`;
    } else if (seconds < 604800) {
      const days = Math.floor(seconds / 86400);
      return `${days}d ago`;
    } else if (seconds < 2592000) {
      const weeks = Math.floor(seconds / 604800);
      return `${weeks}w ago`;
    } else if (seconds < 31536000) {
      const months = Math.floor(seconds / 2592000);
      return `${months}m ago`;
    } else {
      const years = Math.floor(seconds / 31536000);
      return `${years}y ago`;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const isAtBottom =
        containerRef.current.scrollHeight - containerRef.current.scrollTop <=
        containerRef.current.clientHeight;

      if (isAtBottom && !hasReachedBottom) {
        setNextToken(myRecognitionData?.nextToken);
        setHasReachedBottom(true);
      }
    };

    const currentContainer = containerRef.current;

    if (currentContainer) {
      currentContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasReachedBottom, recognitionsData, myRecognitionData]);

  useEffect(() => {
    if (myRecognitionData) {
      if (myRecognitionData.data.length > 0) {
        setRecognitionsData((prevRecognitions) => {
          const existingIds = new Set(
            prevRecognitions.map((recognition) => recognition.recognitionId)
          );
          const newRecognitions = myRecognitionData.data.filter(
            (recognition) => !existingIds.has(recognition.recognitionId)
          );
          return [...prevRecognitions, ...newRecognitions];
        });
      } else {
        setIsLoadingMore(false);
      }
      setIsLoadingMore(false);
    }
    setHasReachedBottom(false);
  }, [myRecognitionData]);

  useEffect(() => {
    if (nextToken) {
      setIsLoadingMore(true);
    } else {
      setIsLoadingMore(false);
    }
  }, [nextToken]);

  if (myRecognitionDataIsLoading || organizationDetailsIsLoading) {
    return <EmployeeRecognitionOverviewShimmer />;
  }

  if (myRecognitionDataError || organizationDetailsIsError) {
    return (
      <div
        className="flex justify-center items-center min-h-[30vh] p-3 mb-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  return (
    <>
      {myRecognitionData?.data?.length ? (
        <div
          className="min-h-[30vh] bg-white rounded-md mb-3 overflow-hidden"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <div className="flex items-center justify-between border-b-1 p-3 border-[#E8E8EC]">
            <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
              Recognitions
            </p>
            <p
              onClick={() => handleTabClick("recognition")}
              className="text-xs font-[400] !text-[#585DF9] cursor-pointer"
            >
              View all
            </p>
          </div>
          <div className="space-y-6">
            {recognitionsData && recognitionsData.length > 0 ? (
              recognitionsData
                .slice(0, 2)
                .map((recognition: any, index: number) => {
                  const isLast =
                    index === recognitionsData.slice(0, 2).length - 1;
                  return (
                    <div
                      className={`flex gap-2 p-3 ${
                        !isLast ? "border-b-1 border-[#E8E8EC]" : ""
                      } mb-0 cursor-pointer`}
                      key={recognition.recognitionId}
                      onClick={() => {
                        const orgId = ORG_ID;
                        const recognitionId = recognition.recognitionId;
                        const path = `${orgId}#${recognitionId}`;
                        const encodedPath = btoa(path);
                        navigate(`/feed/feed-link/Recognition_${encodedPath}`);
                      }}
                    >
                      <Avatars
                        name={
                          recognition?.recognitionGivenBy?.firstName ||
                          organizationDetails?.data?.organizationName
                        }
                        image={recognition?.recognitionGivenBy?.photo}
                        size={45}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="w-[75%]">
                            {recognition?.recognitionGivenBy?.firstName ? (
                              <EmployeeName
                                firstName={
                                  recognition?.recognitionGivenBy?.firstName
                                }
                                middleName={
                                  recognition?.recognitionGivenBy?.middleName
                                }
                                lastName={
                                  recognition?.recognitionGivenBy?.lastName
                                }
                                empId={
                                  recognition?.recognitionGivenBy?.employeeId
                                }
                                textVarient="text-base"
                                textColor="text-[#585DF9]"
                                fontWeight="font-semibold"
                              />
                            ) : (
                              <p className="text-base text-[#585DF9] font-semibold">
                                {organizationDetails?.data?.organizationName}
                              </p>
                            )}
                            <div className="flex items-center gap-1">
                              {/* <p className="text-[#878791] font-normal text-sm">
                                Head of Sales
                              </p>
                              <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i> */}
                              <p className="text-[#878791] font-normal text-sm">
                                {useTimeAgo(recognition?.timestamp)}
                              </p>
                            </div>
                            {recognition?.taggedEmployees ? (
                              <div className="flex gap-2 mt-2">
                                {recognition?.taggedEmployees.map(
                                  (employee: any) => (
                                    <div
                                      key={employee.employeeId}
                                      className="bg-[#F4F6F8] py-[2px] px-[8px] rounded"
                                    >
                                      <EmployeeName
                                        firstName={employee.firstName}
                                        middleName={employee.middleName}
                                        lastName={employee.lastName}
                                        empId={employee.employeeId}
                                        textVarient="text-[9px]"
                                        textColor="text-[#858EAD]"
                                        fontWeight="font-semibold"
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            ) : null}
                            <p
                              className={`${
                                recognition?.taggedEmployees.length > 0
                                  ? "mt-2"
                                  : "mt-0"
                              } font-normal text-sm leading-[20px]`}
                            >
                              {recognition?.recognitionContent}
                            </p>
                          </div>
                          {recognition.badgeDetails && (
                            <div className="w-[25%] flex flex-column justify-center items-center">
                              <img
                                src={recognition.badgeDetails.badgePhoto}
                                alt={recognition.badgeDetails.badgePhoto}
                                className="h-[80px] w-[80px]"
                              />
                              <p className="text-sm font-semibold text-[#3F4354]">
                                {recognition.badgeDetails.name}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="employee_recognition_no_data">
                <p>You don't have any recognition</p>
              </div>
            )}
          </div>

          {isLoadingMore && (
            <div className="flex justify-center p-0">
              <ThreeDotsLoading color="#585DF9" />
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default EmployeeRecognitionOverview;
