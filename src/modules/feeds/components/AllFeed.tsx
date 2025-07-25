import FeedContent from "./FeedContent";
import { useEffect, useState } from "react";
import { useGetFeedsQuery } from "../queries/feedQuery";
import Error from "../../../utilities/Error";
import { useSelector } from "react-redux";
import NoFeedAvailable from "./NoFeedAvailable";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import AllFeedShimmer from "./shimmer/AllFeedShimmer";

const AllFeed = () => {
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
    error: feedListError,
    isLoading: feedListIsLoading,
  } = useGetFeedsQuery({ ORG_ID, EMP_ID, nextToken });

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
            (feed) => !existingIds.has(feed.feedId)
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

  if (feedListIsLoading) {
    return <AllFeedShimmer />;
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

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="w-full">
        {feedsData.length ? (
          feedsData.map((feedData) => {
            return (
              <FeedContent index={0} key={feedData.feedId} data={feedData} />
            );
          })
        ) : (
          <NoFeedAvailable />
        )}
        {isLoadingMore && <AllFeedShimmer />}
      </div>
    </ErrorBoundary>
  );
};

export default AllFeed;
