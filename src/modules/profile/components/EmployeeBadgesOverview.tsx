import { useState } from "react";
import Error from "../../../utilities/Error";
import Loading from "../../../utilities/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useGetMyBadgesQuery } from "../../badge/queries/badgeQuery";
import BadgeCard from "../../badge/components/BadgeCard";
import { useParams } from "react-router-dom";
import { setActiveTab } from "../slice/tabSlice";
import EmployeeBadgesOverviewShimmer from "./shimmer/EmployeeBadgesOverviewShimmer";

const EmployeeBadgesOverview = () => {
  const paramsData = useParams();
  const empId: any = paramsData.id;
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
  const [isLoadingMore] = useState(false);
  const {
    data: myBadgesData,
    isLoading: myBadgeIsLoading,
    error: myBadgeIsError,
  } = useGetMyBadgesQuery({ ORG_ID, EMP_ID });

  if (myBadgeIsLoading) {
    return <EmployeeBadgesOverviewShimmer />;
  }

  if (myBadgeIsError) {
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
    <div>
      {myBadgesData?.data?.length ? (
        <div
          className="min-h-[30vh] bg-white rounded-md mb-3"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <div className="flex items-center justify-between border-b-1 p-3 border-[#E8E8EC]">
            <p
              id="badges"
              className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]"
            >
              Badges
            </p>
            <p
              onClick={() => handleTabClick("badges")}
              className="text-xs font-[400] !text-[#585DF9] cursor-pointer"
            >
              View all
            </p>
          </div>
          <div className="space-y-6">
            {myBadgesData?.data && myBadgesData?.data?.length > 0 ? (
              <BadgeCard
                badges={myBadgesData?.data?.slice(0, 20)}
                badgeType="My Badges Overview"
                styleClasses={
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-0"
                }
              />
            ) : (
              <div>No badge found</div>
            )}
            {isLoadingMore && (
              <div>
                <Loading />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EmployeeBadgesOverview;
