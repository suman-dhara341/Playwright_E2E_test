import { useState } from "react";
import { useGetEmployeeActivityQuery } from "../queries/profileQuery";
import { useSelector } from "react-redux";
import Error from "../../../utilities/Error";
import EmployeeActivityLayout from "./EmployeeActivityLayout";
import { useParams } from "react-router-dom";
import EmployeeActivityOverviewShimmer from "./shimmer/EmployeeActivityOverviewShimmer";

const EmployeeActivityOverview = () => {
  const paramsData = useParams();
  const empId: any = paramsData.id;
  const logInUserId = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = empId ? empId : logInUserId;
  const profileOwner = empId === undefined || logInUserId === empId;
  const [nextToken] = useState<string | null>(null);
  const {
    data: activityData,
    isError: activityIsError,
    isLoading: activityIsLoading,
  } = useGetEmployeeActivityQuery({ ORG_ID, EMP_ID, nextToken });

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
      case "Goal-Create":
        linkToNavigate = `${domainName}/goal-details/${serviceRecordId}`;
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

  if (activityIsLoading) {
    return <EmployeeActivityOverviewShimmer />;
  }

  if (activityIsError) {
    return (
      <div className="flex justify-center items-center min-h-[20vh] p-3 mb-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }
  return (
    <div className="w-full flex items-start justify-center bg-white rounded-md min-h-[15vh]">
      {activityData?.data?.length === 0 ? (
        <div className="flex justify-center items-center min-h-[15vh]">
          <p className="text-center text-[#73737D]">
            You haven't done any activity.
          </p>
        </div>
      ) : (
        <ul className="w-full p-0 m-0">
          {activityData?.data.slice(0, 3).map((data) => {
            console.log(data.notificationId);

            return (
              <li
                id={data?.notificationId}
                key={data?.notificationId}
                onClick={() => handleClickToRedirect(data)}
                className="flex gap-2 cursor-pointer py-2 px-3 bg-white hover:!bg-gray-100"
              >
                <EmployeeActivityLayout
                  data={data}
                  profileOwner={profileOwner}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default EmployeeActivityOverview;
