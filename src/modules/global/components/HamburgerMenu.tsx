import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Award,
  FolderKanban,
  Goal,
  LayoutGrid,
  MessageSquareShare,
  Newspaper,
  Pyramid,
  Ribbon,
  Sparkles,
  Trophy,
  Waypoints,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../profile/slice/tabSlice";

interface menu {
  hamburgerMenuOpen?: boolean;
  setHamburgerMenuOpen?: any;
}

const HamburgerMenu: React.FC<menu> = ({
  hamburgerMenuOpen,
  setHamburgerMenuOpen,
}) => {
  const dispatch = useDispatch();
  const reportsTo = useSelector(
    (state: any) => state.feedProfile?.reportsTo || false
  );

  // State feedProfile reportsTo;
  const panelRef = useRef<HTMLDivElement>(null);
  const pages = [
    {
      menuName: "spotlight",
      menuDescription: "Step into your profile to see your achievements.",
    },
    {
      menuName: "feed",
      menuDescription: "Every moment matters in your personal feed.",
    },
    {
      menuName: "awards",
      menuDescription: "Earn awards to showcase your excellent impact.",
    },
    {
      menuName: "badges",
      menuDescription: "Explore all leadership principles through badges.",
    },
    {
      menuName: "hierarchy",
      menuDescription: "Climb the ranks in your organizational hierarchy.",
    },
    {
      menuName: "goals",
      menuDescription: "Set your sights high, create and reach your goals.",
    },
    {
      menuName: "growth",
      menuDescription: "Plan your growth through manager discussions.",
    },
    {
      menuName: "recognition",
      menuDescription: "Celebrate your accolades and shoutouts.",
    },
    {
      menuName: "insights",
      menuDescription: "Discover the power of insights to drive success.",
    },
    {
      menuName: "journey",
      menuDescription: "Your progress journey, one step at a time.",
    },
  ];

  const filteredPages =
    reportsTo === "Root"
      ? pages.filter((page) => page.menuName !== "growth")
      : pages;

  const handleHamburgerMenuOpen = () => {
    setHamburgerMenuOpen(!hamburgerMenuOpen);
  };

  const handleMenuClick = (menuName: string) => {
    const allowedTabs = ["recognition", "insights", "journey"];
    const tabToSet = allowedTabs.includes(menuName) ? menuName : "spotlight";
    dispatch(setActiveTab(tabToSet));
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
      : `/profile?tab=${menuName}`;
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setHamburgerMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative flex items-center" ref={panelRef}>
      <button
        onClick={handleHamburgerMenuOpen}
        style={{
          zIndex: 1400,
          color: "#585DF9",
        }}
      >
        <LayoutGrid />
      </button>

      {hamburgerMenuOpen && (
        <div
          className="bg-white absolute top-[40px] left-[-60px] w-[350px] z-20 rounded-[10px] overflow-hidden"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <div className="z-20">
            <ul className="py-2 px-0 m-0 z-20">
              {filteredPages.map((page, index) => (
                <NavLink
                  to={getPathFromMenu(page.menuName)}
                  key={index}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <li
                    className="flex items-center gap-3 list-none py-[10px] px-3 hover:bg-gray-100"
                    onClick={() => handleMenuClick(page.menuName)}
                  >
                    <div>
                      {page.menuName === "spotlight" && (
                        <Sparkles className="text-[#3F4354]" />
                      )}
                      {page.menuName === "feed" && (
                        <Newspaper className="text-[#3F4354]" />
                      )}
                      {page.menuName === "awards" && (
                        <Trophy className="text-[#3F4354]" />
                      )}
                      {page.menuName === "badges" && (
                        <Award className="text-[#3F4354]" />
                      )}
                      {page.menuName === "journey" && (
                        <Waypoints className="text-[#3F4354]" />
                      )}
                      {page.menuName === "hierarchy" && (
                        <Pyramid className="text-[#3F4354]" />
                      )}
                      {page.menuName === "recognition" && (
                        <Ribbon className="text-[#3F4354]" />
                      )}
                      {page.menuName === "insights" && (
                        <FolderKanban className="text-[#3F4354]" />
                      )}
                      {page.menuName === "goals" && (
                        <Goal className="text-[#3F4354]" />
                      )}
                      {page.menuName === "growth" && (
                        <MessageSquareShare className="text-[#3F4354]" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="capitalize text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
                        {page.menuName === "managerHub"
                          ? "Manager Hub"
                          : page.menuName}
                      </p>
                      <p className="mt-1 text-[#73737D]">
                        {page.menuDescription}
                      </p>
                    </div>
                  </li>
                </NavLink>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
