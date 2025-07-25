import { useGetMarketplaceAwardQuery } from "../queries/awardQuery";
import { useEffect, useRef, useState } from "react";
import Error from "../../../utilities/Error";
import { ArrowBigLeft, Flame, Search, Trophy } from "lucide-react";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import SearchInput from "../../../common/SearchInput";
import { Link, useNavigate } from "react-router-dom";
import AddToOrgModal from "./AddToOrgModal";
import AllAwardShimmer from "./shimmer/AllAwardShimmer";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useSelector } from "react-redux";
import Drawer from "../../../common/Drawer";
import AwardMarketDetails from "./AwardMarketDetails";

const AwardMarketplace = () => {
  const navigate = useNavigate();
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [openAwardDrawer, setOpenAwardDrawer] = useState(false);
  const [selectedAward, setSelectedAward] = useState<any>(null);
  const [hasReachedBottom, setHasReachedBottom] = useState<boolean>(false);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [editableAward, setEditableAward] = useState<any>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [awardsData, setAwardsData] = useState<any>([]);
  const tourRef = useRef<any>(null);
  const {
    data: awards,
    error: isAwardsError,
    isLoading: isAwardsLoading,
    refetch: awardRefetch,
  } = useGetMarketplaceAwardQuery({ ORG_ID, nextToken });

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleUseAward = (award: any) => {
    setEditableAward(award);
    setAddModalOpen(true);
  };

  const handleConfirmAddToOrg = () => {
    setAddModalOpen(false);
  };

  const truncateText = (text: string, length: number): string => {
    if (text?.length <= length) {
      return text;
    }
    return `${text?.slice(0, length)}...`;
  };
  const handleAwardClick = (award: any) => {
    setSelectedAward(award);
    setOpenAwardDrawer(true);
  };

  const handleAwardExistClick = (awardId: any) => {
    navigate(`/awards/${awardId}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;

      if (isAtBottom && !hasReachedBottom && !isLoadingMore) {
        if (awards?.nextToken) {
          setNextToken(awards.nextToken);
          setIsLoadingMore(true);
        }
        setHasReachedBottom(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasReachedBottom, awards, isLoadingMore]);

  useEffect(() => {
    if (awards) {
      if (awards?.data?.length > 0) {
        setAwardsData((prev: any[]) => {
          const updatedMap = new Map(
            prev.map((award) => [award.awardId, award])
          );

          for (const award of awards.data) {
            const existingAward = updatedMap.get(award.awardId) || {};
            updatedMap.set(award.awardId, { ...existingAward, ...award });
          }

          return Array.from(updatedMap.values());
        });
      }
    }
    setIsLoadingMore(false);
    setHasReachedBottom(false);
  }, [awards]);

  const filteredAwards = awardsData?.filter((award: any) =>
    award?.awardName?.toLowerCase()?.includes(searchInput?.toLowerCase())
  );

  useEffect(() => {
    if (localStorage.getItem("awardMarketTour") === "true") return;

    if (!isAwardsLoading) {
      const timeout = setTimeout(() => {
        const searchEl = document.querySelector("#searchAwardMarket");
        const allAwardEl = document.querySelector("#allAward");
        if (searchEl && allAwardEl) {
          const tour = driver({
            showProgress: true,
            steps: [
              {
                element: "#searchAwardMarket",
                popover: {
                  title: "Search Awards",
                  description:
                    "Use this field to find specific awards by name and discover the ones that are most relevant to your organization.",
                  side: "bottom",
                },
              },

              {
                element: "#allAward",
                popover: {
                  title: "Browse Awards",
                  description:
                    "Explore all available awards, view their details, and click 'Add to ORG' button.",
                  side: "bottom",
                },
              },
            ],
            onDestroyStarted: () => {
              localStorage.setItem("awardMarketTour", "true");
              tour.destroy();
            },
          });

          tour.drive();
          tourRef.current = tour;
        }
      }, 500);

      return () => {
        clearInterval(timeout);
        if (tourRef.current) {
          tourRef.current.destroy();
          tourRef.current = null;
        }
      };
    }
  }, [isAwardsLoading]);

  if (isAwardsLoading) {
    return <AllAwardShimmer count={12} />;
  }

  if (isAwardsError) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-90px)] p-3 bg-white rounded-md shadow">
        <Error />
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="flex flex-row w-full justify-between mb-3">
        <div>
          <h1 className="!text-2xl !text-[#4F4F51] m-0">Award Vault</h1>
          <p>
            Explore ready-made awards in the Vault, instantly add them to your
            organization, and start using them right away
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div id="searchAwardMarket" className="relative w-64">
            <div className="absolute inset-y-0 left-2 flex items-center pr-3">
              <Search className="h-4 w-4 text-[#73737D]" />
            </div>
            <SearchInput
              className="!pl-7 bg-gray-50 border-gray-200 focus-visible:outline-none"
              type="search"
              placeholder="Search Awards..."
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </div>
          <Link to="/awards">
            <button
              id="create-award-button"
              className="text-sm text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md min-w-[100px] flex flex-row gap-0.5 items-center"
            >
              <span className="mx-1">All Awards</span>
              <ArrowBigLeft className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>

      <div id="allAward" className="mb-3">
        {filteredAwards && filteredAwards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {filteredAwards.map((award: any) => {
              const isFromLastMonth = (timestamp: any): boolean => {
                const createdDate = new Date(timestamp);
                const now = new Date();
                const lastMonthDate = new Date();
                lastMonthDate.setDate(now.getDate() - 14);
                return createdDate >= lastMonthDate && createdDate <= now;
              };

              const recent = isFromLastMonth(award?.createdAt);

              return (
                <div
                  key={award.awardId}
                  className="flex flex-col items-center justify-between bg-white !rounded-[8px] shadow-md"
                  style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
                >
                  <div
                    className="flex flex-col w-full bg-white gap-1 cursor-pointer !rounded-[8px]"
                    onClick={() => handleAwardClick(award)}
                  >
                    <div className="w-full ">
                      <div>
                        <div className="flex gap-2 justify-end w-full">
                          {award?.totalWinners ? (
                            <div className="flex items-center gap-1">
                              <Trophy className="w-4 h-4 text-[#fec006]" />
                              <span className="text-[#878791] text-xs flex flex-row gap-1">
                                {award?.totalWinners} Winners
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="w-full flex flex-row items-start gap-3 p-3">
                        <div className="w-[25%] flex justify-center">
                          {award?.awardPhoto ? (
                            <img
                              src={award?.awardPhoto}
                              alt={award?.awardId}
                              className="w-full"
                            />
                          ) : (
                            <Trophy className="w-10 h-10" />
                          )}
                        </div>
                        <div className="w-[75%]">
                          <p className="text-sm font-semibold text-[#3F4354]">
                            {award?.awardName}
                          </p>
                          <p className="text-xs text-[#73737D] font-medium">
                            {truncateText(award?.description, 40)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex flex-row w-full ${
                      !recent ? "justify-start" : "justify-between"
                    } items-center border-t-1 border-t-[#E8E8EC] py-2 px-3`}
                  >
                    <div className="flex items-center gap-1">
                      {recent && (
                        <div className="text-[#FE7304] text-[13px] flex flex-row items-end font-semibold gap-1">
                          <Flame />
                          <p>New</p>
                        </div>
                      )}
                    </div>
                    <button
                      className={`text-sm text-[#585DF9] font-semibold bg-gray-100 px-3 py-1 !rounded-md flex flex-row gap-0.5 items-center justify-center`}
                      onClick={() =>
                        award?.existingOrgAwardId
                          ? handleAwardExistClick(award?.existingOrgAwardId)
                          : handleUseAward(award)
                      }
                    >
                      {award?.existingOrgAwardId ? "Open" : "Add"}
                    </button>
                  </div>
                </div>
              );
            })}
            <Drawer
              isOpen={openAwardDrawer}
              onClose={() => setOpenAwardDrawer(false)}
              heading="Award details"
            >
              <AwardMarketDetails selectedAward={selectedAward} />
            </Drawer>
          </div>
        ) : (
          <div
            className="flex justify-center items-center h-[calc(100vh-150px)] p-3 bg-white rounded-md"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            <p className="text-[#73737D]">No award found</p>
          </div>
        )}
        {isLoadingMore && <AllAwardShimmer count={4} />}
      </div>

      {addModalOpen && editableAward && (
        <AddToOrgModal
          award={editableAward}
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleConfirmAddToOrg}
          awardRefetch={awardRefetch}
        />
      )}
    </ErrorBoundary>
  );
};

export default AwardMarketplace;
