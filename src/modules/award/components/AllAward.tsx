import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import {
  useGetAwardsQuery,
  useGetMyCreatedAwardsQuery,
} from "../queries/awardQuery";
import { Award } from "../interfaces/index";
import Error from "../../../utilities/Error";
import "../css/award.css";
import { useSelector } from "react-redux";
import { Search, Store } from "lucide-react";
import SearchInput from "../../../common/SearchInput";
import AwardCard from "./AwardCard";
import CreateAward from "./CreateAward";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import SortButton from "../../../common/SortButton";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Link, NavLink } from "react-router-dom";
import { Tooltip } from "@mui/material";
import AllAwardShimmer from "./shimmer/AllAwardShimmer";
import { EnvConfig } from "../../../config/config";

const AllAward: React.FC = () => {
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );

  const [recognitionType, setRecognitionType] = useState<string>("All Awards");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [awardsData, setAwardsData] = useState<Award[]>([]);
  const [hasReachedBottom, setHasReachedBottom] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [awardType, setAwardType] = useState("");
  const [allAwardsNextToken, setAllAwardsNextToken] = useState<string | null>(
    null
  );
  const [myAwardsNextToken, setMyAwardsNextToken] = useState<string | null>(
    null
  );

  const tourRef = useRef<any>(null);

  const {
    data: awards,
    error: isAwardsError,
    isLoading: isAwardsLoading,
  } = useGetAwardsQuery({ ORG_ID, nextToken: allAwardsNextToken });

  const {
    data: myAwards,
    error: isMyAwardsError,
    isLoading: isMyAwardsLoading,
  } = useGetMyCreatedAwardsQuery({
    ORG_ID,
    EMP_ID,
    nextToken: myAwardsNextToken,
  });

  const handleReciveSelection = (option: string) => {
    setRecognitionType(option);
    setAwardType(option);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const [createAwardOpen, setCreateAwardOpen] = useState(false);
  const handleCreateAwardClose = () => {
    setCreateAwardOpen(false);
  };

  useEffect(() => {
    setAwardsData([]);
    setAllAwardsNextToken(null);
    setMyAwardsNextToken(null);
  }, [recognitionType]);

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;

      if (isAtBottom && !hasReachedBottom && !isLoadingMore) {
        if (recognitionType === "All Awards" && awards?.nextToken) {
          setAllAwardsNextToken(awards.nextToken);
          setIsLoadingMore(true);
        } else if (recognitionType === "My Awards" && myAwards?.nextToken) {
          setMyAwardsNextToken(myAwards.nextToken);
          setIsLoadingMore(true);
        }
        setHasReachedBottom(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasReachedBottom, awards, myAwards, recognitionType, isLoadingMore]);

  useEffect(() => {
    if (recognitionType === "My Awards" && myAwards) {
      if (myAwards.data.length > 0) {
        setAwardsData((prev) => {
          const existingIds = new Set(prev.map((award) => award.awardId));
          const newAwards = myAwards.data.filter(
            (award) => !existingIds.has(award.awardId)
          );
          return [...prev, ...newAwards];
        });
      }
    } else if (recognitionType === "All Awards" && awards) {
      if (awards.data.length > 0) {
        setAwardsData((prev) => {
          const existingIds = new Set(prev.map((award) => award.awardId));
          const newAwards = awards.data.filter(
            (award) => !existingIds.has(award.awardId)
          );
          return [...prev, ...newAwards];
        });
      }
    }
    setIsLoadingMore(false);
    setHasReachedBottom(false);
  }, [recognitionType, awards, myAwards]);

  const filteredAwards = awardsData?.filter((award: Award) =>
    award?.awardName?.toLowerCase()?.includes(searchInput?.toLowerCase())
  );

  useEffect(() => {
    if (localStorage.getItem("awardTour") === "true") return;

    if (!isAwardsLoading && !isMyAwardsLoading) {
      const timeout = setTimeout(() => {
        const awardHeaderEl = document.querySelector("#awardHeader");
        const allAwardEl = document.querySelector("#all-award");
        if (awardHeaderEl && allAwardEl) {
          const tour = driver({
            showProgress: true,
            steps: [
              {
                element: "#awardHeader",
                popover: {
                  title: "Manage Awards",
                  description: `Search for awards by name, use filters to narrow results, or create a new award. <a href="https://www.wazopulse.com/award/#user-guide" target="_blank"><span style="color:#585DF9; text-decoration: underline;">Learn more...</span></a>`,
                  side: "bottom",
                },
              },
              {
                element: "#all-award",
                popover: {
                  title: "Browse Awards",
                  description:
                    "Explore all available awards. View details, popularity, and recipients. Click an award to learn more or nominate someone.",
                  side: "bottom",
                },
              },
            ],
            onDestroyStarted: () => {
              localStorage.setItem("awardTour", "true");
              tour.destroy();
            },
          });

          tour.drive();
          tourRef.current = tour;
        }
      }, 500);
      return () => {
        clearTimeout(timeout);
        if (tourRef.current) {
          tourRef.current.destroy();
          tourRef.current = null;
        }
      };
    }
  }, [isAwardsLoading, isMyAwardsLoading]);

  if (isAwardsLoading || isMyAwardsLoading) {
    return <AllAwardShimmer count={12} />;
  }

  if (isAwardsError || isMyAwardsError) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-90px)] p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  console.log(EnvConfig.apiUrl, "EnvConfig.apiUrl");

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div
        className="flex items-center flex-row w-full justify-between mb-3"
        id="awardHeader"
      >
        <div className="flex items-center gap-1">
          <h1 className="!text-2xl !text-[#4F4F51] m-0">Awards</h1>
          <Tooltip title={"Learn more about Awards "} arrow>
            <NavLink to={"https://www.wazopulse.com/award"} target="_blank">
              <p className="text-[#585DF9] text-xs mt-2">Info</p>
            </NavLink>
          </Tooltip>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-2 flex items-center pr-3">
              <Search className="h-4 w-4 text-[#73737D]" />
            </div>
            <SearchInput
              className="!pl-7 bg-gray-50 border-gray-200 focus-visible:outline-none"
              type="search"
              id="search-bar"
              placeholder="Search Awards..."
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </div>
          <div id="filter-award-button">
            <SortButton
              options={[
                { value: "All Awards", label: "All Awards" },
                { value: "My Awards", label: "My Awards" },
              ]}
              defaultOption="Type"
              onSelect={handleReciveSelection}
            />
          </div>
          <button
            id="create-award-button"
            className="text-sm text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md min-w-[100px] flex flex-row gap-0.5 items-center"
            onClick={() => setCreateAwardOpen(true)}
          >
            <span className="mx-1">Create Award</span> <FaPlus />
          </button>
          {EnvConfig.apiUrl.endsWith("/alpha") ? (
            <Link to="award-vault">
              <button
                id="award-vault"
                className="text-sm text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md min-w-[100px] flex flex-row gap-0.5 items-center"
              >
                <span className="mx-1">Award Vault</span>{" "}
                <Store className="h-5 w-5" />
              </button>
            </Link>
          ) : null}
        </div>
      </div>

      <div ref={containerRef} className="mb-3" id="all-award">
        {filteredAwards && filteredAwards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {filteredAwards.map((award, index) => (
              <div key={award.awardId}>
                <AwardCard index={index} award={award} type={awardType} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex justify-center items-center h-[calc(100vh-150px)] p-3 bg-white rounded-md"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            <p className="text-[#73737D]">No award found</p>
          </div>
        )}

        {isLoadingMore && recognitionType === "All Awards" && (
          <AllAwardShimmer count={4} />
        )}
      </div>

      {createAwardOpen && <CreateAward close={handleCreateAwardClose} />}
    </ErrorBoundary>
  );
};

export default AllAward;
