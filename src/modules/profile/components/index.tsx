import React, { useEffect, useRef } from "react";
import EmployeeProfile from "./EmployeeProfile";
import EmployeeBadges from "./EmployeeBadges";
import EmployeeJourney from "./EmployeeJourney";
import EmployeeRecognition from "./EmployeeRecognition";
import EmployeeAwards from "./EmployeeAwards";
import EmployeeProfileOverview from "./EmployeeProfileOverview";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../slice/tabSlice";
import {
  Award,
  FolderKanban,
  Ribbon,
  ShieldCheck,
  Sparkles,
  Trophy,
  Waypoints,
} from "lucide-react";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import AggregateReport from "./EmployeeInsight";
import EmployeeActivity from "./EmployeeActivity";
import { useParams } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const tabItems = [
  {
    value: "spotlight",
    label: "Spotlight",
    icon: <Sparkles className="w-4 h-4" />,
    id: "spotlight",
  },
  {
    value: "awards",
    label: "Awards",
    icon: <Trophy className="w-4 h-4" />,
    id: "awards",
  },
  {
    value: "badges",
    label: "Badges",
    icon: <Award className="w-4 h-4" />,
    id: "badges",
  },
  {
    value: "recognition",
    label: "Recognition",
    icon: <Ribbon className="w-4 h-4" />,
    id: "recognition",
  },
  {
    value: "journey",
    label: "Journey",
    icon: <Waypoints className="w-4 h-4" />,
    id: "journey",
  },
  {
    value: "insights",
    label: "Insights",
    icon: <FolderKanban className="w-4 h-4" />,
    id: "insights",
  },
  {
    value: "activity",
    label: "Activity",
    icon: <ShieldCheck className="w-4 h-4" />,
    id: "activity",
  },
];

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const paramsData = useParams();
  const empId: any = paramsData.id;
  const activeTab = useSelector((state: any) => state.tabs.activeTab);
  const tourRef = useRef<any>(null);

  const validTabValues = tabItems.map((tab) => tab.value);
  const currentTab = validTabValues.includes(activeTab)
    ? activeTab
    : "spotlight";

  const filteredTabItems = empId
    ? tabItems.filter((tab) => tab.value !== "activity")
    : tabItems;

  const handleTabClick = (value: string) => {
    dispatch(setActiveTab(value));
  };

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("profileTour");
    if (hasSeenTour === "true") return;

    const timeout = setTimeout(() => {
      const allAreaEl = document.querySelector("#allArea");
      const profileEl = document.querySelector("#profile");

      if (allAreaEl && profileEl) {
        const tour = driver({
          showProgress: true,
          showButtons: ["next", "previous", "close"],
          steps: [
            {
              element: "#profile",
              popover: {
                title: "Profile Section",
                description:
                  "Get an overview of your profile, including your name, about section, contact details and recent activity. You can also see this section when you visit anyone else's profile.",
                side: "bottom",
              },
            },
            {
              element: "#allArea",
              popover: {
                title: "Explore Your Profile Sections",
                description:
                  "Switch between Spotlight, Awards, Badges, Recognition, Journey, Insights, and Activity to view and manage different aspects of your achievements and engagement.",
                side: "bottom",
              },
              onDeselected: () => {
                localStorage.setItem("profileTour", "true");
              },
            },
          ],
          onDestroyStarted: () => {
            localStorage.setItem("profileTour", "true");
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
  }, []);

  return (
    <div>
      <div
        className="bg-white rounded-md mb-3 overflow-hidden"
        style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
      >
        <div id="profile">
          <ErrorBoundary
            fallback={<ErrorFallback height="calc(100vh-360px)" />}
          >
            <EmployeeProfile />
          </ErrorBoundary>
        </div>

        <div
          className="flex text-[#3F4354] bg-white rounded-md p-0"
          id="allArea"
        >
          {filteredTabItems.map((tab) => (
            <button
              id={tab.label === "Activity" ? "Activity" : ""}
              key={tab.value}
              onClick={() => handleTabClick(tab.value)}
              className={`h-[40px] flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                currentTab === tab.value
                  ? "bg-[#585DF9] text-white border-b-2 !border-b-[#585DF9] border-r-none"
                  : "border-b-2 border-white text-[#3F4354]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-md">
        {currentTab === "badges" && (
          <ErrorBoundary
            fallback={<ErrorFallback height="calc(100vh-360px)" />}
          >
            <EmployeeBadges />
          </ErrorBoundary>
        )}
        {currentTab === "awards" && (
          <ErrorBoundary
            fallback={<ErrorFallback height="calc(100vh-360px)" />}
          >
            <EmployeeAwards />
          </ErrorBoundary>
        )}
        {currentTab === "spotlight" && (
          <ErrorBoundary
            fallback={<ErrorFallback height="calc(100vh-360px)" />}
          >
            <EmployeeProfileOverview />
          </ErrorBoundary>
        )}
        {currentTab === "recognition" && (
          <ErrorBoundary
            fallback={<ErrorFallback height="calc(100vh-360px)" />}
          >
            <EmployeeRecognition />
          </ErrorBoundary>
        )}
        {currentTab === "insights" && (
          <ErrorBoundary
            fallback={<ErrorFallback height="calc(100vh-360px)" />}
          >
            <AggregateReport />
          </ErrorBoundary>
        )}
        {currentTab === "journey" && (
          <ErrorBoundary
            fallback={<ErrorFallback height="calc(100vh-360px)" />}
          >
            <EmployeeJourney />
          </ErrorBoundary>
        )}
        {!empId && currentTab === "activity" && (
          <ErrorBoundary
            fallback={<ErrorFallback height="calc(100vh-360px)" />}
          >
            <EmployeeActivity />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default Profile;
