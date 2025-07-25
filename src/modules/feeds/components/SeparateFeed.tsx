import { useSelector } from "react-redux";
import { useGetFeedsByIdQuery } from "../queries/feedQuery";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";
import { useParams } from "react-router-dom";
import FeedContent from "../components/FeedContent";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";

const SeparateFeed = () => {
  const params = useParams();
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const FeedId: any = params.id;
  const {
    data: feedsData,
    error: feedListError,
    isLoading: feedListIsLoading,
  } = useGetFeedsByIdQuery({ ORG_ID, FeedId });

  if (feedListIsLoading) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-200px)] p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
      >
        <Loading />
      </div>
    );
  }

  if (feedListError) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-200px)] p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  const mappedFeedsArray = feedsData?.data ? [feedsData.data] : [];

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {mappedFeedsArray.map((feedData) => (
        <FeedContent key={feedData.feedId} data={feedData} />
      ))}
    </ErrorBoundary>
  );
};

export default SeparateFeed;
