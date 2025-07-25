import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "@mui/material/Container";
import Logo from "/images/logo.png";
import SearchBox from "./SearchBox";
import { openModal } from "../slice/modalSlice";
import NotificationPanel from "./NotificationPanel";
import HamburgerMenu from "./HamburgerMenu";
import Avatar from "../../../common/Avatar";
import {
  ChartLine,
  FileChartColumnIncreasing,
  HeartPulse,
  LogOut,
  Newspaper,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  UsersRound,
  CircleHelp,
} from "lucide-react";
import { setActiveTab } from "../../profile/slice/tabSlice";
import { EnvConfig } from "../../../config/config";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useLogoutMutation } from "../queries/globalQuery";
import { showToast } from "../../../utilities/toast";

const Navbar = ({ profileData }: any) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAdmin = useSelector(
    (state: any) => state.auth?.userData?.["custom:isAdmin"] || false
  );
  const idToken = useSelector((state: any) => state.auth?.idToken || "");
  const refreshToken = useSelector(
    (state: any) => state.auth?.refreshToken || ""
  );
  const userData = useSelector((state: any) => state.auth?.userData || "");
  const [showMenu, setShowMenu] = useState(false);
  const [showManagerHubMenu, setShowManagerHubMenu] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const managerHubRef = useRef<HTMLDivElement>(null);
  const imageUrl = profileData?.data?.photo || "";
  const directReportee = profileData?.data?.directReportee;
  const imageWithTimestamp = imageUrl ? `${imageUrl}?t=${Date.now()}` : "";
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState<boolean>(false);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    const authToken = idToken;
    const email = userData?.email || "";
    const fcmToken = localStorage.getItem("fcmToken") || "";
    try {
      await logout({
        logoutPayload: { authToken, email, fcmToken },
      }).unwrap();

      localStorage.removeItem("persist:auth");
      localStorage.removeItem("persist:avatar");
      localStorage.removeItem("fcmToken");
      window.location.href = "/login";
    } catch (err) {
      showToast("Something went wrong", "error");
    }
  };

  const handleAdminRedirect = () => {
    const base64Encode = (value: string) =>
      btoa(unescape(encodeURIComponent(value)));
    const encodedIdToken = base64Encode(idToken);
    const encodedRefreshToken = base64Encode(refreshToken);
    const encodedUserData = base64Encode(JSON.stringify(userData));
    const adminUrlWithParams = `${EnvConfig.adminUrl}?a=${encodedIdToken}&b=${encodedRefreshToken}&c=${encodedUserData}`;
    window.open(adminUrlWithParams, "_blank", "noopener,noreferrer");
  };

  const menuOptions = [
    {
      label: "Profile",
      icon: <User className="mr-3 w-5 h-5" />,
      to: "/profile",
    },
    ...(isAdmin === "true"
      ? [
          {
            label: "Admin",
            icon: <ShieldCheck className="mr-3 w-5 h-5" />,
            action: handleAdminRedirect,
          },
        ]
      : []),
    {
      label: "Settings",
      icon: <Settings className="mr-3 w-5 h-5" />,
      action: () => dispatch(openModal()),
    },
    {
      label: "Get Help",
      icon: <CircleHelp className="mr-3 w-5 h-5" />,
      to: "https://www.wazopulse.com/contact/",
      external: "_blank",
    },
    {
      label: "Log Out",
      icon: <LogOut className="mr-3 w-5 h-5" />,
      action: handleLogout,
    },
  ];

  const managerHubOptions = [
    {
      label: "Dashboard",
      icon: <FileChartColumnIncreasing className="mr-3 w-5 h-5" />,
      menuName: "Dashboard",
    },
    {
      label: "My Team",
      icon: <UsersRound className="mr-3 w-5 h-5" />,
      menuName: "My Team",
    },
    {
      label: "Analytic",
      icon: <ChartLine className="mr-3 w-5 h-5" />,
      menuName: "Analytics",
    },
    {
      label: "Pulse",
      icon: <HeartPulse className="mr-3 w-5 h-5" />,
      menuName: "Pulse",
    },
  ];

  const handleClickOutside = (event: MouseEvent) => {
    if (
      avatarMenuRef.current &&
      !avatarMenuRef.current.contains(event.target as Node)
    ) {
      setShowMenu(false);
    }

    if (
      managerHubRef.current &&
      !managerHubRef.current.contains(event.target as Node)
    ) {
      setShowManagerHubMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderDropdown = (options: any[]) => (
    <div className="absolute right-0 mt-2 w-38 rounded-md border border-gray-100 bg-white shadow-lg z-10">
      {options.map((option, index) => (
        <div key={index} className="w-full">
          {option.menuName ? (
            <NavLink
              to={getPathFromMenu(option.menuName)}
              onClick={() => {
                handleMenuClick(option.menuName);
                setShowManagerHubMenu(false);
                setShowMenu(false);
              }}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 hover:bg-gray-100 font-semibold ${
                  isActive ? "red" : ""
                }`
              }
            >
              {option.icon}
              <p className="text-sm font-semibold text-[#3F4354]">
                {option.label}
              </p>
            </NavLink>
          ) : option.to ? (
            <Link
              to={option.to}
              target={option.external ? "_blank" : "_self"}
              rel="noopener noreferrer"
              onClick={() => {
                setShowMenu(false);
                setShowManagerHubMenu(false);
              }}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer font-semibold"
            >
              {option.icon}
              <p className="text-sm font-semibold text-[#3F4354]">
                {option.label}
              </p>
            </Link>
          ) : (
            <button
              onClick={() => {
                option.action?.();
                setShowMenu(false);
                setShowManagerHubMenu(false);
              }}
              className="w-full flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer font-semibold"
            >
              {option.icon}
              <p className="text-sm font-semibold text-[#3F4354]">
                {option.label}
              </p>
            </button>
          )}
          {index !== options.length - 1 && (
            <div className="border-b border-b-[#E8E8EC]" />
          )}
        </div>
      ))}
    </div>
  );

  const handleMenuClick = (menuName: string) => {
    dispatch(setActiveTab(menuName));
  };

  const getPathFromMenu = (menuName: string) => {
    const standalonePages = [
      "feed",
      "awards",
      "badges",
      "goals",
      "growth",
      "profile",
      "hierarchy",
    ];
    return standalonePages.includes(menuName)
      ? `/${menuName}`
      : `/managerHub?tab=${menuName}`;
  };

  useEffect(() => {
    if (localStorage.getItem("feedTour") !== "true") {
      const timeout = setTimeout(() => {
        const menuitemEl = document.querySelector("#menu-item");
        const searchEl = document.querySelector("#search");
        const feedProfileEl = document.querySelector("#feedProfile");
        const feedEl = document.querySelector("#feed");
        const giveRecognitionEl = document.querySelector("#giveRecognition");
        const activityAreaEl = document.querySelector("#activityArea");
        const upcomingGoalAreaEl = document.querySelector("#upcomingGoalArea");
        console.log(menuitemEl);
        console.log(searchEl);
        console.log(searchEl);
        console.log(feedProfileEl);
        console.log(feedProfileEl);
        console.log(feedEl);

        if (
          menuitemEl &&
          searchEl &&
          feedProfileEl &&
          feedEl &&
          giveRecognitionEl &&
          activityAreaEl &&
          upcomingGoalAreaEl
        ) {
          const tour = driver({
            showProgress: true,
            steps: [
              {
                element: "#menu-item",
                popover: {
                  title: "Navigation Menu",
                  description:
                    "Access all key sections like Spotlight, Feed, Awards, Goals, and more from here.",
                },
              },
              {
                element: "#search",
                popover: {
                  title: "Search Section",
                  description:
                    "Use this to seamlessly find employees or awards. Select your search type from the dropdown, then start typing the name of the employee or award.",
                },
              },
              {
                element: "#giveRecognition",
                popover: {
                  title: "Give Recognition",
                  description:
                    "Celebrate someone's effort by sending them a recognition message. Select the badge, employee, and provide the content. You can also notify other employees or manager about this recognition.",
                },
              },

              {
                element: "#feed",
                popover: {
                  title: "Feed",
                  description:
                    "Explore recent recognitions, awards, and badges shared or earned by your team or organization. Celebrate great work by liking or commenting to show your appreciation.",
                },
              },
            ],
            onDestroyStarted: () => {
              localStorage.setItem("feedTour", "true");
              tour.destroy();
            },
          });

          tour.drive();
        }
      }, 500);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, []);

  return (
    <div className="fixed h-[65px] bg-white border-b border-[#E8E8EC] flex w-full z-10 top-0">
      <Container>
        <div className="w-full h-full flex gap-3 items-center justify-between">
          <div className="w-full flex flex-col md:flex-row justify-between items-center py-2 gap-4 md:gap-0">
            <div className="w-full md:w-3/5 flex items-center gap-2">
              <Link to="/feed">
                <img src={Logo} alt="logo" className="w-[100px] h-auto" />
              </Link>
              <div id="menu-item">
                <HamburgerMenu
                  hamburgerMenuOpen={hamburgerMenuOpen}
                  setHamburgerMenuOpen={setHamburgerMenuOpen}
                />
              </div>
              <div id="search" className="hidden sm:block flex-grow">
                <SearchBox />
              </div>
            </div>

            <div className="w-full md:w-2/5 flex items-center justify-end gap-4">
              <NavLink
                to="/feed"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#f6b710] flex items-center"
                    : "flex items-center"
                }
              >
                <div className="flex flex-col items-center">
                  <Newspaper
                    className={`w-5 h-5 ${
                      location.pathname === "/feed"
                        ? "text-[#585DF9]"
                        : "text-[#3F4354]"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      location.pathname === "/feed"
                        ? "text-[#585DF9]"
                        : "text-[#3F4354]"
                    } font-semibold`}
                  >
                    Feed
                  </p>
                </div>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#f6b710] flex items-center"
                    : "flex items-center"
                }
              >
                <div className="flex flex-col items-center">
                  <Sparkles
                    className={`w-5 h-5 ${
                      location.pathname === "/profile"
                        ? "text-[#585DF9]"
                        : "text-[#3F4354]"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      location.pathname === "/profile"
                        ? "text-[#585DF9]"
                        : "text-[#3F4354]"
                    } font-semibold`}
                  >
                    Spotlight
                  </p>
                </div>
              </NavLink>

              {/* Manager Hub */}
              {directReportee ? (
                <div className="relative" ref={managerHubRef}>
                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => {
                      setShowManagerHubMenu(!showManagerHubMenu);
                      setShowMenu(false);
                    }}
                  >
                    <UsersRound
                      className={`w-5 h-5 ${
                        showManagerHubMenu ? "text-[#585DF9]" : "text-[#3F4354]"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        showManagerHubMenu ? "text-[#585DF9]" : "text-[#3F4354]"
                      } font-semibold whitespace-nowrap`}
                    >
                      Manager Hub
                    </p>
                  </div>
                  {showManagerHubMenu && renderDropdown(managerHubOptions)}
                </div>
              ) : null}

              <NotificationPanel />

              <div className="relative" ref={avatarMenuRef}>
                <div
                  onClick={() => {
                    setShowMenu(!showMenu);
                    setShowManagerHubMenu(false);
                  }}
                  className="cursor-pointer"
                  id="navbar_avatar"
                >
                  <Avatar
                    image={imageWithTimestamp}
                    name={profileData?.data?.firstName || "User"}
                    size={45}
                  />
                </div>
                {showMenu && renderDropdown(menuOptions)}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
