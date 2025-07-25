import Error from "../../../utilities/Error";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetMyAwardsQuery } from "../../award/queries/awardQuery";
import { useState } from "react";
import { setActiveTab } from "../slice/tabSlice";
import { Trophy } from "lucide-react";
import EmployeeAwardsOverviewShimmer from "./shimmer/EmployeeAwardsOverviewShimmer";

const EmployeeAwardsOverview = () => {
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
  const [nextToken] = useState<string | null>(null);
  const {
    data: myAwardData,
    error: myAwardsError,
    isLoading: myAwardsIsLoading,
  } = useGetMyAwardsQuery({ ORG_ID, EMP_ID, nextToken });
  const navigate = useNavigate();
  const displayedAwards = myAwardData?.data ?? [];

  const handleAwardClick = (awardId: any) => {
    navigate(`/awards/${awardId}`);
  };

  if (myAwardsIsLoading) {
    return <EmployeeAwardsOverviewShimmer />;
  }

  if (myAwardsError) {
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
      {displayedAwards.length > 0 ? (
        <div
          className="min-h-[30vh] bg-white rounded-md mb-3"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <div className="flex items-center justify-between border-b-1 p-3 border-[#E8E8EC] mb-3">
            <p
              id="award"
              className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]"
            >
              Awards
            </p>
            <p
              onClick={() => handleTabClick("awards")}
              className="text-xs font-[400] !text-[#585DF9] cursor-pointer"
            >
              View all
            </p>
          </div>
          <div className="space-y-6 p-3 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {displayedAwards?.slice(0, 20)?.map((award, index) => {
                const useTimeAgo = award?.awardDetails?.createdAt
                  ? new Intl.DateTimeFormat("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(award?.awardDetails?.createdAt))
                  : "-";
                return (
                  <div
                    className="flex flex-wrap justify-center gap-3 cursor-pointer"
                    key={index}
                    onClick={() =>
                      handleAwardClick(award?.awardDetails?.awardId)
                    }
                  >
                    <div className="relative w-full h-34 bg-[#F4F6F8] border-1 border-[#F4F6F8] text-center text-black shadow-lg clip-path-award">
                      <div className="absolute top-0 p-2 left-1/2 -translate-x-1/2 text-sm font-bold bg-white w-full flex justify-center">
                        {award?.awardDetails?.awardPhoto ? (
                          <img
                            src={award?.awardDetails?.awardPhoto}
                            alt={award?.awardDetails?.awardId}
                            className="w-14 h-14"
                          />
                        ) : (
                          <div className="h-18">
                            <Trophy className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-11 w-full left-1/2 -translate-x-1/2 text-xs bg-[#585DF9] text-white py-0.5 px-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        {award?.awardDetails?.awardName}
                      </div>
                      <div className="absolute w-[90%] bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold">
                        {useTimeAgo}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default EmployeeAwardsOverview;
