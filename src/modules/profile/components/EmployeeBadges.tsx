import { useState } from "react";
import Error from "../../../utilities/Error";
import Loading from "../../../utilities/Loading";
import { useSelector } from "react-redux";
import { useGetMyBadgesQuery } from "../../badge/queries/badgeQuery";
import BadgeCard from "../../badge/components/BadgeCard";
import { useParams } from "react-router-dom";
import EmployeeBadgesShimmer from "./shimmer/EmployeeBadgesShimmer";

const EmployeeBadges = () => {
  const paramsData = useParams();
  const empId: any = paramsData.id;
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = empId
    ? empId
    : useSelector((state: any) => state.auth.userData["custom:empId"]);
  const [isLoadingMore] = useState(false);
  const {
    data: myBadges,
    error,
    isLoading,
  } = useGetMyBadgesQuery({ ORG_ID, EMP_ID });

  if (isLoading) {
    return <EmployeeBadgesShimmer />;
  }

  if (error) {
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
      className="my-3 min-h-[calc(100vh-360px)] bg-white rounded-md border-1 border-[#E8E8EC]"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="flex items-center justify-between border-b-1 p-3 border-[#E8E8EC]">
        <p
          id="totalBadgesReceived"
          className="!text-base !text-[#3F4354] font-semibold m-0"
        >
          Total Badges Received: {myBadges?.data?.length}
        </p>
      </div>
      <div className="p-3 flex justify-center w-full">
        {myBadges?.data && myBadges?.data?.length > 0 ? (
          <BadgeCard
            badges={myBadges?.data}
            badgeType="My Badges"
            styleClasses={
              "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 w-full"
            }
          />
        ) : (
          <p className="text-[#73737D]">No badge found</p>
        )}
      </div>

      {isLoadingMore && (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default EmployeeBadges;
