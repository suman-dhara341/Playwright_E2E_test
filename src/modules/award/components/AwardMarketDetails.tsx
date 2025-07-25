import { CalendarDays, Trophy } from "lucide-react";
import { useGetAwardDetailsQuery } from "../queries/awardQuery";
import { useRef } from "react";
import Error from "../../../utilities/Error";
import { useSelector } from "react-redux";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import "../css/award.css";
import AwardMarketDetailsShimmer from "./shimmer/AwardMarketDetailsShimmer";

const AwardMarketDetails = ({ selectedAward }: any) => {
  console.log(selectedAward, "selectedAward");
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const awardId = selectedAward?.awardId;
  const awardRef = useRef<HTMLDivElement | null>(null);

  const {
    data: awardDetails,
    isError: awardDetailsIsError,
    isLoading: awardDetailsIsLoading,
    isFetching: awardDetailsIsFetching,
  } = useGetAwardDetailsQuery({ ORG_ID, awardId }, { skip: !awardId });

  const useTimeAgo = awardDetails?.data.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(awardDetails?.data?.createdAt))
    : "-";

  const cleanCriteria = (criteria: string | undefined) => {
    if (!criteria) return "";
    const strippedCriteria = criteria.replace(/<p>\s*<br>\s*<\/p>/g, "").trim();
    return strippedCriteria || "";
  };

  if (awardDetailsIsLoading || awardDetailsIsFetching) {
    return <AwardMarketDetailsShimmer />;
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
        <div className="flex flex-col gap-3">
          <div
            ref={awardRef}
            className="flex flex-col w-full bg-white rounded-md"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            <div className="flex w-full flex-row gap-6 p-3 justify-between items-start border-b-1 border-[#E8E8EC]">
              <div className="flex w-[80%] flex-col gap-2">
                <p className="text-[#585DF9] text-[22px] font-semibold mb-1">
                  {awardDetails?.data.awardName}
                </p>
                <p className="text-sm mb-3">{awardDetails?.data.description}</p>
              </div>
              <div className="w-[20%] flex items-start justify-center">
                {awardDetails?.data?.awardPhoto ? (
                  <img
                    src={awardDetails?.data?.awardPhoto}
                    alt={awardDetails?.data?.awardPhoto.toLocaleUpperCase()}
                    className="h-28 w-auto"
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
              </div>
            </div>
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
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AwardMarketDetails;
