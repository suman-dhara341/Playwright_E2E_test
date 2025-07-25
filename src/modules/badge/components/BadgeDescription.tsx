import { useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Error from "../../../utilities/Error";
import { Trophy } from "lucide-react";
import {
  useGetBadgeByIdQuery,
  useGetBadgesQuery,
  useGetPopularBadgesQuery,
  useReceivedByBadgeQuery,
} from "../queries/badgeQuery";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import WinnerList from "../../../common/WinnerList";
import { useSelector } from "react-redux";
import PopularBadgeCard from "./PopularBadgeCard";
import ErrorFallback from "../../../utilities/ErrorFallback";
import BadgeDescriptionShimmer from "./shimmer/BadgeDescriptionShimmer";
import "driver.js/dist/driver.css";
import { driver } from "driver.js";

const BadgeDescription: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const badgeType = queryParams.get("badgeType") || "";
  const badgeCategory = queryParams.get("badgeCategory") || "";
  const [nextToken] = useState<string | null>(null);
  const tourRef = useRef<any>(null);

  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const { data: allBadgesList, isLoading: allBadgesListIsLoading } =
    useGetBadgesQuery({ nextToken, ORG_ID });

  const {
    data: badgeDescription,
    error: badgeDescriptionIsError,
    isLoading: badgeDescriptionIsLoading,
  } = useGetBadgeByIdQuery({ badgeType, badgeCategory, ORG_ID });

  const {
    data: popularBadgesList,
    error: popularBadgesListIsError,
    isLoading: popularBadgesListIsLoading,
  } = useGetPopularBadgesQuery({ ORG_ID, EMP_ID });

  const badgeMap = new Map(
    allBadgesList?.data.map((badge: any) => [
      `${badge.type}_${badge.category}`,
      badge,
    ])
  );

  const popularBadgesWithDetails = popularBadgesList?.data
    .map((popularBadge) => {
      const key = `${popularBadge.badge_type}_${popularBadge.badge_category}`;
      return badgeMap.get(key);
    })
    .filter(Boolean);

  const {
    data: badgeReciveBy,
    isLoading: badgeReciveByIsLoading,
    error: badgeReciveByIsError,
  } = useReceivedByBadgeQuery({
    ORG_ID,
    badgeType,
    badgeCategory,
    nextToken,
  });

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("badgesDetailsTour");
    if (hasSeenTour === "true") return;

    const timeout = setTimeout(() => {
      const descriptionDetailsEl = document.querySelector(
        "#description-details"
      );
      const winBadgesEl = document.querySelector("#win-badges");

      if (descriptionDetailsEl && winBadgesEl) {
        const tour = driver({
          showProgress: true,
          showButtons: ["next", "previous", "close"],
          steps: [
            {
              element: "#description-details",
              popover: {
                title: "Badge Details",
                description:
                  "See detailed information about the badge, including its purpose.",
                side: "bottom",
              },
            },

            {
              element: "#win-badges",
              popover: {
                title: "Recent Badge Winners",
                description:
                  "See the most recently awarded badges and who received them.",
                side: "bottom",
              },
            },
          ],
          onDestroyStarted: () => {
            localStorage.setItem("badgesDetailsTour", "true");
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
  }, [
    allBadgesListIsLoading,
    badgeDescriptionIsLoading
  ]);

  if (
    allBadgesListIsLoading ||
    badgeDescriptionIsLoading
  ) {
    return <BadgeDescriptionShimmer />;
  }

  if (badgeDescriptionIsError) {
    return (
      <div
        className="flex justify-center items-center mt-3 h-[calc(100vh-90px)] p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  if (Array.isArray(badgeDescription)) {
    return <p>You don't have any bage</p>;
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div
        id="description-details"
        className="bg-white rounded-md p-3 mb-3 flex justify-between"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <div className="max-w-3xl">
          <h4 className="text-2xl !font-semibold !text-[#585DF9] mb-[8px]">
            {badgeDescription?.data.name}
          </h4>
          <p className="text-base">{badgeDescription?.data?.description}</p>
          <div className="flex items-center space-x-6 mt-3">
            <div className="flex items-center text-[#73737D]">
              <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
              <span className="text-[#587BAE]">
                {badgeDescription?.data?.totalReceiver}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="">
            <img
              src={badgeDescription?.data?.badgePhoto}
              className="w-28 h-28"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-260px)] flex gap-3 mb-8">
        <div
          id="win-badges"
          className="w-[70%] bg-white rounded-md pt-3"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <h5 className="!text-base !text-[#3F4354] !font-semibold !mb-4 px-3">
            Recent Badge Winners
          </h5>
          <WinnerList
            winners={badgeReciveBy?.data ?? []}
            isLoading={badgeReciveByIsLoading}
            isError={badgeReciveByIsError}
          />
        </div>
        <div
          className="w-[30%] bg-white rounded-md py-[16px] px-3"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <h5 className="!text-base !text-[#3F4354] !font-semibold mb-3">
            Popular Badges
          </h5>
          {popularBadgesListIsLoading ? (
            <div className="bg-white rounded shadow p-4">
              <div className="h-5 w-36 bg-gray-300 rounded mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((_, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-20 h-20 bg-gray-300 rounded"></div>
                    <div>
                      <div className="h-4 w-28 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-40 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : popularBadgesListIsError ? (
            <div className="flex items-center justify-center h-[calc(100vh - 365px)]">
              <p className="text-center text-red-500">
                Failed to load badges. Please try again.
              </p>
            </div>
          ) : popularBadgesWithDetails?.length === 0 ? (
            <div className="flex items-center justify-center h-[calc(100vh - 365px)]">
              <p className="text-center text-[#73737D]">No Badges found</p>
            </div>
          ) : (
            <PopularBadgeCard
              badges={popularBadgesWithDetails}
              badgeType="Popular Badges"
              styleClasses="h-[calc(100vh-330px)] overflow-y-auto"
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default BadgeDescription;
