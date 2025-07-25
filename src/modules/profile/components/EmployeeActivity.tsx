import { useEffect, useRef, useState } from "react";
import { useGetEmployeeActivityQuery } from "../queries/profileQuery";
import { useSelector } from "react-redux";
import Error from "../../../utilities/Error";
import EmployeeActivityLayout from "./EmployeeActivityLayout";
import { useParams } from "react-router-dom";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import EmployeeActivityShimmer from "./shimmer/EmployeeActivityShimmer";

const EmployeeActivity = () => {
  const { id } = useParams();
  const empId: string = id as string;
  const logInUserId = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = empId ? empId : logInUserId;
  const profileOwner = empId === undefined || logInUserId === empId;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [queryArgs, setQueryArgs] = useState<{
    ORG_ID: string;
    EMP_ID: string;
    nextToken: string | null;
  }>({
    ORG_ID,
    EMP_ID,
    nextToken: null,
  });

  const {
    data: activityDataresponse,
    isError: activityIsError,
    isLoading: activityIsLoading,
  } = useGetEmployeeActivityQuery(queryArgs);

  const domainName = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? ":" + window.location.port : ""
  }`;

  const handleClickToRedirect = (data: any) => {
    const { notificationSlug, serviceRecordId } = data;
    let linkToNavigate = "";

    switch (notificationSlug) {
      case "notification-Request":
        linkToNavigate = `${domainName}/notifications/${serviceRecordId}`;
        break;
      case "Award-Request":
        linkToNavigate = `${domainName}/awards/${serviceRecordId}`;
        break;
      case "Feed-Like":
      case "Feed-Comment":
      case "notification-Get":
      case "Recognition-Get":
        linkToNavigate = `${domainName}/feed/feed-link/${serviceRecordId}`;
        break;
      default:
        console.warn("Unknown notification type:", notificationSlug);
        return;
    }

    if (linkToNavigate) {
      window.location.href = linkToNavigate;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const isAtBottom =
        containerRef.current.scrollHeight - containerRef.current.scrollTop <=
        containerRef.current.clientHeight + 10;

      if (isAtBottom && nextToken && !isLoadingMore) {
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
  }, [nextToken, isLoadingMore]);

  useEffect(() => {
    if (activityDataresponse?.data?.length) {
      setActivityData((prev) => {
        const existingIds = new Set(prev.map((item) => item.notificationId));
        const newItems = activityDataresponse.data.filter(
          (item) => !existingIds.has(item.notificationId)
        );
        return [...prev, ...newItems];
      });

      setNextToken(activityDataresponse?.nextToken || null);
    }

    setIsLoadingMore(false);
    setHasReachedBottom(false);
  }, [activityDataresponse]);

  useEffect(() => {
    if (hasReachedBottom && nextToken) {
      setIsLoadingMore(true);
      setQueryArgs({ ORG_ID, EMP_ID, nextToken });
    }
  }, [hasReachedBottom, nextToken, ORG_ID, EMP_ID]);

  if (activityIsLoading) {
    return <EmployeeActivityShimmer />;
  }

  if (activityIsError) {
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
    <div>
      <div
        className="my-3 min-h-[calc(100vh-360px)] bg-white rounded-md border-1 border-[#E8E8EC]"
        style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
      >
        <div className="flex items-center justify-between border-b-1 p-3 border-[#E8E8EC]">
          <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
            Activity
          </p>
        </div>
        {activityData.length === 0 ? (
          <div className="flex justify-center items-center h-[calc(100vh-430px)]">
            <p className="text-center text-[#73737D]">
              You haven't done any activity.
            </p>
          </div>
        ) : (
          <>
            <div
              ref={containerRef}
              className="h-[calc(100vh-360px)] overflow-y-scroll"
            >
              <ul className="p-0 m-0">
                {activityData.map((data) => (
                  <li
                    key={data?.notificationId}
                    onClick={() => handleClickToRedirect(data)}
                    className="flex gap-2 cursor-pointer py-2 px-3 bg-white hover:!bg-gray-100"
                  >
                    <EmployeeActivityLayout
                      data={data}
                      profileOwner={profileOwner}
                    />
                  </li>
                ))}
              </ul>
            </div>
            {isLoadingMore && (
              <div className="flex justify-center py-2">
                <ThreeDotsLoading color="#585DF9" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeActivity;
