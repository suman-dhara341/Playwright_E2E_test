import { useCallback, useEffect, useState } from "react";
import ProfileCard from "./EmployeeProfile";
import RecognitionDrawerComponent from "./RecognitionDrawerComponent";
import Error from "../../../utilities/Error";
import { useGetProfileQuery } from "../../profile/queries/profileQuery";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../common/Avatar";
import { Send, Smile } from "lucide-react";
import { useGetEmployeeGoalsQuery } from "../../goals/queries/okrQuery";
import EmployeeActivityOverview from "../../profile/components/EmployeeActivityOverview";
import Confetti from "react-confetti";
import "../css/feed.css";
import { setActiveTab } from "../../profile/slice/tabSlice";
import { IndexPageShimmer } from "./shimmer/IndexPageShimmer";
import IndexShimmer from "./shimmer/IndexShimmer";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );

  console.log(ORG_ID);
  console.log(EMP_ID);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedPath, setSelectedPath] = useState<string>("Not Selected");
  const [confettiVisible, setConfettiVisible] = useState(false);
  const {
    data: profile,
    error: profileError,
    isLoading: profileIsLoading,
  } = useGetProfileQuery({ ORG_ID, EMP_ID });

  const {
    data: employeeGoalsData,
    isLoading: employeeGoalsIsLoading,
    isError: employeeGoalsIsError,
  } = useGetEmployeeGoalsQuery({ EMP_ID, ORG_ID });

  const goalsToDisplay = employeeGoalsData?.data || [];

  const upcomingGoals = [...goalsToDisplay]
    .filter((goal) => {
      const due = new Date(goal.dueDate);
      const now = new Date();
      return !isNaN(due.getTime()) && due >= new Date(now.toDateString());
    })
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

  const useTimeAgo = (date: string) =>
    date
      ? new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(date))
      : "-";

  useEffect(() => {
    if (confettiVisible) {
      const timer = setTimeout(() => {
        setConfettiVisible(false);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [confettiVisible]);

  useEffect(() => {
    const currentPath = location.pathname;
    const validPaths = [
      "/feed",
      "/feed/recognition",
      "/feed/my-recognition",
      "/feed/",
      "/feed/recognition/",
      "/feed/my-recognition/",
    ];
    if (validPaths.includes(currentPath)) {
      setSelectedPath(currentPath);
    } else {
      setSelectedPath("Not Selected");
    }
  }, [location]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const path = event.target.value;
    const validPaths = [
      "/feed",
      "/feed/recognition",
      "/feed/my-recognition",
      "/feed/",
      "/feed/recognition/",
      "/feed/my-recognition/",
    ];

    if (validPaths.includes(path)) {
      setSelectedPath(path);
      navigate(path);
    }
  };

  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const imageUrl = profile?.data?.photo || "";
  const imageWithTimestamp = imageUrl
    ? `${imageUrl}?t=${new Date().getTime()}`
    : "";

  const haldelRedirectGrowth = () => {
    navigate("/growth");
  };

  const haldelRedirectGoals = () => {
    navigate("/goals");
  };

  const handleMenuClick = (menuName: string) => {
    dispatch(setActiveTab(menuName));
    navigate("/profile?tab=activity");
  };

  if (profileError) {
    return (
      <div className="flex justify-center items-center min-h-[100vh] p-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  return (
    <div className="w-full flex gap-3">
      <div className="w-[24%] sticky top-19 self-start">
        {profileIsLoading ? (
          <IndexShimmer />
        ) : (
          <div id="feedProfile">
            <ProfileCard profile={profile} />
          </div>
        )}
      </div>
      <div className="w-[50%]">
        <div onClick={handleDrawerOpen} id="giveRecognition">
          <div
            className="flex items-center gap-2 bg-white p-3 rounded-md cursor_pointer"
            style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
          >
            <div>
              <Avatar
                name={profile?.data?.firstName || ""}
                image={imageWithTimestamp}
                size={45}
              />
            </div>
            <div className="w-full flex items-center border-1 border-[#E8E8EC] rounded-full">
              <input
                name="commentContent"
                className="p-3 w-full focus-visible:outline-none pointer-events-none"
                placeholder="Give a recognition to celebrate someone’s great work..."
              />
              <div className="flex gap-3 px-3">
                <Smile color="#ffa700" className="w-5 h-5" />
                <Send className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        {drawerOpen && (
          <RecognitionDrawerComponent
            handleDrawerClose={handleDrawerClose}
            setConfettiVisible={setConfettiVisible}
          />
        )}
        <div className="flex items-center gap-2 py-1">
          <div className="w-full border-t-1 border-[#E8E8EC]" />
          <div className="flex items-center" id="filterRecognition">
            <p className="w-12">Sort by:</p>
            <select
              value={selectedPath}
              onChange={handleChange}
              className="text-xs font-semibold text-center rounded-md focus:outline-none focus-visible:outline-none cursor-pointer"
            >
              <option value="Not Selected" disabled>
                Not Selected
              </option>
              <option value="/feed">All Feed</option>
              <option value="/feed/recognition">All Recognition</option>
              <option value="/feed/my-recognition">My Recognition</option>
            </select>
          </div>
        </div>
        <div id="feed">
          <Outlet />
        </div>
      </div>
      <div className="w-[24%]">
        <div
          className="w-full bg-white rounded-md mb-3 overflow-hidden"
          style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
          id="activityArea"
        >
          <div className="w-full flex items-center justify-between p-3 border-b-1 border-[#E8E8EC]">
            <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
              Activity
            </p>
            <p
              className="text-xs font-[400] !text-[#585DF9] cursor-pointer"
              onClick={() => handleMenuClick("activity")}
              id="viewAllActivity"
            >
              View all
            </p>
          </div>

          <div>
            <EmployeeActivityOverview />
          </div>
        </div>
        <div
          className="w-full bg-white rounded-md mb-3"
          style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
          id="upcomingGoalArea"
        >
          <div className="w-full flex items-center justify-between p-3 border-b-1 border-[#E8E8EC]">
            <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
              Your upcoming goals
            </p>
            <p
              className="text-xs font-[400] !text-[#585DF9] cursor-pointer"
              onClick={haldelRedirectGoals}
              id="viewAllGoals"
            >
              View all
            </p>
          </div>
          {employeeGoalsIsLoading && <IndexPageShimmer />}
          {employeeGoalsIsError && (
            <div className="flex items-center justify-center min-h-[20vh]">
              <Error />
            </div>
          )}
          {employeeGoalsData && (
            <div className="w-full p-3">
              {upcomingGoals.length === 0 ? (
                <div className="flex justify-center items-center min-h-[15vh]">
                  <p className="text-center text-[#73737D]">
                    No upcoming goals. <br />
                    <span
                      className="text-blue-600 underline cursor-pointer"
                      onClick={haldelRedirectGoals}
                    >
                      Create a new goal
                    </span>
                  </p>
                </div>
              ) : (
                upcomingGoals.map((goal, index) => {
                  const isLastItem = index === upcomingGoals.length - 1;

                  const dueDateObj = new Date(goal.dueDate);
                  const dueDate = !isNaN(dueDateObj.getTime())
                    ? dueDateObj.toISOString().slice(0, 10).replace(/-/g, "/")
                    : "Invalid date";

                  return (
                    <div
                      key={goal.goalId || index}
                      className="relative flex gap-3 mb-0 w-full"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-[#4B3FE4]"></div>
                        {!isLastItem && (
                          <div className="w-[2px] h-full bg-[#A0A0A0]"></div>
                        )}
                      </div>

                      <div className={`w-full ${isLastItem ? "mb-0" : "mb-3"}`}>
                        <div className="mb-2">
                          <p className="text-sm font-semibold text-[#3F4354] leading-4 mb-2">
                            {goal.title.length > 30
                              ? `${goal.title.slice(0, 30)}...`
                              : goal.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-[#73737D]">
                              {useTimeAgo(dueDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {profile?.data?.reportsTo === "Root" ? null : (
          <div
            className="w-full bg-white rounded-md"
            style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
            id="growthArea"
          >
            <div className="text-center p-3">
              <p className="text-base leading-[20px] font-semibold tracking-[0px] text-[#3F4354] mb-3">
                Growth starts beyond the comfort zone and with action.
              </p>
              <div className="flex justify-center">
                <button
                  className="text-sm text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md min-w-[100px] flex flex-row gap-0.5 items-center"
                  onClick={haldelRedirectGrowth}
                >
                  Start a Growth Conversation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {confettiVisible && (
        <Confetti
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      )}
    </div>
  );
};

export default Feed;
