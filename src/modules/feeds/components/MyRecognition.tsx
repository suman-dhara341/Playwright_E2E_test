import FeedContent from "./FeedContent";
import { useEffect, useState } from "react";
import { useGetMyRecognitionQuery } from "../queries/feedQuery";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";
import { useSelector } from "react-redux";
import NoFeedAvailable from "./NoFeedAvailable";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";

const MyRecognition = () => {
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const [feedsData, setFeedsData] = useState<any[]>([]);
  const [hasReachedBottom, setHasReachedBottom] = useState<boolean>(false);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const {
    data: feeds,
    error: allRecognitionError,
    isLoading: allRecognitionIsLoading,
  } = useGetMyRecognitionQuery(
    { ORG_ID, EMP_ID, nextToken }
  );

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;
      if (isAtBottom && !hasReachedBottom) {
        setNextToken(feeds?.nextToken);
        setHasReachedBottom(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasReachedBottom, feedsData, feeds]);

  useEffect(() => {
    if (feeds) {
      if (feeds.data.length > 0) {
        setFeedsData((prevFeeds) => {
          const existingIds = new Set(prevFeeds.map((feed) => feed.feedId));
          const newFeeds = feeds.data.filter(
            (feed: { feedId: any }) => !existingIds.has(feed.feedId)
          );
          return [...prevFeeds, ...newFeeds];
        });
      } else {
        setIsLoadingMore(false);
      }
      setIsLoadingMore(false);
    }
    setHasReachedBottom(false);
  }, [feeds]);

  useEffect(() => {
    if (nextToken) {
      setIsLoadingMore(true);
    }
  }, [nextToken]);

  if (allRecognitionIsLoading) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-200px)] p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
      >
        <Loading />
      </div>
    );
  }

  if (allRecognitionError) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-200px)] p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="w-full">
        {feedsData.length === 0 ? (
          <NoFeedAvailable />
        ) : (
          feedsData.map((feedData) => (
            <FeedContent key={feedData.feedId} data={feedData} />
          ))
        )}
        {isLoadingMore && (
          <div className="flex justify-center p-3">
            <Loading />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MyRecognition;
