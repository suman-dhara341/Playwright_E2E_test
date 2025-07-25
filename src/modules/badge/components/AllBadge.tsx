import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useGetBadgesQuery } from "../queries/badgeQuery";
import Error from "../../../utilities/Error";
import SearchInput from "../../../common/SearchInput";
import BadgeCard from "./BadgeCard";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import AllBadgeShimmer from "./shimmer/AllBadgeShimmer";

const AllBadge: React.FC = () => {
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [badgesData, setBadgesData] = useState<any[]>([]);
  const [hasReachedBottom, setHasReachedBottom] = useState<boolean>(false);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const tourRef = useRef<any>(null);

  const {
    data: badges,
    isLoading,
    isError,
  } = useGetBadgesQuery({ nextToken, ORG_ID });

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;
      if (
        isAtBottom &&
        !hasReachedBottom &&
        badges?.nextToken &&
        !isLoadingMore
      ) {
        setNextToken(badges.nextToken);
        setHasReachedBottom(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasReachedBottom, badges]);

  useEffect(() => {
    if (badges) {
      if (badges.data.length > 0) {
        setBadgesData((prevFeeds) => {
          const existingIds = new Set(prevFeeds.map((badge) => badge.category));
          const newFeeds = badges.data.filter(
            (badge: any) => !existingIds.has(badge.category)
          );
          return [...prevFeeds, ...newFeeds];
        });
      }
      setIsLoadingMore(false);
    }
    setHasReachedBottom(false);
  }, [badges]);

  useEffect(() => {
    if (nextToken) {
      setIsLoadingMore(true);
    }
  }, [nextToken]);

  const filteredbadges: any = badgesData?.filter((badge: any) =>
    badge?.name?.toLowerCase()?.includes(searchInput?.toLowerCase())
  );

  useEffect(() => {
    if (!isLoading) {
      const hasSeenTour = localStorage.getItem("badgesTour");
      if (hasSeenTour === "true") return;

      const timeout = setTimeout(() => {
        const searchEl = document.querySelector("#search-badges");
        const learnEl = document.querySelector("#learn-badge");

        if (searchEl && learnEl) {
          const tour = driver({
            showProgress: true,
            showButtons: ["next", "previous", "close"],
            steps: [
              {
                element: "#search-badges",
                popover: {
                  title: "Search Badges",
                  description: `Use this field to search for badges by name. <a href="https://www.wazopulse.com/badge/#user-guide" target="_blank"> <span style="color:#585DF9; text-decoration:underline;">Learn more...</span></a>`,
                  side: "bottom",
                },
              },
              {
                element: "#badge-grid",
                popover: {
                  title: "All Badges",
                  description:
                    "Discover badges that showcase how employees lived your organization’s values—through leadership, collaboration, innovation, ownership, mentoring, integrity, customer focus, and continuous improvement. Each badge reflects not just what was done, but how it was achieved.",
                  side: "bottom",
                },
              },
            ],
            onDestroyStarted: () => {
              localStorage.setItem("badgesTour", "true");
              tour.destroy();
            },
          });
          tour.drive();
          tourRef.current = tour;
        }
      }, 300);

      return () => {
        clearTimeout(timeout);
        if (tourRef.current) {
          tourRef.current.destroy();
          tourRef.current = null;
        }
      };
    }
  }, [isLoading, filteredbadges]);

  if (isLoading) {
    return (
      <div>
        <AllBadgeShimmer count={18} />
      </div>
    );
  }

  if (isError) {
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
      <div
        className="mb-3 flex items-center justify-between"
        id="badges-heading"
      >
        <div className="flex items-center gap-2">
          <h1 className="!text-2xl !text-[#4F4F51] m-0">Badges</h1>
          <Tooltip title={"Learn more about Badges"} arrow>
            <NavLink
              to={"https://www.wazopulse.com/badge"}
              target="_blank"
              id="learn-badge"
            >
              <p className="text-[#585DF9] text-xs mt-2">Info</p>
            </NavLink>
          </Tooltip>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-2 flex items-center pr-3">
              <Search className="h-4 w-4 text-[#73737D]" />
            </div>
            <SearchInput
              className="!pl-7 bg-gray-50 border-gray-200 focus-visible:outline-none"
              type="search"
              placeholder="Search Badges..."
              value={searchInput}
              onChange={handleSearchInputChange}
              id="search-badges"
            />
          </div>
        </div>
      </div>

      <div id="badge-grid" className="mb-6">
        {filteredbadges && filteredbadges?.length > 0 ? (
          <BadgeCard
            badges={filteredbadges}
            badgeType="All Badges"
            styleClasses={
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3"
            }
          />
        ) : (
          <div>No badge found</div>
        )}
      </div>

      {isLoadingMore && <AllBadgeShimmer count={6} />}
    </ErrorBoundary>
  );
};

export default AllBadge;
