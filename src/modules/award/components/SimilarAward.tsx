import { useSelector } from "react-redux";
import { useGetSearchEmployeesQuery } from "../../global/queries/globalQuery";
import Error from "../../../utilities/Error";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SimilarAwardShimmer from "./shimmer/SimilarAwardShimmer";

const SimilarAward = ({ awardDetails }: any) => {
  const navigate = useNavigate();
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );

  const debouncedTerm = awardDetails?.data?.awardName?.split(" ")[0];
  const searchCategory = "award";

  const {
    data: responseData,
    isLoading,
    isError,
  } = useGetSearchEmployeesQuery(
    { ORG_ID, keyword: debouncedTerm, category: searchCategory }
  );

  const handleAwardClick = (awardId: any) => {
    navigate(`/awards/${awardId}`);
  };
  if (isLoading) {
    return <SimilarAwardShimmer length = {6} grid={3}/>;
  }

  if (isError) {
    return (
      <div
        className="flex justify-center items-center mt-2 h-[calc(100vh-330px)] p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col p-3 bg-white !rounded-md gap-3 overflow-y-auto"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <p className="text-[#3F4354] text-base font-semibold">Similar Awards</p>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {responseData?.data?.map((award: any) => {
            const useTimeAgo = award?.createdAt
              ? new Intl.DateTimeFormat("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(award?.createdAt))
              : " ";
            return (
              <div
                className="flex flex-wrap justify-center gap-3"
                key={award?.awardId}
                onClick={() => handleAwardClick(award?.awardId)}
              >
                <div className="relative w-full h-34 bg-[#F4F6F8] border-1 border-[#F4F6F8] text-center text-black shadow-lg clip-path-award">
                  <div className="absolute top-0 px-2 py-3 left-1/2 -translate-x-1/2 text-sm font-bold bg-white w-full flex justify-center">
                    {award?.awardPhoto ? (
                      <img
                        src={award?.awardPhoto}
                        alt={award?.awardId}
                        className="w-14 h-14"
                      />
                    ) : (
                      <Trophy className="w-8 h-8" />
                    )}
                  </div>
                  <div className="absolute bottom-7 w-full left-1/2 -translate-x-1/2 text-xs bg-[#585DF9] text-white py-0.5 px-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {award?.awardName}
                  </div>
                  <div className="absolute w-[90%] bottom-4 left-1/2 -translate-x-1/2 text-xs font-semibold">
                    {useTimeAgo}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimilarAward;
