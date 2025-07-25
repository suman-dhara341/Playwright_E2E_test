import Error from "../../../utilities/Error";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetMyAwardsQuery } from "../../award/queries/awardQuery";
import { useState } from "react";
import { Trophy } from "lucide-react";
import SimilarAwardShimmer from "../../award/components/shimmer/SimilarAwardShimmer";

const EmployeeAwards = () => {
  const paramsData = useParams();
  const empId: any = paramsData.id;
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
    return <SimilarAwardShimmer length={16} grid={8} />;
  }

  if (myAwardsError) {
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
      <div className="flex flex-col pb-2">
        <div className="flex items-center justify-between border-b-1 p-3 border-[#E8E8EC]">
          <p
            id="totalAwardsReceived"
            className="!text-base !text-[#3F4354] font-semibold m-0"
          >
            Total Awards Received: {myAwardData?.data?.length}
          </p>
        </div>
        {myAwardData?.data && myAwardData?.data?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-6 p-3">
            {displayedAwards?.map((award, index) => {
              const useTimeAgo = award?.awardDetails?.createdAt
                ? new Intl.DateTimeFormat("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(award?.awardDetails?.createdAt))
                : "-";
              return (
                <div
                  className="flex flex-wrap justify-center gap-6 cursor-pointer"
                  key={index}
                  onClick={() => handleAwardClick(award?.awardDetails?.awardId)}
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
        ) : (
          <div className="flex justify-center items-center h-[calc(100vh-430px)]">
            <p className="text-[#73737D]">No Awards found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAwards;
