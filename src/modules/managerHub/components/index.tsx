import { useEffect, useRef } from "react";
import { MyTeam } from "./MyTeam";
import {
  FileChartColumnIncreasing,
  UsersRound,
  ChartLine,
  HeartPulse,
} from "lucide-react";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import { Analytics } from "./Analytics";
import Anonimity from "./AnonimityComponent";
import AllEmployeeAnalytics from "./AllEmployeeAnalytics";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../profile/slice/tabSlice";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const tabItems = [
  {
    value: "Dashboard",
    label: "Dashboard",
    icon: <FileChartColumnIncreasing className="w-4 h-4" />,
    id: "dashboard",
  },
  {
    value: "My Team",
    label: "My Team",
    icon: <UsersRound className="w-4 h-4" />,
    id: "myTeam",
  },
  {
    value: "Analytics",
    label: "Analytics",
    icon: <ChartLine className="w-4 h-4" />,
    id: "analytics",
  },
  {
    value: "Pulse",
    label: "Pulse",
    icon: <HeartPulse className="w-4 h-4" />,
    id: "pulse",
  },
];

const ManagerHub = () => {
  const dispatch = useDispatch();
  const { id: empId } = useParams<{ id?: string }>();
  const activeTab = useSelector((state: any) => state.tabs.activeTab);
  const tourRef = useRef<any>(null);

  const filteredTabItems = empId
    ? tabItems.filter((tab) => tab.value !== "activity")
    : tabItems;

  const validTabValues = filteredTabItems.map((tab) => tab.value);
  const currentTab = validTabValues.includes(activeTab)
    ? activeTab
    : "Dashboard";

  useEffect(() => {
    if (!activeTab) return;
    if (activeTab !== currentTab) {
      dispatch(setActiveTab(currentTab));
    }
  }, [activeTab, currentTab, dispatch]);

  const handleTabClick = (value: string) => {
    dispatch(setActiveTab(value));
  };

  useEffect(() => {
    if (localStorage.getItem("managerHubTour") !== "true") {
      const interval = setInterval(() => {
        const managerHubEl = document.querySelector("#manager-hub");
        const allDataEl = document.querySelector("#allData");
        const graphEl = document.querySelector("#graph");

        if (managerHubEl && allDataEl && graphEl) {
          clearInterval(interval);
          const tour = driver({
            showProgress: true,
            steps: [
              {
                element: "#manager-hub",
                popover: {
                  title: "Dashboard Overview",
                  description:
                    "Lead with clarity. This hub helps you stay informed about your team’s goals, contributions, and growth conversations—so you can coach, recognize, and unblock effectively.",
                },
              },
              {
                element: "#allData",
                popover: {
                  title: "Dashboard Overview",
                  description: `
                                  Get a complete view of your team's activity and achievements:<br/>
                                  • <strong>Total Awards</strong> – Count of awards received by team members.<br/>
                                  • <strong>Total Recognitions</strong> – All recognitions shared across the team.<br/>
                                  • <strong>Total Badges</strong> – Number of badges earned by the team for their contributions.`,
                  side: "bottom",
                },
              },
              {
                element: "#graph",
                popover: {
                  title: "Performance Insights",
                  description: `Use the <strong>Type</strong> and <strong>Period</strong> filters to customize the data view.<br/>The graph below visualizes trends in awards, badges, and recognition for your team.`,
                  side: "bottom",
                },
              },
            ],
            onDestroyStarted: () => {
              localStorage.setItem("managerHubTour", "true");
              tour.destroy();
            },
          });
          tourRef.current = tour;
          tour.drive();
        }
      }, 300);

      return () => {
        clearInterval(interval);
        console.log(tourRef.current);

        if (tourRef.current) {
          tourRef.current.destroy();
          tourRef.current = null;
        }
      };
    }
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center" id="manager-hub">
        <h1 className="!text-2xl !text-[#4F4F51]">Manager Hub</h1>
        <div
          className="bg-white rounded-md mb-3 overflow-hidden"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <div className="flex text-[#3F4354] bg-white rounded-md p-0">
            {filteredTabItems.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabClick(tab.value)}
                className={`h-[40px] flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  activeTab === tab.value
                    ? "bg-[#585DF9] text-white border-b-2 !border-b-[#585DF9] border-r-none"
                    : "border-b-2 border-white text-[#3F4354]"
                }`}
                id={tab?.id}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-md">
        {activeTab === "Dashboard" && (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <AllEmployeeAnalytics />
          </ErrorBoundary>
        )}
        {activeTab === "My Team" && (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <MyTeam />
          </ErrorBoundary>
        )}
        {activeTab === "Analytics" && (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <Analytics />
          </ErrorBoundary>
        )}
        {activeTab === "Pulse" && (
          <ErrorBoundary fallback={<ErrorFallback />}>
            <Anonimity activeTab="Insights" />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default ManagerHub;
