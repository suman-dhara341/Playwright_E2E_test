import {
  CalendarDays,
  Hourglass,
  ThumbsDown,
  ThumbsUp,
  Trophy,
} from "lucide-react";
import { useParams } from "react-router-dom";
import {
  useGetAwardByIdQuery,
  useGetAwardRecivesQuery,
  useGetAwardsRequestListQuery,
  useLazyAwardRequestAssignQuery,
  useLazyDeleteAwardQuery,
  useLazyGetEmployeeBulkListQuery,
} from "../queries/awardQuery";
import React, { useEffect, useRef, useState } from "react";
import Error from "../../../utilities/Error";
import { useSelector } from "react-redux";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import { AwardRequestPendingItem } from "../interfaces";
import Avatar from "../../../common/Avatar";
import EmployeeName from "../../../common/EmployeeName";
import RequestAward from "./RequestAward";
import AcceptRequestDialog from "./AcceptRequestDialog";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import AwardEditComponent from "./AwardEditComponent";
import { showToast } from "../../../utilities/toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import SimilarAward from "./SimilarAward";
import "../css/award.css";
import AwardDescriptionShimmer from "./shimmer/AwardDescriptionShimmer";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const AwardDescription: React.FC = () => {
  const [requestAwardOpen, setRequestAwardOpen] = useState(false);
  const [acceptRequest, setAcceptRequest] = useState(false);
  const [request, setRequest] = useState<AwardRequestPendingItem>();
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [nextToken] = useState<string | null>(null);
  const { awardId }: any = useParams<{ awardId: string }>();
  const [awardDetailsUpdated, setAwardDetailsUpdated] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const awardRef = useRef<HTMLDivElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const tourRef = useRef<any>(null);
  const {
    data: awardDetails,
    error: awardDetailsIsError,
    isLoading: awardDetailsIsLoading,
    refetch: awardDetailsRefetch,
  } = useGetAwardByIdQuery({ ORG_ID, EMP_ID, awardId });

  const [awardDisable] = useLazyDeleteAwardQuery();
  const { data: awardReceives, refetch: awardReceivesRefetch } =
    useGetAwardRecivesQuery({ ORG_ID, awardId, nextToken });
  const AwardModarator = awardDetails?.data?.moderatorId || [];
  const isModerator = AwardModarator.some((mod: any) => mod === EMP_ID);
  const [
    triggerGetEmployeeBulkList,
    {
      data: awardModeratorList,
      isLoading: awardModeratorListIsLoading,
      isError: awardModeratorListIsError,
    },
  ] = useLazyGetEmployeeBulkListQuery();

  const handleModeratorFetch = () => {
    triggerGetEmployeeBulkList({ ORG_ID, EMPLOYEE_IDS: AwardModarator });
  };

  const handleAwardDisable = async () => {
    setIsSubmitting(true);
    try {
      await awardDisable({ ORG_ID, awardId }).unwrap();
      showToast("Award status changed", "success");
      await awardDetailsRefetch();
      setIsSubmitting(false);
    } catch (error: any) {
      showToast(error?.data?.message || "An error occurred", "error");
      setIsSubmitting(false);
    }
  };

  const showPendingList = awardDetails?.data?.moderatorId?.includes(EMP_ID);
  const { data: awardRequestList, refetch } = useGetAwardsRequestListQuery({
    ORG_ID,
    awardId,
  });

  const handleRequestAwardClose = () => {
    setRequestAwardOpen(false);
    refetch();
  };

  const useTimeAgo = awardDetails?.data.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(awardDetails?.data?.createdAt))
    : "-";

  useEffect(() => {
    awardDetailsRefetch?.();
    awardReceivesRefetch?.();
    refetch?.();
  }, [awardDetailsUpdated]);

  const [loadingRequests, setLoadingRequests] = useState<{
    [key: string]: boolean;
  }>({});

  const [awardRequestAssign] = useLazyAwardRequestAssignQuery();

  const cleanCriteria = (criteria: string | undefined) => {
    if (!criteria) return "";
    const strippedCriteria = criteria.replace(/<p>\s*<br>\s*<\/p>/g, "").trim();
    return strippedCriteria || "";
  };
  const handleApprove = (request: AwardRequestPendingItem) => {
    const requestId = request.requestId;
    const status = "assigned";
    const comment = "Request accepted by Moderator";
    const givenBy = EMP_ID;
    const awardReceivedBy = request?.employeeDetails?.employeeId;

    const awardRequestDescription = JSON.stringify({
      requestId,
      status,
      comment,
      awardReceivedBy,
      givenBy,
    });
    setLoadingRequests((prevState) => ({
      ...prevState,
      [request.awardId]: true,
    }));

    awardRequestAssign({
      ORG_ID,
      awardId: request.awardId,
      awardRequestDescription,
    })
      .unwrap()
      .then(() => {
        setLoadingRequests((prevState) => ({
          ...prevState,
          [request.awardId]: false,
        }));
        refetch();
        setAwardDetailsUpdated(true);
      })
      .catch(() => {
        setLoadingRequests((prevState) => ({
          ...prevState,
          [request.awardId]: false,
        }));
      });
  };

  const handleAcceptRequestClose = () => {
    setAcceptRequest(false);
  };

  const handleAcceptRequest = () => {
    if (request) handleApprove(request);
    setTimeout(() => handleAcceptRequestClose(), 300);
  };

  const totalPending = awardDetails?.data?.totalPendingRequest ?? 0;
  const totalWinners = awardDetails?.data?.totalWinners ?? 0;
  const totalRequests = totalPending + totalWinners;

  const acceptancePercentage =
    totalRequests > 0 ? Math.round((totalWinners / totalRequests) * 100) : 0;

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (localStorage.getItem("awardDetailsTour") === "true") return;

    const timeout = setTimeout(() => {
      const awardsDetailsEl = document.querySelector("#awards-details");
      const AnalyticsEl = document.querySelector("#analytics");
      if (AnalyticsEl && awardsDetailsEl) {
        const tour = driver({
          showProgress: true,
          steps: [
            {
              element: "#awards-details",
              popover: {
                title: "Award Details",
                description:
                  "View full details of the selected award, including its criteria, moderators, status, and creation date. You can also request this award by providing evidence which demonstrates that you're eligible for this award.",
                side: "bottom",
              },
            },
            {
              element: "#analytics",
              popover: {
                title: "Award Status Overview",
                description:
                  "You can see the entire award metadata information in this section, including award analytics about acceptance rate, winners, similar awards. This section will also show pending award requests, if you are the moderator of this award.",
                side: "bottom",
              },
            },
          ],
          onDestroyStarted: () => {
            localStorage.setItem("awardDetailsTour", "true");
            tour.destroy();
          },
        });

        tour.drive();
        tourRef.current = tour;
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (tourRef.current) {
        tourRef.current.destroy();
        tourRef.current = null;
      }
    };
  }, [awardRequestList, awardDetails]);

  if (awardDetailsIsLoading) {
    return <AwardDescriptionShimmer />;
  }

  if (awardDetailsIsError) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-90px)] p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="flex flex-row w-full gap-3 mb-3">
        <div id="awards-details" className="flex flex-col w-[65%] gap-3">
          <div
            ref={awardRef}
            className="flex flex-col w-full bg-white rounded-md"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            <div className="flex w-full flex-row gap-6 p-3 justify-between items-start border-b-1 border-[#E8E8EC]">
              <div className="flex w-[80%] flex-col gap-2">
                <p id="award_details_name" className="text-[#585DF9] text-[22px] font-semibold mb-1">
                  {awardDetails?.data.awardName}
                </p>
                <p className="text-sm mb-3">{awardDetails?.data.description}</p>
              </div>
              <div className="w-[20%] flex items-start justify-center">
                {awardDetails?.data?.awardPhoto ? (
                  <img
                    src={awardDetails?.data?.awardPhoto}
                    alt={awardDetails?.data?.awardPhoto.toLocaleUpperCase()}
                    className="h-20 w-auto"
                  />
                ) : (
                  <Trophy className="w-12 h-12" />
                )}
              </div>
            </div>
            <div className="py-2 px-3 flex flex-row justify-between">
              <div className="flex flex-row items-center gap-3">
                <div className="flex items-center text-[#73737D]">
                  <CalendarDays className="h-5 w-5 mr-2 text-[#585DF9]" />
                  <span className="text-[#587BAE]">{useTimeAgo}</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                  <span className="text-[#587BAE]">
                    {awardDetails?.data?.totalWinners}
                  </span>
                </div>
                <div className="flex">
                  <div
                    className={`flex items-center justify-center border-1 rounded-[20px] px-3 py-0 text-xs text-center min-w-[75px] h-[24px] ${
                      awardDetails?.data.active
                        ? "!border-[#3FBB58] bg-[#3FBB5861]"
                        : "!border-[#f52d2d7b] bg-[#e3737361]"
                    } `}
                  >
                    {isSubmitting ? (
                      <ThreeDotsLoading
                        color={`${
                          awardDetails?.data?.active ? "#3FBB58" : "#f52d2d7b"
                        }`}
                      />
                    ) : (
                      `${awardDetails?.data?.active ? "Active" : "In Active"}`
                    )}
                  </div>
                  {isModerator ? (
                    <button
                      onClick={() => setMenuOpen((prev) => !prev)}
                      className="p-1 rounded-full"
                    >
                      <BsThreeDotsVertical size={16} />
                    </button>
                  ) : null}
                </div>
                <div className="relative inline-block">
                  {menuOpen && awardDetails?.data && (
                    <div className="absolute left-[-35px] mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleAwardDisable();
                        }}
                        className={`w-full py-2 !rounded-md ${
                          !awardDetails?.data?.active
                            ? "text-[#3FBB58]"
                            : "text-[#f52d2d7b]"
                        } hover:${
                          !awardDetails?.data?.active
                            ? "bg-[#3FBB5861]"
                            : "bg-[#e3737361]"
                        }`}
                      >
                        {!awardDetails?.data?.active ? "Active" : "Inactive"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                {awardDetails?.data?.moderatorId?.length || 0 > 0 ? (
                  awardDetails?.data?.myRequestStatus ? (
                    <div className="flex gap-1 items-center">
                      <p className="capitalize text-[#3F4354] font-semibold">
                        Status:
                      </p>
                      <p
                        className={`capitalize ${
                          awardDetails?.data?.myRequestStatus?.status ===
                          "pending"
                            ? "text-[#73737D]"
                            : "text-green-500"
                        } font-semibold`}
                      >
                        {awardDetails?.data?.myRequestStatus?.status}
                      </p>
                    </div>
                  ) : (
                    <button
                      className="bg-gradient-to-b from-[#7E92F8] to-[#6972F0] text-white text-xs !rounded-md p-2"
                      onClick={() => setRequestAwardOpen(true)}
                    >
                      Request Award
                    </button>
                  )
                ) : null}
                {isModerator ? (
                  <button
                    className="bg-gradient-to-b from-[#7E92F8] to-[#6972F0] text-white text-xs !rounded-md p-2 min-w-[75px]"
                    onClick={() => setDrawerOpen(true)}
                  >
                    Edit
                  </button>
                ) : null}
              </div>
              <AwardEditComponent
                isLoading={awardDetailsIsLoading}
                award={awardDetails?.data}
                handleDrawerClose={handleDrawerClose}
                drawerOpen={drawerOpen}
              />
            </div>

            {awardDetails?.data?.moderatorId?.length ? (
              <div className="px-3 pb-3 flex flex-row justify-between">
                <div className="flex flex-row gap-1 items-center">
                  <p className="text-[#3F4354] text-xs font-semibold">
                    Moderators:{" "}
                  </p>

                  {awardModeratorListIsLoading ? (
                    <ThreeDotsLoading color={"#585DF9"} />
                  ) : awardModeratorListIsError ? (
                    <span className="text-xs text-red-500">
                      Failed to load moderators
                    </span>
                  ) : awardModeratorList?.data?.length ? (
                    awardModeratorList.data.map((moderator, index) => (
                      <div
                        key={moderator.employeeId}
                        className="flex gap-1 items-center"
                      >
                        <EmployeeName
                          firstName={moderator?.firstName}
                          middleName={moderator?.middleName}
                          lastName={moderator?.lastName}
                          empId={moderator?.employeeId}
                          textColor={"!text-[#587BAE]"}
                          fontWeight={"font-semibold"}
                          textVarient={"!text-xs"}
                        />
                        {index !== awardModeratorList.data.length - 1 && (
                          <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
                        )}
                      </div>
                    ))
                  ) : (
                    <button
                      onClick={handleModeratorFetch}
                      className="text-sm text-[#585DF9] font-semibold hover:underline"
                    >
                      View Moderators
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div
            className="bg-white w-full p-3 !rounded-md min-h-[150px]"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            {cleanCriteria(awardDetails?.data?.criteria) ? (
              <>
                <p className="text-[#3F4354] text-base font-semibold">
                  Criteria
                </p>
                <div
                  className="text-sm mt-2 award_criteria"
                  dangerouslySetInnerHTML={{
                    __html: awardDetails?.data?.criteria || "",
                  }}
                />
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[100px]">
                <p className="text-base text-[#73737D] pl-1 mt-2">
                  No criteria available.
                </p>
              </div>
            )}
          </div>
          {awardReceives?.data?.length ? (
            <div
              className="flex flex-col bg-white p-3 overflow-auto rounded-md gap-3 max-h-[calc(100vh-430px)]"
              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
            >
              <p className="text-[#3F4354] text-base whitespace-nowrap font-semibold">
                Award Winners
              </p>
              <div className="flex flex-col">
                {awardReceives?.data.map((award: any) => {
                  const useTimeAgo = (date: string) =>
                    date
                      ? new Intl.DateTimeFormat("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(date))
                      : "-";
                  return (
                    <div
                      key={award.receivedDate}
                      className="flex items-end justify-between mb-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={award?.employeeDetails?.firstName}
                          image={award.employeeDetails?.photo || ""}
                          size={40}
                        />
                        <div>
                          <EmployeeName
                            firstName={award?.employeeDetails?.firstName}
                            middleName={award?.employeeDetails?.middleName}
                            lastName={award?.employeeDetails?.lastName}
                            empId={award?.employeeDetails?.employeeId}
                            textColor={"!text-[#585DF9]"}
                            fontWeight={"font-semibold"}
                            textVarient={"!text-sm"}
                          />
                          <p className="text-[#73737D] !font-normal !text-[#878791]">
                            {
                              award?.employeeDetails?.designation
                                ?.designationName
                            }
                          </p>
                        </div>
                      </div>
                      <span className="text-[#73737D] !font-normal !text-[#878791]">
                        {useTimeAgo(award?.receivedDate)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col w-[35%] gap-3">
          {showPendingList && awardRequestList?.data.length ? (
            <div
              className="bg-white p-3 !rounded-md gap-3 overflow-y-auto max-h-[50vh]"
              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
            >
              <p className="text-[#3F4354] text-base whitespace-nowrap font-semibold mb-3">
                Pending Award Requests
              </p>
              <div className="flex flex-col gap-3 w-full">
                {awardRequestList?.data?.map(
                  (request: AwardRequestPendingItem, index: number) => {
                    const mod: any = request?.moderators?.[EMP_ID];
                    const currentModeratorStatus =
                      mod && typeof mod === "object" && "status" in mod
                        ? mod.status
                        : null;
                    const hasCurrentModeratorApproved =
                      currentModeratorStatus === "approved" ||
                      currentModeratorStatus === "rejected";
                    const moderatorStatuses = Object.values(
                      request?.moderators || {}
                    );
                    const statusCounts = moderatorStatuses.reduce(
                      (acc: Record<string, number>, mod: any) => {
                        const status = mod.status || "unknown";
                        acc[status] = (acc[status] || 0) + 1;
                        return acc;
                      },
                      {}
                    );

                    return (
                      <div
                        className="flex flex-row gap-[60px] justify-between w-full"
                        key={index}
                      >
                        <div className="flex flex-row gap-2">
                          <Avatar
                            name={request?.employeeDetails?.firstName}
                            image={request.employeeDetails?.photo || ""}
                            size={40}
                          />
                          <div className="flex flex-col justify-center">
                            <p className="flex flex-row text-[#585DF9] text-sm font-semibold whitespace-nowrap">
                              {request?.employeeDetails?.firstName}{" "}
                              {request?.employeeDetails?.lastName}
                            </p>
                            {request?.employeeDetails?.designation
                              ?.designationName && (
                              <p className="text-[#73737D] text-xs font-normal whitespace-nowrap">
                                {
                                  request.employeeDetails.designation
                                    .designationName
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-row ml-4 gap-2">
                          {!hasCurrentModeratorApproved ? (
                            <button
                              className={`flex justify-center items-center text-white text-xs px-2 py-1 bg-[#585DF9] min-w-[100px] !rounded-md font-semibold`}
                              onClick={() => {
                                setRequest(request);
                                setAcceptRequest(true);
                              }}
                            >
                              Evidence
                            </button>
                          ) : (
                            <div className="flex gap-2 items-center">
                              <div className="flex gap-1 items-center font-semibold">
                                <div className="bg-green-500 h-5 w-5 rounded-full flex items-center justify-center">
                                  <ThumbsUp className="w-3 h-3 text-white" />
                                </div>
                                {statusCounts["approved"] || 0}
                              </div>
                              <div className="flex gap-1 items-center font-semibold">
                                <div className="bg-yellow-500 h-5 w-5 rounded-full flex items-center justify-center">
                                  <Hourglass className="w-3 h-3 text-white" />
                                </div>
                                <p>{statusCounts["pending"] || 0}</p>
                              </div>
                              <div className="flex gap-1 items-center font-semibold">
                                <div className="bg-red-500 h-5 w-5 rounded-full flex items-center justify-center">
                                  <ThumbsDown className="w-3 h-3 text-white" />
                                </div>
                                {statusCounts["rejected"] || 0}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ) : null}
          <div
            id="analytics"
            className="flex flex-col p-3 bg-white !rounded-md gap-3 overflow-y-auto"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            <div className="flex flex-row justify-between items-center">
              <p className="text-[#3F4354] text-base font-semibold">
                Analytics
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border-1 border-[#E8E8EC] rounded-md w-full p-2">
                <p className="text-sm text-[#000000B2] !font-semibold mb-2">
                  Acceptance
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold">{acceptancePercentage} %</p>
                </div>
              </div>
              <div className="border-1 border-[#E8E8EC] rounded-md w-full p-2">
                <p className="text-sm text-[#000000B2] !font-semibold mb-2">
                  Winners
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold">
                    {awardDetails?.data?.totalWinners}
                  </p>
                </div>
              </div>

              <div className="border-1 border-[#E8E8EC] rounded-md w-full p-2">
                <p className="text-sm text-[#000000B2] !font-semibold mb-2">
                  Pending
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold">
                    {awardDetails?.data?.totalPendingRequest}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <SimilarAward awardDetails={awardDetails} />
        </div>
        {acceptRequest && request && (
          <AcceptRequestDialog
            request={request}
            onClose={handleAcceptRequestClose}
            onAccept={handleAcceptRequest}
            loadingRequests={loadingRequests}
            refetch={refetch}
          />
        )}
        {requestAwardOpen && (
          <RequestAward
            onClose={handleRequestAwardClose}
            awardId={awardDetails?.data.awardId ?? ""}
            awardDetailsRefetch={awardDetailsRefetch}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AwardDescription;
